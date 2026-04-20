#!/usr/bin/env python3
"""
Experiment 2b: Attention-Based Instruction Decay

Instead of comparing hidden states to external reference vectors (which suffers
from length mismatch), we directly measure how much attention the LAST token
pays to the INSTRUCTION tokens vs the CODE tokens as context grows.

This asks: "Is the model still looking at the instruction when it's about to
generate?" — the most direct test of whether instructions drown in context.

For each filler level we compute:
  - instruction_attention: sum of attention from last token to instruction region
  - code_attention: sum of attention from last token to code region
  - instruction_share: instruction_attention / (instruction + code)

We average across all heads per layer, and track across layers.

Usage:
    python exp2b_attention_decay.py [--model MODEL_NAME]
"""

import argparse
import json
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from tqdm import tqdm

from exp2_context_fillers import FILLERS
from shared import (
    check_memory,
    compute_layer_indices,
    extract_attention,
    load_model,
    model_slug,
    DEVICE,
)

BASE_OUTPUT_DIR = Path(__file__).parent / "output" / "exp2b_attention_decay"

PATTERNS = [
    {
        "id": "var_declarations",
        "negate_instruction": "Refactor the following code to not use var declarations. Use const and let instead.\n\n",
        "positive_instruction": "Refactor the following code to use const and let for all variable declarations.\n\n",
        "filler_key": "var_declarations",
    },
    {
        "id": "callbacks",
        "negate_instruction": "Refactor the following code to not use callbacks. Use async/await instead.\n\n",
        "positive_instruction": "Refactor the following code to use async/await for all asynchronous operations.\n\n",
        "filler_key": "callbacks",
    },
]

FILLER_STEPS = [0, 1, 2, 3, 4, 5, 6]

SUFFIX = "\n\nNow write the refactored version:"


def build_prompt_with_regions(instruction: str, filler_blocks: list[str], tokenizer):
    """
    Build prompt and return (full_text, instruction_end_idx, code_end_idx).
    Indices are token positions (inclusive).
    """
    if not filler_blocks:
        code_section = "// (no code yet)"
    else:
        code_section = "```javascript\n" + "\n\n".join(filler_blocks) + "\n```"

    full_text = instruction + code_section + SUFFIX

    # Tokenize each region to find boundaries
    instr_tokens = tokenizer(instruction, return_tensors="pt")["input_ids"][0]
    full_tokens = tokenizer(full_text, return_tensors="pt")["input_ids"][0]
    suffix_tokens = tokenizer(SUFFIX, return_tensors="pt")["input_ids"][0]

    instr_len = len(instr_tokens)
    full_len = len(full_tokens)
    suffix_len = len(suffix_tokens)

    # Regions (approximate — tokenization isn't perfectly compositional)
    # instruction: [0, instr_len)
    # code: [instr_len, full_len - suffix_len)
    # suffix: [full_len - suffix_len, full_len)
    return full_text, instr_len, full_len - suffix_len, full_len


def compute_attention_shares(attentions, instr_end: int, code_end: int, total_len: int):
    """
    For each layer, compute the attention the LAST token pays to:
      - instruction region [0, instr_end)
      - code region [instr_end, code_end)
      - suffix region [code_end, total_len)

    attentions: dict of {layer_idx: tensor} or tuple of tensors (legacy)

    Returns dict of layer_idx -> {instruction_share, code_share, suffix_share,
    instruction_attn, code_attn, per_token_instruction, per_token_code}
    """
    results = {}

    # Support both dict (selective) and tuple (legacy) formats
    if isinstance(attentions, dict):
        items = attentions.items()
    else:
        items = enumerate(attentions)

    for layer_idx, attn in items:
        # attn shape: (1, num_heads, seq_len, seq_len)
        # We want: attention FROM last token TO all other tokens, averaged over heads
        last_token_attn = attn[0, :, -1, :].mean(dim=0).numpy()  # (seq_len,)

        instr_attn = last_token_attn[:instr_end].sum()
        code_attn = last_token_attn[instr_end:code_end].sum() if code_end > instr_end else 0.0
        suffix_attn = last_token_attn[code_end:].sum()
        total = instr_attn + code_attn + suffix_attn

        instr_len = max(instr_end, 1)
        code_len = max(code_end - instr_end, 1)

        results[layer_idx] = {
            "instruction_share": float(instr_attn / total) if total > 0 else 0,
            "code_share": float(code_attn / total) if total > 0 else 0,
            "suffix_share": float(suffix_attn / total) if total > 0 else 0,
            "per_token_instruction": float(instr_attn / instr_len),
            "per_token_code": float(code_attn / code_len),
        }

    return results


