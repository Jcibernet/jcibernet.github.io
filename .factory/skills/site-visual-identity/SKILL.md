---
name: site-visual-identity
description: Visual identity, design system and asset-generation guide for juancampias.com. ACTIVATE whenever you are creating, regenerating or editing any visual asset for this project — including og:image / social cover, favicons, logo marks, hero images, screenshots, banners, slide decks, social posts, email signatures, or any rendered HTML/CSS-to-image artifact. Also activate when modifying CSS variables, theme color, or anything that touches the color palette / typography of the site. The goal is to keep ALL visual outputs consistent with the existing site theme defined in `styles/styles.scss` (compiled to `styles/styles.css` — edit the SCSS, never the CSS).
---

# Site Visual Identity — juancampias.com

This site has an **established visual identity**. Every asset (OG cover, favicons, logos, slides, screenshots, banners, etc.) AND every on-site section MUST follow this system. Do not invent new colors, gradients or fonts.

## 0. Source of truth & build pipeline (READ FIRST)

CSS is **compiled from SCSS**. The single source of truth is **`styles/styles.scss`**, NOT `styles.css`.

- ✅ **Edit `styles/styles.scss`.**
- ❌ **Never hand-edit `styles/styles.css`** — it is regenerated and your changes will be overwritten on the next build.
- The `:root { --color-* }` block lives in `styles.scss`. If this file diverges from it, **trust `styles.scss`** and update this skill.

After any change to SCSS, fonts, or `app.js`, run the build + cache-bust:

```bash
npm run build:css                 # sass styles.scss -> styles.css
python3 tools/cache-bust.py       # rewrites ?v=<hash> in index.html, es/index.html, styles.css
```

`cache-bust.py` is idempotent and rewrites asset URLs only when content changed (so Cloudflare/browsers fetch fresh files without a manual purge). If you add a **new** asset (e.g. a new self-hosted font), add its path to the `ASSETS` list in `tools/cache-bust.py` too.

Deploy = commit + push to `master` (GitHub Pages serves it). Sign commits with:
`git -c user.email="juancibernet@users.noreply.github.com" -c user.name="Juan Cibernet"`.

---

## 1. Color Palette (canonical)

Defined in `styles/styles.scss :root`:

| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#171d31` | **Main background** — dark navy |
| `--color-secondary` | `#055821` | **Brand accent** — forest green (CTAs, highlights, brand mark) |
| `--color-secondary-bright` | `#0a7a30` | Brighter green for hovers, icon strokes, the blinking title cursor. In CSS as `--color-secondary-bright`. |
| `--color-white` | `#FFFFFF` | Headlines, primary text on dark |
| `--color-grey-1` | `#dbe1e8` | Brand-text / soft headings |
| `--color-grey-2` | `#b2becd` | Body / subtitles / muted copy |
| `--color-grey-3` | `#6c7983` | Captions, metadata, domain text |
| `--color-grey-4` | `#454e56` | Borders on dark surfaces |
| `--color-grey-5` | `#2a2e35` | Cards, chips, form inputs |
| `--color-grey-6` | `#12181b` | Section background (alt), end of gradients |
| `--color-black` | `#000000` | Reserved, rarely used |

### Special derived token (large-format assets only — NOT in CSS)

| Token | Hex | Role |
|---|---|---|
| `--secondary-bright-asset` | `#34c759` | Use **only** in generated assets (OG covers, social) when even `#0a7a30` is too dark to pop on `#171d31` at large scale. Same hue family. Do NOT use it in site CSS — the site uses `--color-secondary-bright` (`#0a7a30`).|

---

## 2. Forbidden Colors

The following palettes have appeared in past iterations by mistake. **Never use them**:

- ❌ Tailwind indigo / cyan family (`#6366f1`, `#22d3ee`, `#818cf8`) — wrong brand hue
- ❌ Pure black (`#000000`) backgrounds — use `#171d31` or `#12181b`
- ❌ Generic Bootstrap blues, purples, magentas
- ❌ Any gradient that mixes the above with the green accent

If a richer composition is required, build gradients from the existing palette only:

- Background gradient: `linear-gradient(135deg, #171d31 0%, #12181b 100%)`
- Accent glow: `radial-gradient(circle, rgba(5,88,33,0.35), transparent 60%)`
- Subtle surface glow: `radial-gradient(ellipse, rgba(42,46,53,0.5), transparent 60%)`

---

## 3. Typography

