#!/usr/bin/env python3
"""
Experiment 3: Generation Compliance Under Context Pressure

Does the model follow a refactoring instruction as old-pattern code fills the context?

Uses chat templates to match real-world usage:
  - System message: the refactoring directive (like CLAUDE.md / harness config)
  - User message: "refactor this code" + the actual code blocks

Three system-level directives:
  - NEGATE: "Do not use var. Use const/let instead."
  - POSITIVE: "Always use const and let for variable declarations."
  - NONE: no directive (baseline)

Compliance is measured by counting old-pattern vs new-pattern keywords in
the generated output. Fully automated, deterministic (temperature=0).

Usage:
    python exp3_generation_compliance.py [--model MODEL_NAME]
"""

import argparse
import json
import re
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
from tqdm import tqdm
from transformers import AutoModelForCausalLM, AutoTokenizer

from exp2_context_fillers import FILLERS

DEVICE = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
BASE_OUTPUT_DIR = Path(__file__).parent / "output" / "exp3_generation_compliance"
MAX_NEW_TOKENS = 128
FILLER_STEPS = [0, 1, 2, 3, 4, 5, 6]


def model_slug(name: str) -> str:
    return name.split("/")[-1]


def load_model_lean(model_name: str):
    """Load model for generation only — no hidden states, no attention."""
    print(f"Loading {model_name} on {DEVICE} (lean mode)...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        trust_remote_code=True,
        torch_dtype=torch.float16 if DEVICE != "cpu" else torch.float32,
    ).to(DEVICE)
    model.eval()
    return model, tokenizer


PATTERNS = [
    {
        "id": "var_declarations",
        "system_negate": "You are a JavaScript refactoring assistant. Do not use var declarations in your output. Use const and let instead.",
        "system_positive": "You are a JavaScript refactoring assistant. Always use const and let for all variable declarations.",
        "system_none": "You are a JavaScript assistant.",
        "user_prefix": "Refactor the following JavaScript code:\n\n```javascript\n",
        "user_suffix": "\n```\n\nWrite the refactored version:",
        "filler_key": "var_declarations",
        "old_markers": [r"\bvar\b"],
        "new_markers": [r"\bconst\b", r"\blet\b"],
    },
    {
        "id": "var_control",
        "system_negate": "You are a JavaScript refactoring assistant. Do not use var declarations in your output. Use const and let instead.",
        "system_positive": "You are a JavaScript refactoring assistant. Always use const and let for all variable declarations.",
        "system_none": "You are a JavaScript assistant.",
        "user_prefix": "Refactor the following JavaScript code:\n\n```javascript\n",
        "user_suffix": "\n```\n\nWrite the refactored version:",
        "filler_key": "const_declarations",
        "old_markers": [r"\bvar\b"],
        "new_markers": [r"\bconst\b", r"\blet\b"],
    },
    {
        "id": "callbacks",
        "system_negate": "You are a Node.js refactoring assistant. Do not use callbacks in your output. Use async/await instead.",
        "system_positive": "You are a Node.js refactoring assistant. Always use async/await for asynchronous operations.",
        "system_none": "You are a Node.js assistant.",
        "user_prefix": "Refactor the following Node.js code:\n\n```javascript\n",
        "user_suffix": "\n```\n\nWrite the refactored version:",
        "filler_key": "callbacks",
        "old_markers": [r"\bcallback\b", r"function\s*\(\s*err"],
        "new_markers": [r"\bawait\b", r"\basync\b"],
    },
]

FRAMINGS = ["negate", "positive", "none"]


def build_chat_prompt(tokenizer, system_msg: str, user_code: str) -> str:
    """Build a chat-templated prompt with system and user messages."""
    messages = [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_code},
    ]
    return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)


def count_markers(text: str, patterns: list[str]) -> int:
    return sum(len(re.findall(pat, text)) for pat in patterns)


def compute_compliance(output: str, old_markers: list[str], new_markers: list[str]) -> dict:
    old_count = count_markers(output, old_markers)
    new_count = count_markers(output, new_markers)
    total = old_count + new_count
    return {
        "old_count": old_count,
        "new_count": new_count,
        "total": total,
        "compliance": round(new_count / total, 4) if total > 0 else None,
    }


def generate(model, tokenizer, prompt: str) -> str:
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=MAX_NEW_TOKENS,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )
    new_ids = output_ids[0, inputs["input_ids"].shape[1]:]
    text = tokenizer.decode(new_ids, skip_special_tokens=True)
    # Clean tokenizer artifacts (Ġ = space, Ċ = newline in some tokenizers)
    text = text.replace("Ġ", " ").replace("Ċ", "\n")
    return text


