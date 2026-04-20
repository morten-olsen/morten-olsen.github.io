"""Shared utilities for the negation experiments."""

import os

import numpy as np
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

DEVICE = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
SEED = 42

# Memory safety: abort if process RSS exceeds this (bytes). Default 18GB,
# leaving ~6GB headroom on a 24GB Mac so we get a clean abort instead of
# a kernel panic from MPS eating all swap.
MEMORY_CEILING = int(os.environ.get("MEMORY_CEILING_GB", "18")) * 1024**3


def check_memory(label: str = ""):
    """Abort if process RSS exceeds MEMORY_CEILING. MPS doesn't OOM gracefully —
    it will eat swap until macOS panics. This is the seatbelt."""
    try:
        import resource
        rss = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        # macOS reports bytes, Linux reports KB
        if rss < 1024**3:  # probably KB (Linux)
            rss *= 1024
        if rss > MEMORY_CEILING:
            gb = rss / 1024**3
            ceiling_gb = MEMORY_CEILING / 1024**3
            raise MemoryError(
                f"Memory safety: RSS {gb:.1f}GB exceeds ceiling {ceiling_gb:.1f}GB "
                f"at checkpoint '{label}'. Aborting to prevent system crash. "
                f"Set MEMORY_CEILING_GB env var to adjust."
            )
    except ImportError:
        pass  # no resource module, skip check


def load_model(model_name: str, output_attentions: bool = False, output_hidden_states: bool = True):
    print(f"Loading {model_name} on {DEVICE}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        trust_remote_code=True,
        torch_dtype=torch.float16 if DEVICE != "cpu" else torch.float32,
        output_hidden_states=output_hidden_states,
        output_attentions=output_attentions,
    ).to(DEVICE)
    model.eval()
    check_memory("after model load")
    return model, tokenizer


def extract_hidden_states(model, tokenizer, text: str, layer_indices: list[int]):
    """
    Run text through model, return hidden state at last token
    for each requested layer. Returns (dict of {layer_idx: numpy array}, token_count).
    """
    inputs = tokenizer(text, return_tensors="pt").to(DEVICE)
    token_count = inputs["input_ids"].shape[1]

    with torch.no_grad():
        outputs = model(**inputs)

    hidden_states = outputs.hidden_states

    result = {}
    for layer_idx in layer_indices:
        state = hidden_states[layer_idx][0, -1, :].cpu().float().numpy()
        result[layer_idx] = state

    return result, token_count


def compute_layer_indices(num_layers: int) -> dict[str, int]:
    """Pick early, mid, and late layer indices."""
    return {
        "early": 2,
        "mid": num_layers // 2,
        "late": num_layers - 2,
    }


def model_slug(model_name: str) -> str:
    return model_name.split("/")[-1]


def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def extract_attention(model, tokenizer, text: str, layer_indices: list[int] | None = None):
    """
    Run text through model with attention output.
    Returns (attentions, token_ids).

    If layer_indices is provided, only those layers are kept (the rest are freed
    immediately to limit memory). This is critical for larger models on MPS where
    keeping all 32 layers of attention tensors can cause system-level crashes.

    attentions: dict of {layer_idx: tensor} if layer_indices given,
                else tuple of all layers (legacy behavior)
    token_ids: list of token id ints
    """
    inputs = tokenizer(text, return_tensors="pt").to(DEVICE)
    token_ids = inputs["input_ids"][0].tolist()

    with torch.no_grad():
        outputs = model(**inputs)

    if layer_indices is not None:
        # Selective: only keep requested layers, free everything else
        keep = set(layer_indices)
        attentions = {}
        for i, a in enumerate(outputs.attentions):
            if i in keep:
                attentions[i] = a.cpu().float()
        # Explicitly delete the full attention tuple from the outputs
        del outputs
        if DEVICE == "mps":
            torch.mps.empty_cache()
        check_memory("after selective attention extraction")
    else:
        # Legacy: keep all layers (used by smaller models)
        attentions = tuple(a.cpu().float() for a in outputs.attentions)
        del outputs
        if DEVICE == "mps":
            torch.mps.empty_cache()

    return attentions, token_ids
