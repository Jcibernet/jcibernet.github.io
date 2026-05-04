---
name: site-visual-identity
description: Visual identity, design system and asset-generation guide for juancampias.com. ACTIVATE whenever you are creating, regenerating or editing any visual asset for this project — including og:image / social cover, favicons, logo marks, hero images, screenshots, banners, slide decks, social posts, email signatures, or any rendered HTML/CSS-to-image artifact. Also activate when modifying CSS variables, theme color, or anything that touches the color palette / typography of the site. The goal is to keep ALL visual outputs consistent with the existing site theme defined in `styles/styles.css`.
---

# Site Visual Identity — juancampias.com

This site has an **established visual identity**. Every asset (OG cover, favicons, logos, slides, screenshots, banners, etc.) MUST follow this system. Do not invent new colors, gradients or fonts.

The single source of truth is `styles/styles.css` (the `:root { --color-* }` block). If something in this file diverges from `styles.css`, **trust `styles.css`** and update this file.

---

## 1. Color Palette (canonical)

Defined in `styles/styles.css :root`:

| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#171d31` | **Main background** — dark navy |
| `--color-secondary` | `#055821` | **Brand accent** — forest green (CTAs, highlights, brand mark) |
| `--color-white` | `#FFFFFF` | Headlines, primary text on dark |
| `--color-grey-1` | `#dbe1e8` | Brand-text / soft headings |
| `--color-grey-2` | `#b2becd` | Body / subtitles / muted copy |
| `--color-grey-3` | `#6c7983` | Captions, metadata, domain text |
| `--color-grey-4` | `#454e56` | Borders on dark surfaces |
| `--color-grey-5` | `#2a2e35` | Cards, chips, form inputs |
| `--color-grey-6` | `#12181b` | Section background (alt), end of gradients |
| `--color-black` | `#000000` | Reserved, rarely used |

### Special derived tokens (assets only — NOT in CSS)

| Token | Hex | Role |
|---|---|---|
| `--secondary-bright` | `#34c759` | Use **only** when `#055821` is too dark to pop on `#171d31` (large-format covers, social media). Hue is the same family. |

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

- **Font family**: `Poppins` (Google Fonts), with system fallbacks: `-apple-system, Segoe UI, Roboto, sans-serif`
- **Weights used on the site**: 400, 500, 600, 700, 800
- **Heading weight**: `800` (h1, h2)
- **Body weight**: `400`
- **CTA / nav weight**: `600`
- **Tracking on big headlines**: `letter-spacing: -1.5px` (more negative as size grows)
- Never substitute Poppins for Inter, Manrope, Geist, etc., even if "more modern". Brand consistency wins.

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

### Self-hosted Poppins

Fonts live in `/fonts/poppins-{400,500,600,700,800}.woff2` (latin subset, ~8 KB each). Three weights are preloaded in HTML head: 400, 700, 800. Don't re-add Google Fonts `<link>` — it blocks the critical render path.

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
- `--virtual-time-budget=8000` → without this, Google Fonts and remote SVGs don't load in time. Always include.
- Render at `window-size=1200,700` and **crop to 1200×630**. Chrome reserves ~30–70px for chrome UI even in headless.
- Always include `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap')` in the template `<style>`.
- Prefer **inline styled chips** over remote brand SVGs (e.g., simpleicons.org). Remote loads frequently fail and break consistency.

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

Example file naming for a parallel pair:

```
img/og-cover.jpg        # English (default, referenced everywhere by default)
img/og-cover-es.jpg     # Spanish variant, referenced only from es/index.html if needed
```

---

## 10. When to update this skill

Update this file (and `styles.css` if needed) when:

- The user explicitly asks for a redesign or new color scheme
- A new asset class is introduced (e.g., podcast cover, ebook mockup)
- A new design token is added to `:root` in `styles.css`
- Site structure / URLs change (e.g., a new locale, a new section)

Do **not** update it for one-off variations. One-offs go in the asset itself, not the skill.
