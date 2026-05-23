"""Render resume markdown files to PDFs for the experiment harness.

Markdown source lives in `pool/resumes/`; rendered PDFs go to `pdfs/clean/`.
Rendering is done via Playwright (Chromium) so we get high-fidelity print
output that matches how real candidates produce PDFs from HTML resumes.

The renderer is deterministic and parameter-free in this baseline form.
Later phases will introduce attack-injecting variants (Tier 1-4) that
either preprocess the markdown/HTML or post-process the produced PDF.

Usage:
    uv run python harness/render.py              # render all resumes
    uv run python harness/render.py daniel       # render only stem 'daniel*'
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import markdown
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent.parent
RESUMES_DIR = ROOT / "pool" / "resumes"
OUTPUT_DIR = ROOT / "pdfs" / "clean"
STYLES_PATH = ROOT / "harness" / "styles.css"


def md_to_html_doc(md_text: str, css: str | None = None) -> str:
    """Convert a markdown source string into a standalone HTML document.

    Inline HTML in the markdown source (e.g. `<span style="color:white;">...</span>`
    used by Tier 1 attack injectors) is preserved by the `extra` extension.
    """
    body = markdown.markdown(md_text, extensions=["extra"])
    style_block = f"<style>{css}</style>" if css else ""
    return (
        "<!doctype html><html><head>"
        f"<meta charset='utf-8'>{style_block}"
        "</head>"
        f"<body>{body}</body></html>"
    )


def render_html_to_pdf(html_doc: str, pdf_path: Path) -> None:
    """Render a single HTML document to a PDF via headless Chromium."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        try:
            page = browser.new_page()
            page.emulate_media(media="print")
            page.set_content(html_doc, wait_until="load")
            page.pdf(
                path=str(pdf_path),
                format="A4",
                print_background=True,
                prefer_css_page_size=True,
            )
        finally:
            browser.close()


def default_css() -> str:
    return STYLES_PATH.read_text(encoding="utf-8")


def render_all(filter_stem: str | None = None) -> list[Path]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    css_text = STYLES_PATH.read_text(encoding="utf-8")

    md_paths = sorted(RESUMES_DIR.glob("*.md"))
    if filter_stem:
        md_paths = [p for p in md_paths if p.stem.startswith(filter_stem)]

    if not md_paths:
        return []

    rendered: list[Path] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.emulate_media(media="print")
        for md_path in md_paths:
            html_doc = md_to_html_doc(md_path.read_text(encoding="utf-8"), css_text)
            page.set_content(html_doc, wait_until="load")
            pdf_path = OUTPUT_DIR / f"{md_path.stem}.pdf"
            page.pdf(
                path=str(pdf_path),
                format="A4",
                print_background=True,
                prefer_css_page_size=True,
            )
            rendered.append(pdf_path)
            print(f"rendered {md_path.name} -> {pdf_path.relative_to(ROOT)}")
        browser.close()
    return rendered


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Render resume markdown to PDFs.")
    parser.add_argument("name", nargs="?", help="Resume stem filter (optional)")
    args = parser.parse_args(argv)
    rendered = render_all(args.name)
    if not rendered:
        print(f"no resumes matched stem='{args.name}'", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
