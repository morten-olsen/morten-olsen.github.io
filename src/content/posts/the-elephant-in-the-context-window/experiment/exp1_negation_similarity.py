#!/usr/bin/env python3
"""
Experiment 1: Negation vs Affirmation in Hidden States

Question: How does "do X" vs "don't do X" look in the model's hidden states?
Is "don't use callbacks" closer to "use callbacks" or to "use async/await"?

For each pattern pair, we measure cosine similarity between:
  - affirm ↔ negate   (does negation create distance from the concept?)
  - affirm ↔ alternative  (how far is the genuine alternative?)
  - negate ↔ alternative   (is negation closer to the concept or the replacement?)

If negation works perfectly, negate should be close to alternative and far from
affirm. If negation is "leaky," negate will be closer to affirm than to alternative.

Usage:
    python exp1_negation_similarity.py [--model MODEL_NAME]
"""

import argparse
import json
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from tqdm import tqdm

from prompts import PAIRS, VARIANTS, get_all_prompts
from shared import (
    SEED,
    compute_layer_indices,
    cosine_sim,
    extract_hidden_states,
    load_model,
    model_slug,
)

BASE_OUTPUT_DIR = Path(__file__).parent / "output" / "exp1_negation_similarity"


def plot_similarity_bars(
    pair_results: list[dict],
    layer_label: str,
    output_dir: Path,
):
    """Bar chart: for each pair, show affirm↔negate, affirm↔alt, negate↔alt."""
    ids = [r["id"] for r in pair_results]
    affirm_negate = [r["affirm_negate"] for r in pair_results]
    affirm_alt = [r["affirm_alternative"] for r in pair_results]
    negate_alt = [r["negate_alternative"] for r in pair_results]

    x = np.arange(len(ids))
    width = 0.25

    fig, ax = plt.subplots(figsize=(14, 7))
    ax.bar(x - width, affirm_negate, width, label="affirm ↔ negate", color="#E63946")
    ax.bar(x, affirm_alt, width, label="affirm ↔ alternative", color="#457B9D")
    ax.bar(x + width, negate_alt, width, label="negate ↔ alternative", color="#2A9D8F")

    ax.set_ylabel("Cosine Similarity")
    ax.set_title(f"Negation Similarity — {layer_label.title()} Layer")
    ax.set_xticks(x)
    ax.set_xticklabels(ids, rotation=45, ha="right", fontsize=9)
    ax.legend()

    # Add a horizontal line at the mean of each group
    for vals, color, offset in [
        (affirm_negate, "#E63946", -width),
        (affirm_alt, "#457B9D", 0),
        (negate_alt, "#2A9D8F", width),
    ]:
        mean = np.mean(vals)
        ax.axhline(y=mean, color=color, linestyle="--", alpha=0.4, linewidth=1)

    fig.tight_layout()
    filename = f"{layer_label}_similarity_bars.png"
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def plot_leakiness_scatter(
    pair_results: list[dict],
    layer_label: str,
    output_dir: Path,
):
    """
    Scatter: x = affirm↔negate, y = negate↔alternative.
    If negation works: points are bottom-right (far from affirm, close to alt).
    If negation leaks: points are top-left (close to affirm, far from alt).
    """
    fig, ax = plt.subplots(figsize=(8, 8))

    for r in pair_results:
        ax.scatter(
            r["affirm_negate"],
            r["negate_alternative"],
            s=100,
            zorder=3,
        )
        ax.annotate(
            r["id"],
            (r["affirm_negate"], r["negate_alternative"]),
            fontsize=8,
            textcoords="offset points",
            xytext=(5, 5),
        )

    # Diagonal: above = negation leans toward alternative, below = toward concept
    all_vals = [r["affirm_negate"] for r in pair_results] + [r["negate_alternative"] for r in pair_results]
    margin = 0.1
    lo = min(all_vals) - margin
    hi = max(all_vals) + margin
    lim = (lo, hi)
    ax.plot(lim, lim, "k--", alpha=0.3, linewidth=1)
    ax.set_xlabel("affirm ↔ negate (higher = negation leaks)")
    ax.set_ylabel("negate ↔ alternative (higher = negation works)")
    ax.set_title(f"Negation Leakiness — {layer_label.title()} Layer")
    ax.set_aspect("equal")

    fig.tight_layout()
    filename = f"{layer_label}_leakiness_scatter.png"
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def main():
    parser = argparse.ArgumentParser(description="Experiment 1: Negation similarity")
    parser.add_argument(
        "--model",
        default="deepseek-ai/deepseek-coder-1.3b-instruct",
        help="HuggingFace model name",
    )
    args = parser.parse_args()

    slug = model_slug(args.model)
    output_dir = BASE_OUTPUT_DIR / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    model, tokenizer = load_model(args.model)
    num_layers = model.config.num_hidden_layers
    layer_map = compute_layer_indices(num_layers)
    layer_indices = list(layer_map.values())

    print(f"Model has {num_layers} layers. Probing: {layer_map}")

    # Extract hidden states for all prompts
    all_prompts = list(get_all_prompts())
    states = {}  # (pair_id, variant) -> {layer_idx: vector}

    print(f"\n[Phase 1/2] Extracting hidden states from {len(all_prompts)} prompts...")
    for pair_id, variant, text in tqdm(all_prompts, desc="Extracting", unit="prompt"):
        hs, n_tokens = extract_hidden_states(model, tokenizer, text, layer_indices)
        states[(pair_id, variant)] = hs

    # Compute similarities per layer (raw + centered)
    print(f"\n[Phase 2/2] Computing similarities (raw + centered)...")
    results = {}
    for label, layer_idx in layer_map.items():
        t0 = time.monotonic()

        # Collect all vectors for this layer to compute the mean
        all_vectors = np.stack([
            states[key][layer_idx] for key in states
        ])
        mean_vector = all_vectors.mean(axis=0)

        pair_results = []
        for pair in PAIRS:
            pid = pair["id"]
            v_affirm = states[(pid, "affirm")][layer_idx]
            v_negate = states[(pid, "negate")][layer_idx]
            v_alt = states[(pid, "alternative")][layer_idx]

            # Raw cosine similarity
            raw_an = cosine_sim(v_affirm, v_negate)
            raw_aa = cosine_sim(v_affirm, v_alt)
            raw_na = cosine_sim(v_negate, v_alt)

            # Centered cosine: subtract the mean direction, then compare
            c_affirm = v_affirm - mean_vector
            c_negate = v_negate - mean_vector
            c_alt = v_alt - mean_vector

            cen_an = cosine_sim(c_affirm, c_negate)
            cen_aa = cosine_sim(c_affirm, c_alt)
            cen_na = cosine_sim(c_negate, c_alt)

            pair_results.append({
                "id": pid,
                # Raw
                "raw_affirm_negate": round(raw_an, 4),
                "raw_affirm_alternative": round(raw_aa, 4),
                "raw_negate_alternative": round(raw_na, 4),
                "raw_leakiness": round(raw_an - raw_na, 4),
                # Centered
                "affirm_negate": round(cen_an, 4),
                "affirm_alternative": round(cen_aa, 4),
                "negate_alternative": round(cen_na, 4),
                "leakiness": round(cen_an - cen_na, 4),
            })

        # Plots use centered values
        plot_similarity_bars(pair_results, label, output_dir)
        plot_leakiness_scatter(pair_results, label, output_dir)

        # Aggregate stats
        def mean_of(key):
            return round(np.mean([r[key] for r in pair_results]), 4)

        results[label] = {
            "layer_index": layer_idx,
            "pairs": pair_results,
            "raw_mean_affirm_negate": mean_of("raw_affirm_negate"),
            "raw_mean_affirm_alternative": mean_of("raw_affirm_alternative"),
            "raw_mean_negate_alternative": mean_of("raw_negate_alternative"),
            "raw_mean_leakiness": mean_of("raw_leakiness"),
            "centered_mean_affirm_negate": mean_of("affirm_negate"),
            "centered_mean_affirm_alternative": mean_of("affirm_alternative"),
            "centered_mean_negate_alternative": mean_of("negate_alternative"),
            "centered_mean_leakiness": mean_of("leakiness"),
        }

        elapsed = time.monotonic() - t0
        print(f"\n  {label} layer (index {layer_idx}) — {elapsed:.1f}s")
        print(f"    RAW:")
        print(f"      affirm ↔ negate:      {mean_of('raw_affirm_negate'):.4f}")
        print(f"      affirm ↔ alternative: {mean_of('raw_affirm_alternative'):.4f}")
        print(f"      negate ↔ alternative: {mean_of('raw_negate_alternative'):.4f}")
        print(f"      leakiness:            {mean_of('raw_leakiness'):+.4f}")
        print(f"    CENTERED (dimensional collapse removed):")
        print(f"      affirm ↔ negate:      {mean_of('affirm_negate'):.4f}")
        print(f"      affirm ↔ alternative: {mean_of('affirm_alternative'):.4f}")
        print(f"      negate ↔ alternative: {mean_of('negate_alternative'):.4f}")
        print(f"      leakiness:            {mean_of('leakiness'):+.4f}")

    # Save results
    metadata = {
        "model": args.model,
        "num_layers": num_layers,
        "layer_map": layer_map,
        "num_pairs": len(PAIRS),
        "results": results,
    }
    meta_path = output_dir / "results.json"
    meta_path.write_text(json.dumps(metadata, indent=2))
    print(f"\nResults saved to {meta_path}")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY (centered — dimensional collapse removed)")
    print("=" * 60)
    for label, res in results.items():
        print(f"\n  {label:6s} layer:")
        print(f"    affirm ↔ negate:      {res['centered_mean_affirm_negate']:.4f}  (high = negation leaks)")
        print(f"    affirm ↔ alternative: {res['centered_mean_affirm_alternative']:.4f}")
        print(f"    negate ↔ alternative: {res['centered_mean_negate_alternative']:.4f}  (high = negation works)")
        print(f"    leakiness:            {res['centered_mean_leakiness']:+.4f}  (positive = closer to concept than replacement)")
    print()
    print("Centered cosine removes the shared direction that makes everything")
    print("look similar. Positive leakiness = 'don't use X' is closer to 'use X'")
    print("than to 'use Y' — the elephant is still in the room.")


if __name__ == "__main__":
    main()
