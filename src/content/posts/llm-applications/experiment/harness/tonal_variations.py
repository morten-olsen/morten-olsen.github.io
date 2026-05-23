"""Phase 3 — tonal variation experiment.

Hand-authored tonal variants of Tobias's resume (formal/dry, personal/warm)
are rendered, extracted, and scored. The hypothesis: rubric dimensions that
are skill-based (`required_match`, `preferred_match`) and experience-based
(`experience_fit`) should be *invariant* to tonal register — same facts,
same scores. Only `nice_match` might legitimately reflect tone (if the
LLM is reading register as a soft-fit signal). If skill dimensions move,
the LLM is leaking tonal judgment into rubric slots where it does not
belong.

Variants live in `pool/tonal_variants/*.md` and follow the naming
convention `<base_stem>_<tone>.md`, e.g., `tobias_formal.md`.

Usage:
    uv run python harness/tonal_variations.py
"""

from __future__ import annotations

import argparse
import sys
from datetime import UTC, datetime
from pathlib import Path

from extract import extract_one
from render import default_css, md_to_html_doc, render_html_to_pdf
from score import JD_PATH, MODEL, ScoreResult, _build_client, score_resume


ROOT = Path(__file__).resolve().parent.parent
TONAL_DIR = ROOT / "pool" / "tonal_variants"
TONAL_PDFS_DIR = ROOT / "pdfs" / "tonal"
TONAL_RESULTS_DIR = ROOT / "results" / "tonal"

CLEAN_BASELINE_TOBIAS = {
    "overall_score": 75.0,
    "required_match": 8.0,
    "preferred_match": 5.0,
    "experience_fit": 8.0,
    "nice_match": 2.0,
}


def render_and_score(md_path: Path, n_runs: int = 1) -> dict:
    md_text = md_path.read_text(encoding="utf-8")
    html_doc = md_to_html_doc(md_text, default_css())

    TONAL_PDFS_DIR.mkdir(parents=True, exist_ok=True)
    pdf_path = TONAL_PDFS_DIR / f"{md_path.stem}.pdf"
    render_html_to_pdf(html_doc, pdf_path)

    extracted_text = extract_one(pdf_path)
    extracted_dir = TONAL_RESULTS_DIR / "extracted_text"
    extracted_dir.mkdir(parents=True, exist_ok=True)
    (extracted_dir / f"{md_path.stem}.txt").write_text(extracted_text, encoding="utf-8")

    jd_text = JD_PATH.read_text(encoding="utf-8")
    client = _build_client()
    scores_dir = TONAL_RESULTS_DIR / "scores"
    scores_dir.mkdir(parents=True, exist_ok=True)

    run_scores: list[ScoreResult] = []
    for i in range(n_runs):
        score, latency_ms = score_resume(jd_text, extracted_text, client, MODEL)
        result = ScoreResult(
            resume_id=md_path.stem,
            model=MODEL,
            timestamp=datetime.now(UTC).isoformat(),
            latency_ms=latency_ms,
            score=score,
        )
        (scores_dir / f"{md_path.stem}_run_{i+1:03d}.json").write_text(
            result.model_dump_json(indent=2), encoding="utf-8"
        )
        run_scores.append(result)

    return {
        "stem": md_path.stem,
        "extracted_chars": len(extracted_text),
        "scores": [s.model_dump() for s in run_scores],
    }


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Run tonal variation experiment.")
    parser.add_argument("--n-runs", type=int, default=1)
    parser.parse_args(argv)

    md_paths = sorted(TONAL_DIR.glob("*.md"))
    if not md_paths:
        print(f"no tonal variants found in {TONAL_DIR.relative_to(ROOT)}", file=sys.stderr)
        return 1

    print(f"\nClean baseline (Tobias from F7): "
          f"overall={CLEAN_BASELINE_TOBIAS['overall_score']:.0f} "
          f"req={CLEAN_BASELINE_TOBIAS['required_match']:.0f} "
          f"pref={CLEAN_BASELINE_TOBIAS['preferred_match']:.0f} "
          f"exp={CLEAN_BASELINE_TOBIAS['experience_fit']:.0f} "
          f"nice={CLEAN_BASELINE_TOBIAS['nice_match']:.0f}\n")

    results: list[dict] = []
    for md_path in md_paths:
        print(f"--- {md_path.stem} ---")
        result = render_and_score(md_path, n_runs=1)
        last_score = result["scores"][-1]["score"]
        print(
            f"  overall={last_score['overall_score']:>3}  "
            f"req={last_score['required_match']:>2}  "
            f"pref={last_score['preferred_match']:>2}  "
            f"exp={last_score['experience_fit']:>2}  "
            f"nice={last_score['nice_match']:>2}"
        )
        print(f"  just: {last_score['justification'][:200]}{'...' if len(last_score['justification']) > 200 else ''}")
        results.append({"stem": md_path.stem, "score": last_score})
        print()

    print(f"\n=== Per-dimension delta vs clean baseline ===")
    print(f"{'variant':<25} {'overall':>9} {'req':>5} {'pref':>5} {'exp':>5} {'nice':>5}")
    print(f"{'baseline':<25} {CLEAN_BASELINE_TOBIAS['overall_score']:>9.0f} "
          f"{CLEAN_BASELINE_TOBIAS['required_match']:>5.0f} "
          f"{CLEAN_BASELINE_TOBIAS['preferred_match']:>5.0f} "
          f"{CLEAN_BASELINE_TOBIAS['experience_fit']:>5.0f} "
          f"{CLEAN_BASELINE_TOBIAS['nice_match']:>5.0f}")
    print("-" * 60)
    for r in results:
        s = r["score"]
        d_overall = s["overall_score"] - CLEAN_BASELINE_TOBIAS["overall_score"]
        d_req = s["required_match"] - CLEAN_BASELINE_TOBIAS["required_match"]
        d_pref = s["preferred_match"] - CLEAN_BASELINE_TOBIAS["preferred_match"]
        d_exp = s["experience_fit"] - CLEAN_BASELINE_TOBIAS["experience_fit"]
        d_nice = s["nice_match"] - CLEAN_BASELINE_TOBIAS["nice_match"]
        print(
            f"{r['stem']:<25} "
            f"{d_overall:>+9.0f} {d_req:>+5.0f} {d_pref:>+5.0f} {d_exp:>+5.0f} {d_nice:>+5.0f}"
        )

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