The site self-hosts **three** font families (all in `/fonts/`, declared via `@font-face` in `styles.scss`). **No Google Fonts `<link>` / `@import` on the live site** — it blocks the critical render path. See §4 and §7.

| Family | Files | Used for |
|---|---|---|
| **Poppins** (400/500/600/700/800) | `poppins-{400,500,600,700,800}.woff2` | Everything: body, headings, CTAs, section titles |
| **Space Grotesk** (variable 300–700) | `spacegrotesk-variable.woff2` | Legacy display accents (body fallback stack). Poppins 800 is preferred for new titles. |
| **JetBrains Mono** (variable 400–700) | `jetbrainsmono-variable.woff2` | The "terminal" layer: eyebrows, chips, status labels, monospace metadata, CTA labels. See §10. |

- **System fallbacks**: `-apple-system, 'Segoe UI', Roboto, sans-serif`
- **Heading / section-title weight**: `800` (Poppins)
- **Body weight**: `400`
- **CTA / nav weight**: `600`
- **Monospace weight**: `400` (JetBrains Mono)
- **Tracking on big headlines**: negative (`letter-spacing: -.022em`); positive + uppercase on mono labels (`letter-spacing: .22em`)
- Never substitute Poppins for Inter, Manrope, Geist, etc., even if "more modern". Brand consistency wins.
- Three weights are preloaded in HTML `<head>`: Poppins 400/700/800 + Space Grotesk. JetBrains Mono loads via `@font-face` (not preloaded — it's below the fold).

---

## 4. Iconography & Brand Mark

- **Logo mark**: rounded square (`border-radius: 12px` at 52px scale, scale proportionally), solid `#055821` background, white "JC" in Poppins 800.
- **Apple touch / favicon**: same mark on solid green `#055821`.
- **No multicolor logo. No gradient on the mark.** (Past mistake: gradient indigo→cyan.)
- Tech stack icons in compositions: render as **text chips** styled like the site's UI cards (`background: #2a2e35`, `border: 1px solid #454e56`, `color: #dbe1e8`, `border-radius: 8px`, padding `7px 13px`, weight 600, size 13px). This avoids broken external SVG loads in headless renders **and** matches the on-site visual language.

### In-page icon system (NOT FontAwesome)

The site no longer loads FontAwesome from CDN — it ships an inline SVG sprite at the top of every page. To add a new icon:

1. Download the SVG (FontAwesome 6 free, simpleicons.org, etc.)
2. Add a `<symbol id="i-<name>" viewBox="...">...</symbol>` to the sprite block at the top of `<body>` in **both** `index.html` and `es/index.html`
3. Reference it: `<svg class="icon" aria-hidden="true"><use href="#i-<name>"></use></svg>`
4. The `.icon` CSS class already handles size (1em) and `currentColor` fill — context styles override as needed

Never re-introduce `<i class="fa...">` or external icon CSS. It costs ~165 KB and blocks render.

### Self-hosted fonts

All three families live in `/fonts/` and are declared via `@font-face` in `styles.scss`:
- `poppins-{400,500,600,700,800}.woff2` (latin subset, ~8 KB each)
- `spacegrotesk-variable.woff2` (~22 KB)
- `jetbrainsmono-variable.woff2` (~40 KB) — terminal layer

Poppins 400/700/800 + Space Grotesk are preloaded in the HTML head. Don't re-add Google Fonts `<link>`/`@import` to the site — it blocks the critical render path. To add a new weight/family: drop the woff2 in `/fonts/`, add a `@font-face` in `styles.scss`, add the path to `ASSETS` in `tools/cache-bust.py`, then run the build pipeline (§0).

---

## 5. Composition Rules for Asset Generation

When generating any wide visual (OG cover, banner, slide):

1. **Background**: dark navy `#171d31` base, with one `radial-gradient` accent in `rgba(5,88,33, 0.25–0.45)` placed top-right or top-left, and an optional subtle `#12181b` lower-corner gradient.
2. **Optional grid overlay**: `linear-gradient` 1px lines in `rgba(178,190,205,0.04–0.05)` at 48px spacing, masked with a radial fade.
3. **Headline**: white, Poppins 800, big. The brand-relevant phrase (usually "AI Integration" or the service vertical) goes in the green accent (`#34c759` for high contrast on dark bg).
4. **Body/subtitle**: `#b2becd` (grey-2).
5. **Captions / domain / labels**: `#6c7983` (grey-3), uppercase with `letter-spacing: 2.5px` for stack labels.
6. **Cards / chips**: `#2a2e35` background, `#454e56` border.
7. **Brand consistency check before saving**: the asset must look like it could be a hero crop of the live site. If it doesn't, palette is wrong.

---

## 6. Standard Asset Specs

| Asset | Dimensions | Format | Target size | Path |
|---|---|---|---|---|
| OG cover | 1200×630 | JPG q92 | < 100 KB | `img/og-cover.jpg` |
| Twitter card | 1200×630 | JPG q92 | < 100 KB | (reuses `og-cover.jpg`) |
| Favicon SVG | 64×64 viewBox | SVG | < 1 KB | `img/favicon.svg` |
| Favicon PNG | 32×32 | PNG (optimized) | < 2 KB | `img/favicon-32.png` |
| Apple touch icon | 180×180 | PNG (optimized) | < 20 KB | `img/apple-touch-icon.png` |
| LinkedIn banner | 1584×396 | JPG q92 | < 200 KB | `img/linkedin-banner.jpg` |

---

## 7. Render Pipeline (HTML → PNG/JPG)

This project uses **Chrome headless** to render HTML/CSS to images. Standard recipe:

```bash
google-chrome --headless=new --disable-gpu --no-sandbox \
  --hide-scrollbars \
  --window-size=1200,700 \           # render slightly taller, then crop
  --virtual-time-budget=8000 \       # MUST: waits for fonts + remote assets
  --run-all-compositor-stages-before-draw \
  --screenshot=/tmp/raw.png \
  file:///tmp/template.html
```

Then crop/optimize with Pillow:

```python
from PIL import Image
im = Image.open('/tmp/raw.png').crop((0, 0, 1200, 630))
im.save('img/og-cover.jpg', 'JPEG', quality=92, optimize=True)
```

**Critical flags**:
- `--virtual-time-budget=8000` → without this, fonts and remote SVGs don't load in time. Always include.
- Render at `window-size=1200,700` and **crop to 1200×630**. Chrome reserves ~30–70px for chrome UI even in headless.
- Prefer **inline styled chips** over remote brand SVGs (e.g., simpleicons.org). Remote loads frequently fail and break consistency.

**Fonts in templates — IMPORTANT (this is a one-off asset template, NOT the live site):**
- For a **generated asset** template you MAY load fonts from Google in the template `<style>`, because the template is throwaway and never shipped:
  `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap')`
- More robust: point the template at the repo's **self-hosted** woff2 with absolute `file://` `@font-face` `src` (no network, always renders). Prefer this when the asset must match the site's terminal look (mono labels, etc.).
- ⚠️ **Never add a Google Fonts `<link>`/`@import` to the actual site** (`index.html`, `es/index.html`, `styles.scss`). The live site is 100% self-hosted (§3) and Google Fonts blocks the critical render path. This exception applies ONLY to disposable asset-render templates.

---

## 8. Pre-flight Checklist (before saving any visual asset)

- [ ] Background uses `#171d31` and/or `#12181b` only
- [ ] Accent color is `#055821` (or `#34c759` if needed for contrast on dark bg)
- [ ] Font family is Poppins
- [ ] No tailwind-indigo, no cyan, no purple, no Bootstrap blue
- [ ] Logo mark is solid green, not gradient
- [ ] Stack icons (if any) are text chips with `#2a2e35` bg / `#454e56` border, not external SVG logos
- [ ] Output dimensions match the spec table
- [ ] File is optimized (`optimize=True` in Pillow, `quality=92` for JPG)
- [ ] Asset visually feels like it could be a region of the live site

If any box is unchecked, do not save. Re-render.

---

## 9. Bilingual assets

The site is bilingual: EN at `/` and ES at `/es/`. When generating any asset that **contains text** (OG cover, slide, banner, social post, screenshot annotation, etc.):

- Default to English. The English asset is the canonical one and is referenced by both `index.html` and `es/index.html` via `og:image`.
- If the user asks for a Spanish-targeted asset (e.g., LinkedIn LATAM campaign), produce a parallel `<name>-es.<ext>` next to the English version, and update `og:image` only in `es/index.html`.
- Avoid mixing both languages in a single asset.
- Same palette, fonts and composition rules in both versions.
- **Any on-site section must be edited in BOTH `index.html` (EN) and `es/index.html` (ES)** with the same structure/classes, only the copy differs.

Example file naming for a parallel pair:

```
img/og-cover.jpg        # English (default, referenced everywhere by default)
img/og-cover-es.jpg     # Spanish variant, referenced only from es/index.html if needed
```

⚠️ **Geo-redirect gotcha when rendering the EN page locally:** `app.js` geo-redirects `/` and `/index.html` → `/es/` for visitors from Spanish-speaking countries (the dev machine is in Argentina). A headless capture of `http://localhost:PORT/index.html` will therefore show the **ES** page. To capture the real EN page, either copy it to a non-root filename first (`cp index.html _en-preview.html`, render `/_en-preview.html`, then delete it), or set `pref_lang=en` before the redirect fires. `/es/` never redirects, so it captures directly. See the `visual-debug` skill for the render mechanics.

---

## 10. Terminal / "command-line" design system (CURRENT on-site language)

The site's sections share a consistent **terminal-panel aesthetic**. When you build or edit ANY section, match this language — do not invent a new card/header style. All of it is defined in `styles.scss` and rendered in both `index.html` and `es/index.html`.

### Section header (every major section)
```html
<p class="sec-eyebrow">
  <span>$ ./command.sh</span>
  <span class="sep">·</span>
  <span>meta</span>
</p>
<h2 class="sec-title">Plain words <span class="hl">accent</span></h2>
```
- `.sec-eyebrow`: JetBrains Mono, uppercase, `letter-spacing:.22em`, color `--color-secondary`, with a small solid green square `::before`. Phrased as a shell command (`$ whoami`, `$ git log --career`, `$ ls ./projects`, `$ ./contact --init`).
- `.sec-title`: Poppins 800, `clamp(1.9rem, 3.6vw, 2.9rem)`, the accent word wrapped in `.hl` which renders the **brand green** plus a blinking `_` cursor (`svc-blink` keyframe). The services section uses its own `.services-title`/`.ay` variant — same idea.
- Headers are **left-aligned**, not centered (the old centered `<h2>` style is retired).

### Panels & cards (shared visual primitives)
- **Surface**: `linear-gradient(180deg, rgba(42,46,53,.5), rgba(23,29,49,.42))`, `1px solid var(--color-grey-5)`, `border-radius:1px` (almost square — the terminal look).
- **Corner brackets**: green L-shaped marks in opposite corners built from layered `linear-gradient(...) / 14px 1px no-repeat` backgrounds on `::before`/`::after` (see `.svc`, `.about-content`, `.featured-card`, `.contact-form`, `.tl-content`). They go `opacity:.5–.55` at rest, `opacity:1` on hover.
- **Hover**: `border-color: var(--color-grey-3)` + `transform: translateY(-2px)` (cards) or `translateX(2px)` (timeline).
- **Status dot**: 6px green circle with a `box-shadow` glow (`.svc-status::before`), often next to an "Online" label.
- **Icon badge**: 46px square, `1px solid rgba(5,88,33,.45)`, faint green fill, a 6px green nub in the top-right corner, stroke icon in `--color-secondary-bright`.

### Chips / metadata
- `.chip` / mono labels: JetBrains Mono, `~9.5px`, uppercase, `letter-spacing:.08em`, `1px solid var(--color-grey-5)`, `background: rgba(10,13,20,.4)`, `border-radius:1px`. Used for tech stacks, timeline dates, capability rows.

### CTA
- `.services-cta`: solid green block, JetBrains Mono uppercase label, a `/INIT`-style corner tab (`.cta-tab`), hard offset box-shadow that shifts on hover. Hero CTA uses `.cta-techno` with a `/01` tab — same family.

### Decoration
- Sections may include a faint SVG **circuit-trace** overlay (`.traces` / `.deco`) in the top/right, plus a `radial-gradient` accent in `rgba(5,88,33,.08–.10)`. Keep it subtle (`opacity:.5`).

### Rule of thumb
If you're adding a section and reaching for a rounded card, a centered `<h2>`, or a non-mono label — stop. Reuse `.sec-eyebrow` + `.sec-title` + the panel/bracket/chip primitives above so the new section is indistinguishable in style from Services / About / Track Record / Featured / Contact.

---

## 11. When to update this skill

Update this file (and `styles.scss`, never `styles.css`, if needed) when:

- The user explicitly asks for a redesign or new color scheme
- A new asset class is introduced (e.g., podcast cover, ebook mockup)
- A new design token is added to `:root` in `styles.scss`
- A new section adopts (or extends) the terminal design system in §10
- Site structure / URLs change (e.g., a new locale, a new section)

Do **not** update it for one-off variations. One-offs go in the asset itself, not the skill.
