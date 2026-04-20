#!/usr/bin/env python3
"""
Experiment 2: Negation Decay Under Context Growth

Measures how a negation instruction's hidden state drifts as we insert increasing
amounts of old-pattern code between the instruction and the generation point.

We compare two instruction framings:
  - NEGATE: "Refactor this code to not use var. Use const/let instead."
  - POSITIVE: "Refactor this code to use const/let for all declarations."

Both are followed by increasing amounts of var-heavy code. We track how the
last-token hidden state changes relative to:
  - A pure "use var" reference (the old pattern)
  - A pure "use const/let" reference (the target pattern)

From Exp1 we know negation starts in "limbo" — far from both concept and
alternative. The question: does context pressure resolve that limbo toward
the old pattern?

Usage:
    python exp2_negation_decay.py [--model MODEL_NAME]
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
    SEED,
    compute_layer_indices,
    cosine_sim,
    extract_hidden_states,
    load_model,
    model_slug,
)

BASE_OUTPUT_DIR = Path(__file__).parent / "output" / "exp2_negation_decay"

# The patterns we test. Each has a negate instruction, a positive instruction,
# and reference prompts for the old/new pattern.
PATTERNS = [
    {
        "id": "var_declarations",
        "negate_instruction": "Refactor the following code to not use var declarations. Use const and let instead.\n\n",
        "positive_instruction": "Refactor the following code to use const and let for all variable declarations.\n\n",
        "old_reference": "Write JavaScript code using var for all variable declarations.",
        "new_reference": "Write JavaScript code using const and let for all variable declarations.",
        "filler_key": "var_declarations",
    },
    {
        "id": "callbacks",
        "negate_instruction": "Refactor the following code to not use callbacks. Use async/await instead.\n\n",
        "positive_instruction": "Refactor the following code to use async/await for all asynchronous operations.\n\n",
        "old_reference": "Write Node.js code that uses callbacks for asynchronous operations.",
        "new_reference": "Write Node.js code that uses async/await for asynchronous operations.",
        "filler_key": "callbacks",
    },
]

# How many filler blocks to insert at each step (cumulative)
FILLER_STEPS = [0, 1, 2, 3, 4, 5, 6]


def build_prompt(instruction: str, filler_blocks: list[str]) -> str:
    """Build a prompt: instruction + filler code blocks."""
    if not filler_blocks:
        return instruction + "// (no code yet)\n\nNow write the refactored version:"
    code = "\n\n".join(filler_blocks)
    return instruction + "```javascript\n" + code + "\n```\n\nNow write the refactored version:"


def plot_decay_curves(
    decay_data: dict,
    pattern_id: str,
    layer_label: str,
    output_dir: Path,
):
    """
    Plot how similarity to old/new reference changes as filler grows,
    for both negate and positive instruction framings.
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 6), sharey=True)

    for ax, framing in zip(axes, ["negate", "positive"]):
        d = decay_data[framing]
        steps = d["filler_counts"]
        token_counts = d["token_counts"]

        ax.plot(steps, d["sim_to_old"], "o-", color="#E63946", label="→ old pattern", linewidth=2)
        ax.plot(steps, d["sim_to_new"], "o-", color="#2A9D8F", label="→ new pattern", linewidth=2)

        # Shade the gap
        old = np.array(d["sim_to_old"])
        new = np.array(d["sim_to_new"])
        ax.fill_between(steps, old, new, alpha=0.1,
                        color="#E63946" if old[-1] > new[-1] else "#2A9D8F")

        ax.set_xlabel("Filler blocks inserted")
        ax.set_ylabel("Centered cosine similarity" if ax == axes[0] else "")
        ax.set_title(f'"{framing}" instruction')
        ax.legend(loc="best")
        ax.axhline(y=0, color="gray", linestyle=":", alpha=0.5)

        # Add token counts as secondary x labels
        ax2 = ax.twiny()
        ax2.set_xlim(ax.get_xlim())
        ax2.set_xticks(steps)
        ax2.set_xticklabels([str(t) for t in token_counts], fontsize=7)
        ax2.set_xlabel("Total tokens", fontsize=8)

    fig.suptitle(f"Negation Decay — {pattern_id} — {layer_label.title()} Layer", fontsize=14)
    fig.tight_layout()
    filename = f"{pattern_id}_{layer_label}_decay.png"
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def plot_gap_comparison(
    all_pattern_data: dict,
    layer_label: str,
    output_dir: Path,
):
    """
    Plot the "gap" (sim_to_new - sim_to_old) over filler steps for negate vs
    positive across all patterns. Positive gap = model still favors new pattern.
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    for pattern_id, decay_data in all_pattern_data.items():
        for framing, style in [("negate", "--"), ("positive", "-")]:
            d = decay_data[framing]
            steps = d["filler_counts"]
            gap = [n - o for n, o in zip(d["sim_to_new"], d["sim_to_old"])]
            ax.plot(steps, gap, f"o{style}", label=f"{pattern_id} ({framing})", linewidth=2)

    ax.axhline(y=0, color="gray", linestyle=":", alpha=0.5, linewidth=2)
    ax.set_xlabel("Filler blocks inserted")
    ax.set_ylabel("Gap: similarity to new − similarity to old")
    ax.set_title(f"Instruction Resilience — {layer_label.title()} Layer")
    ax.legend(loc="best", fontsize=9)

    # Annotate zones
    ax.text(0.02, 0.98, "← favors new pattern", transform=ax.transAxes,
            fontsize=9, va="top", color="#2A9D8F", alpha=0.7)
    ax.text(0.02, 0.02, "← favors old pattern", transform=ax.transAxes,
            fontsize=9, va="bottom", color="#E63946", alpha=0.7)

    fig.tight_layout()
    filename = f"{layer_label}_gap_comparison.png"
    fig.savefig(output_dir / filename, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {filename}")


def main():
    parser = argparse.ArgumentParser(description="Experiment 2: Negation decay")
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

    # Phase 1: Extract reference vectors (the anchors we measure distance to)
    print("\n[Phase 1/3] Extracting reference vectors...")
    references = {}
    for pattern in PATTERNS:
        pid = pattern["id"]
        for ref_type in ["old_reference", "new_reference"]:
            hs, tc = extract_hidden_states(model, tokenizer, pattern[ref_type], layer_indices)
            references[(pid, ref_type)] = hs
            print(f"  {pid}/{ref_type}: {tc} tokens")

    # Collect ALL vectors for centering (references + all filler prompts)
    # We'll do this in two passes: first collect everything, then center and analyze
    print("\n[Phase 2/3] Extracting hidden states at each filler level...")
    raw_states = {}  # (pattern_id, framing, n_fillers) -> {layer_idx: vector}
    token_counts = {}  # same key -> int

    total = len(PATTERNS) * 2 * len(FILLER_STEPS)
    pbar = tqdm(total=total, desc="Extracting", unit="prompt")

    for pattern in PATTERNS:
        pid = pattern["id"]
        fillers = FILLERS[pattern["filler_key"]]

        for framing in ["negate", "positive"]:
            instruction = pattern[f"{framing}_instruction"]

            for n_fillers in FILLER_STEPS:
                blocks = fillers[:n_fillers]
                prompt = build_prompt(instruction, blocks)
                hs, tc = extract_hidden_states(model, tokenizer, prompt, layer_indices)
                raw_states[(pid, framing, n_fillers)] = hs
                token_counts[(pid, framing, n_fillers)] = tc
                pbar.update(1)

    pbar.close()

    # Phase 3: Center and compute similarities
    print("\n[Phase 3/3] Computing centered similarities...")
    results = {}

    for label, layer_idx in layer_map.items():
        t0 = time.monotonic()

        # Compute mean vector across ALL prompts at this layer (references + filler prompts)
        all_vectors = []
        for key in raw_states:
            all_vectors.append(raw_states[key][layer_idx])
        for key in references:
            all_vectors.append(references[key][layer_idx])
        mean_vector = np.mean(np.stack(all_vectors), axis=0)

        # Center reference vectors
        centered_refs = {}
        for pattern in PATTERNS:
            pid = pattern["id"]
            centered_refs[(pid, "old")] = references[(pid, "old_reference")][layer_idx] - mean_vector
            centered_refs[(pid, "new")] = references[(pid, "new_reference")][layer_idx] - mean_vector

        # Compute decay curves
        all_pattern_data = {}
        for pattern in PATTERNS:
            pid = pattern["id"]
            pattern_data = {}

            for framing in ["negate", "positive"]:
                sim_to_old = []
                sim_to_new = []
                tc_list = []

                for n_fillers in FILLER_STEPS:
                    vec = raw_states[(pid, framing, n_fillers)][layer_idx] - mean_vector
                    sim_to_old.append(round(cosine_sim(vec, centered_refs[(pid, "old")]), 4))
                    sim_to_new.append(round(cosine_sim(vec, centered_refs[(pid, "new")]), 4))
                    tc_list.append(token_counts[(pid, framing, n_fillers)])

                pattern_data[framing] = {
                    "filler_counts": FILLER_STEPS,
                    "token_counts": tc_list,
                    "sim_to_old": sim_to_old,
                    "sim_to_new": sim_to_new,
                }

            all_pattern_data[pid] = pattern_data
            plot_decay_curves(pattern_data, pid, label, output_dir)

        plot_gap_comparison(all_pattern_data, label, output_dir)

        results[label] = {
            "layer_index": layer_idx,
            "patterns": all_pattern_data,
        }

        elapsed = time.monotonic() - t0
        print(f"\n  {label} layer — {elapsed:.1f}s")
        for pid, pdata in all_pattern_data.items():
            for framing in ["negate", "positive"]:
                d = pdata[framing]
                old_drift = d["sim_to_old"][-1] - d["sim_to_old"][0]
                new_drift = d["sim_to_new"][-1] - d["sim_to_new"][0]
                print(f"    {pid}/{framing}: old_drift={old_drift:+.4f} new_drift={new_drift:+.4f} tokens={d['token_counts'][-1]}")

    # Save
    meta_path = output_dir / "results.json"
    meta_path.write_text(json.dumps({
        "model": args.model,
        "num_layers": num_layers,
        "layer_map": layer_map,
        "filler_steps": FILLER_STEPS,
        "results": results,
    }, indent=2))
    print(f"\nResults saved to {meta_path}")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    late = results[list(layer_map.keys())[-1]]
    for pid, pdata in late["patterns"].items():
        print(f"\n  {pid}:")
        for framing in ["negate", "positive"]:
            d = pdata[framing]
            start_gap = d["sim_to_new"][0] - d["sim_to_old"][0]
            end_gap = d["sim_to_new"][-1] - d["sim_to_old"][-1]
            print(f"    {framing:8s}: gap {start_gap:+.4f} → {end_gap:+.4f}  (Δ = {end_gap - start_gap:+.4f})")
    print()
    print("Gap = sim_to_new - sim_to_old. Positive = favors new pattern.")
    print("Negative Δ = instruction losing to context pressure.")


if __name__ == "__main__":
    main()
