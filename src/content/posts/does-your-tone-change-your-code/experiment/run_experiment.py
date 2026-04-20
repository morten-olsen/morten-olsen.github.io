#!/usr/bin/env python3
"""
Experiment: Does tone/register in prompts create distinct representations
in an LLM's hidden states?

Feeds 60 prompts (10 coding tasks + 5 non-coding controls × 4 tones) through
an open model, extracts hidden states at the last token from early/mid/late
layers, and produces UMAP visualizations + silhouette scores.

Controls establish that the model separates genuinely different intents. If
controls don't cluster away from coding prompts, the experiment setup is broken.

Usage:
    python run_experiment.py [--model MODEL_NAME]

Default model: deepseek-ai/deepseek-coder-1.3b-instruct
"""

import argparse
import json
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm
from transformers import AutoModelForCausalLM, AutoTokenizer
from umap import UMAP

from prompts import TONES, get_all_prompts

DEVICE = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
BASE_OUTPUT_DIR = Path(__file__).parent / "output"
SEED = 42


def load_model(model_name: str):
    print(f"Loading {model_name} on {DEVICE}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        trust_remote_code=True,
        torch_dtype=torch.float16 if DEVICE != "cpu" else torch.float32,
        output_hidden_states=True,
    ).to(DEVICE)
    model.eval()
    return model, tokenizer


def extract_hidden_states(model, tokenizer, text: str, layer_indices: list[int]):
    """
    Tokenize text, run through model, return hidden state at last token
    for each requested layer. Returns dict of {layer_idx: numpy array}.
    """
    inputs = tokenizer(text, return_tensors="pt").to(DEVICE)
    token_count = inputs["input_ids"].shape[1]

    with torch.no_grad():
        outputs = model(**inputs)

    hidden_states = outputs.hidden_states  # tuple of (batch, seq_len, hidden_dim)

    result = {}
    for layer_idx in layer_indices:
        # Last token's hidden state at this layer
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


def run_umap(vectors: np.ndarray, seed: int = SEED) -> np.ndarray:
    reducer = UMAP(n_components=2, random_state=seed, n_neighbors=10, min_dist=0.1)
    return reducer.fit_transform(vectors)


def run_pca(vectors: np.ndarray) -> np.ndarray:
    reducer = PCA(n_components=2, random_state=SEED)
    return reducer.fit_transform(vectors)


def plot_cosine_heatmap(
    vectors: np.ndarray,
    labels: list[str],
    title: str,
    filename: str,
    output_dir: Path,
):
    """Plot mean cosine similarity between groups defined by labels."""
    unique = sorted(set(labels))
    n = len(unique)
    sim_matrix = np.zeros((n, n))

    for i, a in enumerate(unique):
        for j, b in enumerate(unique):
            mask_a = np.array([l == a for l in labels])
            mask_b = np.array([l == b for l in labels])
            sims = cosine_similarity(vectors[mask_a], vectors[mask_b])
            sim_matrix[i, j] = sims.mean()

    fig, ax = plt.subplots(figsize=(8, 7))
    im = ax.imshow(sim_matrix, cmap="RdYlBu_r", vmin=sim_matrix.min(), vmax=1.0)
    ax.set_xticks(range(n))
    ax.set_yticks(range(n))
    ax.set_xticklabels(unique, rotation=45, ha="right", fontsize=9)
    ax.set_yticklabels(unique, fontsize=9)

    for i in range(n):
        for j in range(n):
            ax.text(j, i, f"{sim_matrix[i, j]:.3f}", ha="center", va="center", fontsize=7)

    ax.set_title(title, fontsize=13)
    fig.colorbar(im, ax=ax, shrink=0.8)
    fig.tight_layout()
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def plot_scatter(
    coords_2d: np.ndarray,
    labels: list[str],
    title: str,
    filename: str,
    output_dir: Path,
    palette: dict[str, str] | None = None,
):
    fig, ax = plt.subplots(figsize=(10, 8))

    unique_labels = sorted(set(labels))
    if palette is None:
        cmap = plt.cm.get_cmap("tab10", len(unique_labels))
        palette = {label: cmap(i) for i, label in enumerate(unique_labels)}

    for label in unique_labels:
        mask = [l == label for l in labels]
        ax.scatter(
            coords_2d[mask, 0],
            coords_2d[mask, 1],
            label=label,
            color=palette[label],
            s=80,
            alpha=0.8,
            edgecolors="white",
            linewidth=0.5,
        )

    ax.set_title(title, fontsize=14)
    ax.legend(bbox_to_anchor=(1.05, 1), loc="upper left")
    ax.set_xticks([])
    ax.set_yticks([])
    fig.tight_layout()
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def compute_silhouette(vectors: np.ndarray, labels: list[str]) -> float:
    le = LabelEncoder()
    encoded = le.fit_transform(labels)
    if len(set(encoded)) < 2:
        return 0.0
    return silhouette_score(vectors, encoded, metric="cosine")