def plot_compliance_curves(pattern_data: dict, pattern_id: str, output_dir: Path):
    fig, ax = plt.subplots(figsize=(10, 6))
    colors = {"negate": "#E63946", "positive": "#2A9D8F", "none": "#888888"}
    styles = {"negate": "--", "positive": "-", "none": ":"}

    for framing in FRAMINGS:
        d = pattern_data[framing]
        valid = [(s, c) for s, c in zip(d["filler_steps"], d["compliance"]) if c is not None]
        if valid:
            vs, vc = zip(*valid)
            # Use step plot to show binary cliff accurately (no misleading diagonal lines)
            ax.step(vs, vc, where="post", color=colors[framing],
                    linestyle=styles[framing], label=framing, linewidth=2)
            ax.scatter(vs, vc, color=colors[framing], s=64, zorder=5)

    ax.axhline(y=1.0, color="#2A9D8F", linestyle=":", alpha=0.3)
    ax.axhline(y=0.0, color="#E63946", linestyle=":", alpha=0.3)
    ax.set_xlabel("Filler blocks (old-pattern code)")
    ax.set_ylabel("Compliance (1.0 = all new, 0.0 = all old)")
    ax.set_title(f"Refactoring Compliance — {pattern_id} (system prompt)")
    ax.set_ylim(-0.05, 1.05)
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_dir / f"{pattern_id}_compliance.png", dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  Saved {pattern_id}_compliance.png")


def main():
    parser = argparse.ArgumentParser(description="Exp3: Generation compliance")
    parser.add_argument("--model", default="deepseek-ai/deepseek-coder-6.7b-instruct")
    args = parser.parse_args()

    slug = model_slug(args.model)
    output_dir = BASE_OUTPUT_DIR / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    model, tokenizer = load_model_lean(args.model)
    all_results = {}

    total = len(PATTERNS) * len(FRAMINGS) * len(FILLER_STEPS)
    pbar = tqdm(total=total, desc="Generating", unit="prompt")

    for pattern in PATTERNS:
        pid = pattern["id"]
        fillers = FILLERS[pattern["filler_key"]]
        pattern_data = {}

        for framing in FRAMINGS:
            system_msg = pattern[f"system_{framing}"]
            results_per_step = {
                "filler_steps": [], "token_counts": [],
                "old_counts": [], "new_counts": [],
                "compliance": [], "samples": [],
            }

            for n_fillers in FILLER_STEPS:
                blocks = fillers[:n_fillers]
                code = "\n\n".join(blocks) if blocks else "// no code provided"
                user_msg = pattern["user_prefix"] + code + pattern["user_suffix"]

                prompt = build_chat_prompt(tokenizer, system_msg, user_msg)
                prompt_tokens = len(tokenizer(prompt)["input_ids"])

                output = generate(model, tokenizer, prompt)
                comp = compute_compliance(output, pattern["old_markers"], pattern["new_markers"])

                results_per_step["filler_steps"].append(n_fillers)
                results_per_step["token_counts"].append(prompt_tokens)
                results_per_step["old_counts"].append(comp["old_count"])
                results_per_step["new_counts"].append(comp["new_count"])
                results_per_step["compliance"].append(comp["compliance"])
                results_per_step["samples"].append(output[:500])

                pbar.update(1)

            pattern_data[framing] = results_per_step

        all_results[pid] = pattern_data
        plot_compliance_curves(pattern_data, pid, output_dir)

    pbar.close()

    # Save
    meta_path = output_dir / "results.json"
    meta_path.write_text(json.dumps({
        "model": args.model,
        "max_new_tokens": MAX_NEW_TOKENS,
        "prompt_format": "chat_template (system + user)",
        "results": all_results,
    }, indent=2))

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY — Compliance (system prompt, chat template)")
    print("=" * 60)
    for pid, pdata in all_results.items():
        print(f"\n  {pid}:")
        for framing in FRAMINGS:
            d = pdata[framing]
            vals = [v for v in d["compliance"] if v is not None]
            if len(vals) >= 2:
                print(f"    {framing:8s}: {vals[0]:.2f} → {vals[-1]:.2f}  "
                      f"(old: {d['old_counts'][0]}→{d['old_counts'][-1]}, "
                      f"new: {d['new_counts'][0]}→{d['new_counts'][-1]}, "
                      f"tokens: {d['token_counts'][0]}→{d['token_counts'][-1]})")
            elif vals:
                print(f"    {framing:8s}: {vals[0]:.2f} (only one valid point)")
            else:
                print(f"    {framing:8s}: no markers found")


if __name__ == "__main__":
    main()
