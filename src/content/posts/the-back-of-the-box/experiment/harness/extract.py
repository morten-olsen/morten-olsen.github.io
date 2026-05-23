"""Extract text from rendered resume PDFs.

This is the text-stream extraction path — what a typical LLM scoring
pipeline sees when it consumes a PDF. We capture the output verbatim
per resume in `results/baseline/extracted_text/` so we have a recorded
audit of "what the LLM saw" against which we can later compare
attack-time extractions (Tier 1 hidden text, Tier 4 channel separation,
etc.) and OCR-of-render output as the defensive baseline.

PyMuPDF (fitz) is used because it's the most commonly-deployed Python
PDF parser in real LLM resume pipelines. Other parsers (pdfplumber,
PyPDF2, pdfminer) make slightly different choices about which content
they expose; testing against more than one would strengthen findings
in a later phase.

Usage:
    uv run python harness/extract.py              # extract all clean PDFs
    uv run python harness/extract.py daniel       # extract one by stem
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parent.parent
PDFS_DIR = ROOT / "pdfs" / "clean"
OUTPUT_DIR = ROOT / "results" / "baseline" / "extracted_text"


def extract_one(pdf_path: Path) -> str:
    """Extract text via PyMuPDF's default text-stream extraction."""
    doc = pymupdf.open(pdf_path)
    try:
        return "\n\n".join(page.get_text() for page in doc)
    finally:
        doc.close()


def extract_all(filter_stem: str | None = None) -> list[Path]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf_paths = sorted(PDFS_DIR.glob("*.pdf"))
    if filter_stem:
        pdf_paths = [p for p in pdf_paths if p.stem.startswith(filter_stem)]
    if not pdf_paths:
        return []

    written: list[Path] = []
    for pdf_path in pdf_paths:
        text = extract_one(pdf_path)
        out_path = OUTPUT_DIR / f"{pdf_path.stem}.txt"
        out_path.write_text(text, encoding="utf-8")
        written.append(out_path)
        print(
            f"extracted {pdf_path.name}: "
            f"{len(text):,} chars, "
            f"{text.count(chr(10)) + 1} lines "
            f"-> {out_path.relative_to(ROOT)}"
        )
    return written


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Extract text from rendered resume PDFs.")
    parser.add_argument("name", nargs="?", help="PDF stem filter (optional)")
    args = parser.parse_args(argv)
    written = extract_all(args.name)
    if not written:
        print(f"no PDFs matched stem='{args.name}'", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