def main():
    parser = argparse.ArgumentParser(description="Tone-in-LLM hidden state experiment")
    parser.add_argument(
        "--model",
        default="deepseek-ai/deepseek-coder-1.3b-instruct",
        help="HuggingFace model name (default: deepseek-ai/deepseek-coder-1.3b-instruct)",
    )
    args = parser.parse_args()

    # Model-specific output directory (e.g. output/deepseek-coder-1.3b-instruct/)
    model_slug = args.model.split("/")[-1]
    output_dir = BASE_OUTPUT_DIR / model_slug
    output_dir.mkdir(parents=True, exist_ok=True)

    model, tokenizer = load_model(args.model)
    num_layers = model.config.num_hidden_layers
    layer_map = compute_layer_indices(num_layers)
    layer_indices = list(layer_map.values())

    print(f"Model has {num_layers} layers. Probing: {layer_map}")

    # Collect hidden states
    all_prompts = list(get_all_prompts())
    task_ids = []
    tones = []
    groups = []
    token_counts = []
    states_by_layer = {idx: [] for idx in layer_indices}

    print(f"\n[Phase 1/3] Extracting hidden states from {len(all_prompts)} prompts...")
    for task_id, tone, prompt_text, group in tqdm(all_prompts, desc="Extracting", unit="prompt"):
        states, n_tokens = extract_hidden_states(model, tokenizer, prompt_text, layer_indices)

        task_ids.append(task_id)
        tones.append(tone)
        groups.append(group)
        token_counts.append(n_tokens)
        for idx in layer_indices:
            states_by_layer[idx].append(states[idx])

    # Convert to arrays
    for idx in layer_indices:
        states_by_layer[idx] = np.stack(states_by_layer[idx])

    groups_arr = np.array(groups)

    # Palettes
    tone_colors = {
        "casual": "#E63946",
        "professional": "#457B9D",
        "terse": "#2A9D8F",
        "academic": "#E9C46A",
    }
    group_colors = {
        "coding": "#457B9D",
        "control": "#E63946",
    }

    # Analysis per layer
    print(f"\n[Phase 2/3] Analyzing {len(layer_map)} layers (UMAP + PCA + heatmaps)...")
    results = {}
    for li, (label, layer_idx) in enumerate(layer_map.items(), 1):
        print(f"\n  Layer {li}/{len(layer_map)}: {label} (index {layer_idx})")
        t0 = time.monotonic()
        vectors = states_by_layer[layer_idx]

        # UMAP on all data (coding + controls together)
        coords_umap = run_umap(vectors)
        coords_pca = run_pca(vectors)

        # Plot 1: colored by group (coding vs control) — the sanity check
        for method, coords in [("umap", coords_umap), ("pca", coords_pca)]:
            plot_scatter(
                coords, groups,
                f"{method.upper()} — {label.title()} Layer (coding vs control)",
                f"{label}_{method}_by_group.png",
                output_dir,
                palette=group_colors,
            )

        # Plot 2: colored by tone (all prompts) — UMAP only
        plot_scatter(
            coords_umap, tones,
            f"Hidden States — {label.title()} Layer (colored by tone)",
            f"{label}_umap_by_tone.png",
            output_dir,
            palette=tone_colors,
        )

        # Plot 3: colored by task/intent (all prompts) — UMAP only
        plot_scatter(
            coords_umap, task_ids,
            f"Hidden States — {label.title()} Layer (colored by task)",
            f"{label}_umap_by_task.png",
            output_dir,
        )

        # Plot 4: coding prompts only
        coding_mask = groups_arr == "coding"
        if coding_mask.sum() > 5:
            coding_vectors = vectors[coding_mask]
            coding_coords_umap = run_umap(coding_vectors)
            coding_coords_pca = run_pca(coding_vectors)
            coding_tones = [t for t, g in zip(tones, groups) if g == "coding"]
            coding_tasks = [t for t, g in zip(task_ids, groups) if g == "coding"]

            for method, c in [("umap", coding_coords_umap), ("pca", coding_coords_pca)]:
                plot_scatter(
                    c, coding_tones,
                    f"Coding Only {method.upper()} — {label.title()} Layer (by tone)",
                    f"{label}_{method}_coding_by_tone.png",
                    output_dir,
                    palette=tone_colors,
                )
                plot_scatter(
                    c, coding_tasks,
                    f"Coding Only {method.upper()} — {label.title()} Layer (by task)",
                    f"{label}_{method}_coding_by_task.png",
                    output_dir,
                )

        # Cosine similarity heatmaps (coding prompts only)
        if coding_mask.sum() > 5:
            plot_cosine_heatmap(
                coding_vectors, coding_tones,
                f"Cosine Similarity by Tone — {label.title()} Layer",
                f"{label}_cosine_by_tone.png",
                output_dir,
            )
            plot_cosine_heatmap(
                coding_vectors, coding_tasks,
                f"Cosine Similarity by Task — {label.title()} Layer",
                f"{label}_cosine_by_task.png",
                output_dir,
            )

        # Silhouette scores
        sil_group = compute_silhouette(vectors, groups)
        sil_tone = compute_silhouette(vectors, tones)
        sil_task = compute_silhouette(vectors, task_ids)

        # Tone silhouette within coding prompts only
        sil_tone_coding = compute_silhouette(
            vectors[coding_mask],
            [t for t, g in zip(tones, groups) if g == "coding"],
        )
        sil_task_coding = compute_silhouette(
            vectors[coding_mask],
            [t for t, g in zip(task_ids, groups) if g == "coding"],
        )

        results[label] = {
            "layer_index": layer_idx,
            "silhouette_group": round(sil_group, 4),
            "silhouette_tone": round(sil_tone, 4),
            "silhouette_task": round(sil_task, 4),
            "silhouette_tone_coding_only": round(sil_tone_coding, 4),
            "silhouette_task_coding_only": round(sil_task_coding, 4),
        }
        elapsed = time.monotonic() - t0
        print(f"    Silhouette (group):              {sil_group:.4f}")
        print(f"    Silhouette (tone):               {sil_tone:.4f}")
        print(f"    Silhouette (task):               {sil_task:.4f}")
        print(f"    Silhouette (tone, coding only):  {sil_tone_coding:.4f}")
        print(f"    Silhouette (task, coding only):  {sil_task_coding:.4f}")
        print(f"    Done in {elapsed:.1f}s")

    # Save metadata
    print(f"\n[Phase 3/3] Saving results...")
    metadata = {
        "model": args.model,
        "device": DEVICE,
        "num_layers": num_layers,
        "layer_map": layer_map,
        "num_prompts": len(task_ids),
        "num_coding": int((groups_arr == "coding").sum()),
        "num_control": int((groups_arr == "control").sum()),
        "token_counts": {
            f"{tid}_{tone}": tc
            for tid, tone, tc in zip(task_ids, tones, token_counts)
        },
        "results": results,
    }
    meta_path = output_dir / "results.json"
    meta_path.write_text(json.dumps(metadata, indent=2))
    print(f"\nResults saved to {meta_path}")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Prompts: {len(task_ids)} ({int((groups_arr == 'coding').sum())} coding + {int((groups_arr == 'control').sum())} control)")
    print()
    for label, res in results.items():
        print(f"  {label:6s} layer:")
        print(f"    group (coding vs ctrl):  {res['silhouette_group']:+.4f}  ← should be high (sanity check)")
        print(f"    tone  (all prompts):     {res['silhouette_tone']:+.4f}")
        print(f"    task  (all prompts):     {res['silhouette_task']:+.4f}")
        print(f"    tone  (coding only):     {res['silhouette_tone_coding_only']:+.4f}  ← key metric")
        print(f"    task  (coding only):     {res['silhouette_task_coding_only']:+.4f}")
        print()
    print("Silhouette > 0 = meaningful clustering. Higher = tighter clusters.")
    print("If 'group' is low, the experiment setup is broken — controls")
    print("should separate from coding prompts.")
    print("If 'tone (coding only)' is high at late layers, tone significantly")
    print("conditions the output distribution.")


if __name__ == "__main__":
    main()
