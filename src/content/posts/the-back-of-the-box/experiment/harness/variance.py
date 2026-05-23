"""Variance baseline: run the SUT N times on the clean pool, characterize noise.

Phase 1 deliverable. Establishes the floor below which any "effect" measured
in Phase 2 (adversarial) or Phase 3 (bias) is indistinguishable from sampling
variation. Without this, we cannot claim an attack or bias variation actually
moved the ranking — it might just be the LLM's own non-determinism.

We measure two kinds of variance per resume:
- *Score variance*: mean / stdev / min / max of `overall_score` across N runs.
- *Rank variance*: distribution of ranks the candidate occupies across N runs.

For ranking, ties are broken by the natural sort order of the score (i.e.
two candidates with the same `overall_score` get adjacent ranks rather than
identical ranks). This makes "tied" candidates show up as flicker between
two ranks in the distribution.

Usage:
    uv run python harness/variance.py                                # N=10, default model
    uv run python harness/variance.py --n-runs 5                     # smaller sample
    uv run python harness/variance.py --model openai/gpt-4.1-mini    # different model
"""

from __future__ import annotations

import argparse
import json
import statistics
import sys
from collections import Counter
from datetime import UTC, datetime
from pathlib import Path

from score import (
    EXTRACTED_DIR,
    JD_PATH,
    MODEL,
    ScoreResult,
    _build_client,
    score_resume,
)


ROOT = Path(__file__).resolve().parent.parent
VARIANCE_DIR = ROOT / "results" / "baseline" / "variance"


def _model_dir_name(model_id: str) -> str:
    return model_id.replace("/", "__").replace(":", "_")


def run_baseline(n_runs: int, model: str) -> Path:
    jd_text = JD_PATH.read_text(encoding="utf-8")
    client = _build_client()

    out_dir = VARIANCE_DIR / _model_dir_name(model)
    out_dir.mkdir(parents=True, exist_ok=True)

    txt_paths = sorted(EXTRACTED_DIR.glob("*.txt"))
    resume_ids = [p.stem for p in txt_paths]

    per_run: list[dict[str, ScoreResult]] = []

    for run_idx in range(1, n_runs + 1):
        run_dir = out_dir / f"run_{run_idx:03d}"
        run_dir.mkdir(parents=True, exist_ok=True)
        run_results: dict[str, ScoreResult] = {}

        for txt_path in txt_paths:
            resume_text = txt_path.read_text(encoding="utf-8")
            score, latency_ms = score_resume(jd_text, resume_text, client, model)
            result = ScoreResult(
                resume_id=txt_path.stem,
                model=model,
                timestamp=datetime.now(UTC).isoformat(),
                latency_ms=latency_ms,
                score=score,
            )
            (run_dir / f"{txt_path.stem}.json").write_text(
                result.model_dump_json(indent=2), encoding="utf-8"
            )
            run_results[txt_path.stem] = result

        per_run.append(run_results)
        scores_line = " ".join(
            f"{rid[:8]}={run_results[rid].score.overall_score}" for rid in resume_ids
        )
        print(f"  run {run_idx:02d}/{n_runs}: {scores_line}")

    summary = compute_summary(per_run)
    summary_path = out_dir / "summary.json"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    _print_summary(summary)
    print(f"\nSummary written to {summary_path.relative_to(ROOT)}")
    return summary_path


def compute_summary(per_run: list[dict[str, ScoreResult]]) -> dict:
    if not per_run:
        return {}

    resume_ids = list(per_run[0].keys())

    overall_series = {
        rid: [r[rid].score.overall_score for r in per_run] for rid in resume_ids
    }

    rank_series: dict[str, list[int]] = {rid: [] for rid in resume_ids}
    for run in per_run:
        sorted_ids = sorted(
            resume_ids,
            key=lambda rid: run[rid].score.overall_score,
            reverse=True,
        )
        for rank_idx, rid in enumerate(sorted_ids):
            rank_series[rid].append(rank_idx + 1)

    summary = {
        "n_runs": len(per_run),
        "model": per_run[0][resume_ids[0]].model,
        "computed_at": datetime.now(UTC).isoformat(),
        "per_resume": {},
    }

    for rid in resume_ids:
        scores = overall_series[rid]
        ranks = rank_series[rid]
        summary["per_resume"][rid] = {
            "overall_score": {
                "mean": round(statistics.mean(scores), 2),
                "stdev": round(statistics.stdev(scores), 2) if len(scores) > 1 else 0.0,
                "min": min(scores),
                "max": max(scores),
                "values": scores,
            },
            "rank": {
                "mean": round(statistics.mean(ranks), 2),
                "stdev": round(statistics.stdev(ranks), 2) if len(ranks) > 1 else 0.0,
                "min": min(ranks),
                "max": max(ranks),
                "values": ranks,
                "distribution": dict(sorted(Counter(ranks).items())),
            },
        }

    return summary


def _print_summary(summary: dict) -> None:
    print(
        f"\n=== Variance summary "
        f"(n={summary['n_runs']}, model={summary['model']}) ==="
    )
    print(
        f"{'resume':<24} {'score mean':>10} {'score sd':>9} "
        f"{'score range':>13} {'rank mean':>10} {'rank dist':>14}"
    )
    items = sorted(
        summary["per_resume"].items(),
        key=lambda x: -x[1]["overall_score"]["mean"],
    )
    for rid, stats in items:
        s = stats["overall_score"]
        r = stats["rank"]
        score_range = f"{s['min']}-{s['max']}"
        dist = ",".join(f"{k}:{v}" for k, v in r["distribution"].items())
        print(
            f"{rid:<24} "
            f"{s['mean']:>10.2f} "
            f"{s['stdev']:>9.2f} "
            f"{score_range:>13} "
            f"{r['mean']:>10.2f} "
            f"{dist:>14}"
        )


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Run variance baseline (N runs of scoring).")
    parser.add_argument("--n-runs", type=int, default=10, help="Number of runs (default: 10)")
    parser.add_argument("--model", default=MODEL, help=f"Model id (default: {MODEL})")
    args = parser.parse_args(argv)

    print(f"Running variance baseline: N={args.n_runs}, model={args.model}")
    run_baseline(args.n_runs, args.model)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