def plot_attention_decay(
    decay_data: dict,
    pattern_id: str,
    layer_indices: dict[str, int],
    output_dir: Path,
):
    """Plot instruction_share over filler steps, per framing, for each layer."""
    fig, axes = plt.subplots(1, len(layer_indices), figsize=(6 * len(layer_indices), 5), sharey=True)
    if len(layer_indices) == 1:
        axes = [axes]

    for ax, (label, layer_idx) in zip(axes, layer_indices.items()):
        for framing, color, style in [
            ("negate", "#E63946", "--"),
            ("positive", "#2A9D8F", "-"),
        ]:
            d = decay_data[framing]
            steps = d["filler_counts"]
            shares = [d["layers"][s][layer_idx]["instruction_share"] for s in steps]
            ax.plot(steps, shares, f"o{style}", color=color, label=framing, linewidth=2)

        ax.set_xlabel("Filler blocks")
        ax.set_ylabel("Instruction attention share" if ax == axes[0] else "")
        ax.set_title(f"{label.title()} layer (idx {layer_idx})")
        ax.legend()
        ax.set_ylim(0, None)

    fig.suptitle(f"Instruction Attention Decay — {pattern_id}", fontsize=14)
    fig.tight_layout()
    filename = f"{pattern_id}_attention_decay.png"
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def plot_per_token_comparison(
    decay_data: dict,
    pattern_id: str,
    layer_indices: dict[str, int],
    output_dir: Path,
):
    """
    Plot per-token attention (instruction vs code) — normalized by region length.
    This shows: does each instruction token still get more attention than each code
    token, or does code eventually win per-token?
    """
    fig, axes = plt.subplots(1, len(layer_indices), figsize=(6 * len(layer_indices), 5), sharey=True)
    if len(layer_indices) == 1:
        axes = [axes]

    for ax, (label, layer_idx) in zip(axes, layer_indices.items()):
        for framing in ["negate", "positive"]:
            d = decay_data[framing]
            steps = d["filler_counts"]

            instr_pt = [d["layers"][s][layer_idx]["per_token_instruction"] for s in steps]
            code_pt = [d["layers"][s][layer_idx]["per_token_code"] for s in steps]

            lstyle = "--" if framing == "negate" else "-"
            ax.plot(steps, instr_pt, f"o{lstyle}", color="#457B9D", label=f"instruction ({framing})", linewidth=2)
            ax.plot(steps, code_pt, f"s{lstyle}", color="#E9C46A", label=f"code ({framing})", linewidth=1.5)

        ax.set_xlabel("Filler blocks")
        ax.set_ylabel("Attention per token" if ax == axes[0] else "")
        ax.set_title(f"{label.title()} layer")
        ax.legend(fontsize=8)

    fig.suptitle(f"Per-Token Attention: Instruction vs Code — {pattern_id}", fontsize=14)
    fig.tight_layout()
    filename = f"{pattern_id}_per_token_attention.png"
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def main():
    parser = argparse.ArgumentParser(description="Experiment 2b: Attention decay")
    parser.add_argument(
        "--model",
        default="deepseek-ai/deepseek-coder-1.3b-instruct",
        help="HuggingFace model name",
    )
    args = parser.parse_args()

    slug = model_slug(args.model)
    output_dir = BASE_OUTPUT_DIR / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    model, tokenizer = load_model(args.model, output_attentions=True, output_hidden_states=False)
    num_layers = model.config.num_hidden_layers
    layer_map = compute_layer_indices(num_layers)
    probe_layers = list(layer_map.values())  # only extract attention for layers we actually use

    print(f"Model has {num_layers} layers. Probing: {layer_map}")

    all_results = {}

    total = len(PATTERNS) * 2 * len(FILLER_STEPS)
    pbar = tqdm(total=total, desc="Extracting", unit="prompt")

    for pattern in PATTERNS:
        pid = pattern["id"]
        fillers = FILLERS[pattern["filler_key"]]
        pattern_data = {}

        for framing in ["negate", "positive"]:
            instruction = pattern[f"{framing}_instruction"]
            filler_counts = []
            token_counts = []
            layers_by_step = {}

            for n_fillers in FILLER_STEPS:
                blocks = fillers[:n_fillers]
                full_text, instr_end, code_end, total_len = build_prompt_with_regions(
                    instruction, blocks, tokenizer
                )

                attentions, token_ids = extract_attention(
                    model, tokenizer, full_text, layer_indices=probe_layers
                )
                shares = compute_attention_shares(attentions, instr_end, code_end, total_len)
                del attentions
                if DEVICE == "mps":
                    import torch
                    torch.mps.empty_cache()

                filler_counts.append(n_fillers)
                token_counts.append(total_len)
                layers_by_step[n_fillers] = shares
                pbar.update(1)

            pattern_data[framing] = {
                "filler_counts": filler_counts,
                "token_counts": token_counts,
                "layers": layers_by_step,
            }

        all_results[pid] = pattern_data
        plot_attention_decay(pattern_data, pid, layer_map, output_dir)
        plot_per_token_comparison(pattern_data, pid, layer_map, output_dir)

    pbar.close()

    # Save
    # Convert layer indices keys to strings for JSON
    serializable = {}
    for pid, pdata in all_results.items():
        serializable[pid] = {}
        for framing, fdata in pdata.items():
            serializable[pid][framing] = {
                "filler_counts": fdata["filler_counts"],
                "token_counts": fdata["token_counts"],
                "layers": {
                    str(step): {str(k): v for k, v in layers.items()}
                    for step, layers in fdata["layers"].items()
                },
            }

    meta_path = output_dir / "results.json"
    meta_path.write_text(json.dumps({
        "model": args.model,
        "num_layers": num_layers,
        "layer_map": layer_map,
        "results": serializable,
    }, indent=2))

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY — Late Layer Instruction Attention Share")
    print("=" * 60)
    late_idx = layer_map["late"]
    for pid, pdata in all_results.items():
        print(f"\n  {pid}:")
        for framing in ["negate", "positive"]:
            d = pdata[framing]
            steps = d["filler_counts"]
            shares = [d["layers"][s][late_idx]["instruction_share"] for s in steps]
            pt_instr = [d["layers"][s][late_idx]["per_token_instruction"] for s in steps]
            pt_code = [d["layers"][s][late_idx]["per_token_code"] for s in steps]

            print(f"    {framing:8s}: share {shares[0]:.3f} → {shares[-1]:.3f}  "
                  f"(per-token instr: {pt_instr[0]:.4f}→{pt_instr[-1]:.4f}, "
                  f"code: {pt_code[0]:.4f}→{pt_code[-1]:.4f})")
    print()
    print("instruction_share = fraction of last-token attention going to instruction.")
    print("per_token = attention normalized by region length (fair comparison).")


if __name__ == "__main__":
    main()
