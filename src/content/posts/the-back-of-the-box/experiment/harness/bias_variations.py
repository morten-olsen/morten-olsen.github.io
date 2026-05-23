"""Phase 3: Structural bias study.

Apply legitimate, content-preserving transforms to a resume and measure how
much the LLM's evaluation moves. Same harness as Phase 2 attacks; only the
input mutation changes — and here the mutation is something a real candidate
might do for stylistic reasons (rearrange sections, swap bullets for prose,
remove specific numbers), not an adversarial action.

The question we're answering: how much variance in the LLM's score is
explained by *presentation choices* that have no bearing on the candidate's
qualifications? If meaningful, this is the article's "invisible bias" core
finding — every candidate is being evaluated partly on resume-styling
choices they made without realising they affect outcomes.

Transforms implemented:
- `section_reorder` — rearrange section order without changing any content.
  Variants: education_first, skills_first, summary_last, experience_first.
- `prose_conversion` — convert bullet lists in Experience to prose paragraphs.
- `quantification_strip` — replace specific metrics with vague phrasing
  ("improved by 40%" -> "improved significantly").

Usage:
    uv run python harness/bias_variations.py                       # all transforms on tobias
    uv run python harness/bias_variations.py --variant education_first
    uv run python harness/bias_variations.py --target daniel_koehler --variant all
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import UTC, datetime
from pathlib import Path

from extract import extract_one
from render import default_css, md_to_html_doc, render_html_to_pdf
from score import JD_PATH, MODEL, ScoreResult, _build_client, score_resume


ROOT = Path(__file__).resolve().parent.parent
POOL_DIR = ROOT / "pool" / "resumes"
BIAS_PDFS_DIR = ROOT / "pdfs" / "bias"
BIAS_RESULTS_DIR = ROOT / "results" / "bias"


def parse_sections(md_text: str) -> dict[str, str]:
    """Parse a markdown resume into {section_name: body} keyed by ## header.

    Content before the first `##` (the `#` title and contact line) is stored
    under '__header__'. `###` and deeper headings are kept inside their
    parent ## section.
    """
    sections: dict[str, list[str]] = {"__header__": []}
    current = "__header__"
    for line in md_text.splitlines():
        match = re.match(r"^## (.+)", line)
        if match:
            current = match.group(1).strip().lower()
            sections[current] = [line]
        else:
            sections[current].append(line)
    return {k: "\n".join(v) for k, v in sections.items()}


def reorder_sections(md_text: str, new_order: list[str]) -> str:
    """Return the markdown with sections rearranged into new_order.

    Sections present in the source but not in new_order are dropped. The
    __header__ section is always emitted first.
    """
    sections = parse_sections(md_text)
    out = [sections["__header__"]]
    for name in new_order:
        if name in sections:
            out.append(sections[name])
    return "\n".join(out)


def bullets_to_prose(md_text: str) -> str:
    """Convert markdown bullet lists into prose paragraphs.

    Each contiguous run of `- ...` lines becomes one paragraph with periods
    joining what were previously bullets. Sentence-ending punctuation is
    preserved where present.
    """
    lines = md_text.splitlines()
    out: list[str] = []
    bullet_run: list[str] = []

    def _flush():
        if not bullet_run:
            return
        prose_sentences: list[str] = []
        for item in bullet_run:
            stripped = item.rstrip()
            if not stripped.endswith((".", "!", "?")):
                stripped = stripped + "."
            prose_sentences.append(stripped)
        out.append(" ".join(prose_sentences))
        bullet_run.clear()

    for line in lines:
        bullet_match = re.match(r"^- (.+)$", line)
        if bullet_match:
            bullet_run.append(bullet_match.group(1))
        else:
            _flush()
            out.append(line)
    _flush()
    return "\n".join(out)


def strip_quantification(md_text: str) -> str:
    """Replace specific metrics with vague phrasing without changing meaning."""
    replacements: list[tuple[str, str]] = [
        (r"~?(\d+)%", "significantly"),
        (r"~?(\d+(?:\.\d+)?)\s*[xX]\b", "substantially"),
        (r"\bP95\s+latency\b", "tail latency"),
        (r"\b(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?[KMB])\b\s+(events|users|customers|requests|rows)", r"many \2"),
        (r"~?(\d+)\s+(stars)", r"a small number of \2"),
        (r"~?(\d+)k\b", "a large number"),
    ]
    result = md_text
    for pattern, replacement in replacements:
        result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
    return result


# --- Variant catalog -----------------------------------------------------

VARIANT_DEFS: dict[str, dict] = {
    "education_first": {
        "kind": "reorder",
        "description": "Move Education to the top, before Summary",
        "order": ["education", "summary", "experience", "skills", "other"],
    },
    "skills_first": {
        "kind": "reorder",
        "description": "Move Skills to the top, before Summary and Experience",
        "order": ["skills", "summary", "experience", "education", "other"],
    },
    "summary_last": {
        "kind": "reorder",
        "description": "Move Summary to the end, after Other",
        "order": ["experience", "skills", "education", "other", "summary"],
    },
    "experience_first": {
        "kind": "reorder",
        "description": "Open with Experience (no Summary up top)",
        "order": ["experience", "skills", "summary", "education", "other"],
    },
    "prose": {
        "kind": "prose",
        "description": "Convert bullet lists to prose paragraphs",
    },
    "no_quant": {
        "kind": "strip_quant",
        "description": "Replace specific metrics with vague phrasing",
    },
}


def transform_markdown(md_text: str, variant_id: str) -> str:
    if variant_id not in VARIANT_DEFS:
        raise ValueError(f"unknown variant: {variant_id}")
    v = VARIANT_DEFS[variant_id]
    if v["kind"] == "reorder":
        return reorder_sections(md_text, v["order"])
    if v["kind"] == "prose":
        return bullets_to_prose(md_text)
    if v["kind"] == "strip_quant":
        return strip_quantification(md_text)
    raise ValueError(f"unhandled variant kind: {v['kind']}")


def run_variant(target_stem: str, variant_id: str, n_runs: int = 1) -> dict:
    bias_id = f"bias_{variant_id}"

    md_path = POOL_DIR / f"{target_stem}.md"
    md_text = md_path.read_text(encoding="utf-8")
    transformed_md = transform_markdown(md_text, variant_id)

    transformed_dir = BIAS_RESULTS_DIR / bias_id / "transformed_md"
    transformed_dir.mkdir(parents=True, exist_ok=True)
    (transformed_dir / f"{target_stem}.md").write_text(transformed_md, encoding="utf-8")

    pdf_dir = BIAS_PDFS_DIR / bias_id
    pdf_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = pdf_dir / f"{target_stem}.pdf"
    html_doc = md_to_html_doc(transformed_md, default_css())
    render_html_to_pdf(html_doc, pdf_path)

    extracted_text = extract_one(pdf_path)
    extracted_dir = BIAS_RESULTS_DIR / bias_id / "extracted_text"
    extracted_dir.mkdir(parents=True, exist_ok=True)
    (extracted_dir / f"{target_stem}.txt").write_text(extracted_text, encoding="utf-8")

    jd_text = JD_PATH.read_text(encoding="utf-8")
    client = _build_client()
    scores_dir = BIAS_RESULTS_DIR / bias_id / "scores"
    scores_dir.mkdir(parents=True, exist_ok=True)

    run_scores: list[ScoreResult] = []
    for i in range(n_runs):
        score, latency_ms = score_resume(jd_text, extracted_text, client, MODEL)
        result = ScoreResult(
            resume_id=target_stem,
            model=MODEL,
            timestamp=datetime.now(UTC).isoformat(),
            latency_ms=latency_ms,
            score=score,
        )
        (scores_dir / f"{target_stem}_run_{i+1:03d}.json").write_text(
            result.model_dump_json(indent=2), encoding="utf-8"
        )
        run_scores.append(result)

    return {
        "bias_id": bias_id,
        "variant_id": variant_id,
        "target": target_stem,
        "extracted_chars": len(extracted_text),
        "scores": [s.model_dump() for s in run_scores],
    }


CLEAN_BASELINES: dict[str, float] = {
    "daniel_koehler": 95.0,
    "felix_bauer": 75.0,
    "jonas_schmitt": 65.0,
    "lukas_berger": 90.0,
    "matthias_hoffmann": 59.5,
    "tobias_janssen": 75.0,
}


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Run structural-bias variations on a resume.")
    parser.add_argument(
        "--target",
        default="tobias_janssen",
        help="Target resume stem, or 'all' to run on every resume in the pool",
    )
    parser.add_argument(
        "--variant",
        default="all",
        choices=list(VARIANT_DEFS.keys()) + ["all"],
        help="Which variant to run (or 'all')",
    )
    parser.add_argument("--n-runs", type=int, default=1, help="Number of scoring runs per variant")
    args = parser.parse_args(argv)

    variants = list(VARIANT_DEFS.keys()) if args.variant == "all" else [args.variant]
    if args.target == "all":
        targets = [p.stem for p in sorted(POOL_DIR.glob("*.md"))]
    else:
        targets = [args.target]

    print(f"\nRunning Phase 3 bias variations")
    print(f"  targets : {', '.join(targets)}")
    print(f"  variants: {', '.join(variants)}")
    print(f"  n_runs  : {args.n_runs}")
    print()

    # target -> variant -> mean overall_score
    matrix: dict[str, dict[str, float]] = {t: {} for t in targets}

    for target in targets:
        baseline = CLEAN_BASELINES.get(target)
        baseline_str = f"baseline={baseline:.0f}" if baseline is not None else "baseline=?"
        print(f"--- {target} ({baseline_str}) ---")
        for v in variants:
            result = run_variant(target, v, n_runs=args.n_runs)
            scores = [s["score"]["overall_score"] for s in result["scores"]]
            mean_score = sum(scores) / len(scores)
            matrix[target][v] = mean_score
            delta = (mean_score - baseline) if baseline is not None else 0.0
            delta_str = f"({delta:+.1f})" if baseline is not None else ""
            last = result["scores"][-1]["score"]
            print(
                f"  {v:<22} mean={mean_score:>5.1f} {delta_str:>8} "
                f"breakdown req={last['required_match']} pref={last['preferred_match']} "
                f"exp={last['experience_fit']} nice={last['nice_match']}"
            )
        print()

    # Summary matrix
    print(f"\n=== Bias variation matrix (overall_score) ===")
    header_cells = ["target"] + ["baseline"] + variants
    col_w = max(len(c) for c in header_cells + targets) + 2
    print("".join(c.ljust(col_w) for c in header_cells))
    for target in targets:
        baseline = CLEAN_BASELINES.get(target, 0.0)
        row_cells = [target, f"{baseline:.0f}"] + [
            f"{matrix[target].get(v, 0):.0f}" for v in variants
        ]
        print("".join(c.ljust(col_w) for c in row_cells))

    print(f"\n=== Delta vs clean baseline ===")
    print("".join(c.ljust(col_w) for c in ["target"] + variants))
    for target in targets:
        baseline = CLEAN_BASELINES.get(target, 0.0)
        deltas = [matrix[target].get(v, 0) - baseline for v in variants]
        delta_cells = [f"{d:+.0f}" for d in deltas]
        print("".join(c.ljust(col_w) for c in [target] + delta_cells))

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
