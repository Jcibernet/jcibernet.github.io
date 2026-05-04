# tools/

Local helpers for this site.

## `cache-bust.py`

Rewrites static-asset references (CSS, JS, woff2) in `index.html`,
`es/index.html` and `styles/styles.css` so each URL carries a content
hash query string: `/styles/styles.css?v=eb0c91ed`.

Why: assets are cached for 6 months at the Cloudflare edge. A new hash
is a new URL → no need to "Purge Everything" in CF after every deploy.

```bash
python3 tools/cache-bust.py
```

The script iterates until hashes converge (the CSS references the fonts
and the HTML references the CSS, so a font change requires two passes).

## `hooks/pre-commit`

Same script, wired as a Git pre-commit hook. Only runs if you've staged
a file that matters (CSS, JS, or a Poppins woff2). On a fresh clone:

```bash
ln -sf ../../tools/hooks/pre-commit .git/hooks/pre-commit
chmod +x tools/hooks/pre-commit
```

To bypass for a single commit:

```bash
git commit --no-verify -m "..."
```
