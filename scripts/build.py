#!/usr/bin/env python3
"""
Stitches partials/*.html into pages/*.html templates and writes the
result to the project root as plain static HTML — no runtime include
mechanism, no framework. Netlify just serves the output files as-is.

Run after editing anything in partials/ or pages/:
    python3 scripts/build.py
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS_DIR = ROOT / "partials"
PAGES_DIR = ROOT / "pages"

MARKERS = {
    "<!-- INCLUDE:fonts -->": "fonts.html",
    "<!-- INCLUDE:nav -->": "nav.html",
    "<!-- INCLUDE:footer -->": "footer.html",
}


def build():
    partials = {}
    for marker, filename in MARKERS.items():
        partials[marker] = (PARTIALS_DIR / filename).read_text(encoding="utf-8")

    if not PAGES_DIR.exists():
        print("No pages/ directory found — nothing to build.")
        return

    built = 0
    for page in sorted(PAGES_DIR.glob("*.html")):
        html = page.read_text(encoding="utf-8")
        for marker, content in partials.items():
            html = html.replace(marker, content)
        out_path = ROOT / page.name
        out_path.write_text(html, encoding="utf-8")
        print(f"built {page.name}")
        built += 1

    print(f"\n{built} page(s) built from partials/ into {ROOT}")


if __name__ == "__main__":
    build()
