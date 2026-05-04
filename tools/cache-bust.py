#!/usr/bin/env python3
"""
Cache-busting helper for static assets.

Run this whenever you change /styles/styles.css, /app.js, or any /fonts/*.woff2
BEFORE committing. It rewrites the references in index.html and es/index.html
so that the URL changes (?v=<hash>) only when the file content changes.

Cloudflare (and any browser/CDN) treats a different URL as a fresh resource:
no need to "Purge Everything" after each deploy.

Usage:
    python3 tools/cache-bust.py

The script is idempotent: if a file hasn't changed, the hash stays the same.
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Files whose hash we track. Path is relative to ROOT.
ASSETS = [
    "styles/styles.css",
    "app.js",
    "fonts/poppins-400.woff2",
    "fonts/poppins-500.woff2",
    "fonts/poppins-600.woff2",
    "fonts/poppins-700.woff2",
    "fonts/poppins-800.woff2",
    "fonts/spacegrotesk-variable.woff2",
]

# Files where we want to rewrite the references.
HTML_FILES = ["index.html", "es/index.html"]

# CSS files where we want to rewrite the @font-face url() refs.
CSS_FILES = ["styles/styles.css"]


def file_hash(path: Path) -> str:
    """Short content hash (8 hex chars of sha256). Idempotent."""
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()[:8]


def bust_html(html: str, hashes: dict[str, str]) -> str:
    """Rewrite href/src to /<asset>?v=<hash>.
    Strips any existing ?v=... before appending the new one."""
    for asset, h in hashes.items():
        # Match exact path with optional existing ?v=... query
        pattern = re.compile(
            r'(["\'])(/?)' + re.escape(asset) + r'(\?v=[a-f0-9]+)?\1'
        )
        repl = f'\\1/{asset}?v={h}\\1'
        html = pattern.sub(repl, html)
    return html


def bust_css(css: str, hashes: dict[str, str]) -> str:
    """Rewrite url('/fonts/poppins-XXX.woff2') in CSS @font-face."""
    for asset, h in hashes.items():
        if not asset.startswith("fonts/"):
            continue
        pattern = re.compile(
            r"url\((['\"])(/?)" + re.escape(asset) + r"(\?v=[a-f0-9]+)?\1\)"
        )
        repl = f"url(\\1/{asset}?v={h}\\1)"
        css = pattern.sub(repl, css)
    return css


def run_pass() -> tuple[dict, int]:
    """One sweep: compute hashes, rewrite refs. Returns (hashes, files_changed)."""
    hashes: dict = {}
    for asset in ASSETS:
        p = ROOT / asset
        if not p.exists():
            continue
        hashes[asset] = file_hash(p)

    changed = 0
    for html_path in HTML_FILES + CSS_FILES:
        p = ROOT / html_path
        if not p.exists():
            continue
        before = p.read_text(encoding="utf-8")
        after = (
            bust_css(before, hashes)
            if html_path in CSS_FILES
            else bust_html(before, hashes)
        )
        if before != after:
            p.write_text(after, encoding="utf-8")
            changed += 1
    return hashes, changed


def main() -> int:
    # The CSS file references the fonts and is itself referenced by the HTML.
    # When we update font URLs inside CSS, the CSS hash changes, so we need
    # a second pass to update the CSS reference in HTML. Iterate until stable.
    MAX_PASSES = 5
    for i in range(1, MAX_PASSES + 1):
        hashes, changed = run_pass()
        print(f"Pass {i}: {changed} file(s) updated")
        if changed == 0:
            break
    else:
        print("WARN: hashes did not converge after 5 passes", file=sys.stderr)
        return 1

    print()
    print("Final hashes:")
    for asset, h in hashes.items():
        print(f"  {h}  {asset}")
    print()
    print("Done. Commit the result, push, and you're set — no CF purge needed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
