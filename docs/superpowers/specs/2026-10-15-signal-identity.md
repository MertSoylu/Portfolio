# Visual Identity v2 — "Signal"

**Date:** 2026-10-15 · **Supersedes:** `2026-06-19-portfolio-redesign-design.md` (warm editorial / Fraunces + clay).

## Idea

A precise, technical, dark-first identity: near-black canvas, hairline grid, one Claude-orange **signal** colour, Geist + Geist Mono. It reads like a well-made engineering tool, not a code toy: no ASCII art, no glitch, no WebGL, no canvas effects. Personality comes from typography, a measured grid, mono metadata and one loud accent used sparingly.

Non-negotiables: TR/EN parity for every visible string, WCAG AA contrast, `prefers-reduced-motion` respected, mobile-first (360px no horizontal scroll), zero continuous JS animation loops.

## Fonts (self-hosted, no Google Fonts)

- `@fontsource-variable/geist` → `font-sans` (body + display).
- `@fontsource-variable/geist-mono` → `font-mono` (labels, indices, tags, metadata, numbers).
- Imported once in `src/main.jsx`. Remove Google Fonts `<link>`/preconnects from `index.html` and the fonts runtime cache from `vite.config.js`.

## Colour tokens (RGB triplets in CSS vars; Tailwind maps them with `<alpha-value>`)

| Token         | Dark (default)        | Light                 | Use                                                        |
| ------------- | --------------------- | --------------------- | ---------------------------------------------------------- |
| `--canvas`    | `10 11 13` #0A0B0D    | `247 247 244` #F7F7F4 | page background                                            |
| `--surface`   | `17 19 22` #111316    | `255 255 255`         | cards                                                      |
| `--surface-2` | `24 27 31` #181B1F    | `239 239 235` #EFEFEB | inset, hover, inputs                                       |
| `--fg`        | `236 237 239` #ECEDEF | `12 13 15` #0C0D0F    | text                                                       |
| `--muted`     | `143 148 156` #8F949C | `88 92 99` #585C63    | secondary text (≥5.5:1)                                    |
| `--line`      | `236 237 239`         | `12 13 15`            | borders, always with alpha                                 |
| `--accent`    | `217 119 87` #D97757  | `168 69 42` #A8452A   | **text-safe** accent: text, icons, small marks, focus ring |
| `--signal`    | `217 119 87`          | `217 119 87`          | accent **fill** (buttons, highlight, monogram)             |
| `--signal-fg` | `10 11 13`            | `10 11 13`            | text on signal fill                                        |
| `--ok`        | `74 222 128`          | `21 128 61`           | success / available                                        |
| `--danger`    | `248 113 113`         | `185 28 28`           | errors                                                     |

Tailwind: `canvas surface surface2 fg muted line accent ok danger` + `signal: { DEFAULT, fg }`.
Rules: never `text-signal` on light backgrounds (use `text-accent`). Line alphas only from Tailwind's opacity scale (5,10,15,20,25…) — **no `/12`**, it generates nothing. Selection = signal bg + signal-fg text.

## Type scale (Geist; headings weight 600, tight tracking)

| Class           | Size                          | Tracking / leading | Use                                      |
| --------------- | ----------------------------- | ------------------ | ---------------------------------------- |
| `.text-display` | clamp(2.75rem, 8vw, 6rem)     | -0.045em / 0.92    | hero name only                           |
| `.text-h1`      | clamp(2.25rem, 5vw, 3.75rem)  | -0.035em / 1.02    | page titles                              |
| `.text-h2`      | clamp(1.75rem, 3.2vw, 2.5rem) | -0.03em / 1.1      | section titles                           |
| `.text-h3`      | 1.375rem                      | -0.02em / 1.25     | card titles                              |
| `.text-h4`      | 1.125rem                      | -0.01em / 1.35     | sub-cards                                |
| `.text-lead`    | 1.125rem (sm: 1.25rem)        | 1.6, `text-muted`  | intros                                   |
| `.label`        | mono 0.75rem uppercase        | 0.08em             | eyebrows, metadata                       |
| `.micro`        | mono 0.6875rem                | 0.04em             | smallest allowed size (no 10px anywhere) |

## Shape, depth, motifs

- Radius: cards `rounded-lg` (8px), buttons/inputs `rounded-md` (6px), tags `rounded` (4px). No pills except the status chip.
- Depth by border + surface, not shadow. Cards: `bg-surface border border-line/10`. Interactive hover: `border-line/25 bg-surface2/60`, 150ms colour transition. No lift, tilt, magnet or spotlight.
- **Background:** fixed, pure CSS: 64px hairline grid (`line/5`), radial mask fading to canvas, plus a very faint signal glow at the top (≤6% alpha). No JS.
- **Section index:** every home section has a mono index + label (`01 / Projeler`) on a full-width hairline rule above the title.
- **Corner ticks** (`.ticks`): L-shaped accent marks on the four corners of hero/featured panels (background gradients, no extra DOM). Use on ≤2 elements per page.
- **Signal highlight** (`.mark`): signal fill behind a word in the hero role line.
- **Status dot**: `ok` dot with a CSS pulse ring, disabled under reduced motion.

## Components (`src/index.css @layer components` + `src/components/ui/`)

- Buttons: `.btn` base (h-11, px-5, text-sm, font-medium, rounded-md, inline-flex gap-2, focus ring) + `.btn-primary` (signal fill, signal-fg text), `.btn-secondary` (border line/20, hover line/40 + surface2), `.btn-ghost`, `.btn-lg` (h-12 px-6).
- `.card`, `.card-interactive`, `.tag` (mono 0.75rem, border line/15, px-2 py-0.5), `.label`, `.link` (accent underline that grows on hover), `.container-site` (max-w-6xl, **single** gutter px-4 sm:px-6 lg:px-8).
- `SectionHeader({ id, index, label, title, lead, aside })` — the only section header pattern; renders the hairline rule + mono index, h2, lead.
- `Reveal` stays: opacity + 12px rise, 0.5s, once; reduced motion → opacity only.
- Focus: 2px `accent` outline, 2px offset, everywhere.

## Motion

- Page transition: opacity + 8px, 0.3s in / 0.15s out (`mode="wait"` kept). Reduced motion: 0.15s fade.
- Hero roles: `RotatingText` kept, mono, inside `.mark`; reduced motion → static first role + full list for screen readers.
- Only CSS transitions on hover/focus. No RAF loops, no canvas, no WebGL anywhere.

## Removed (delete files + deps)

Aurora (and `ogl`), Noise, ClickSpark, ASCIIText, GradientText, ShinyText, Magnet, MagicBento, TiltedCard, SpotlightCard, LogoLoop, CardMarquee, ProjectModal, `src/lib/utils.ts` (+ `clsx`, `tailwind-merge`), legacy Tailwind palettes/shadows/keyframes, legacy CSS classes, Google Fonts.

## Information architecture

- `src/data/areas.js` = single source for the four areas (id, path, index, name, short, stack). Feeds About, Footer, NotFound, SEO_META titles. Canonical names:
  - web — Web Geliştirme / Web Development
  - android — Android Geliştirme / Android Development
  - cybersecurity — Siber Güvenlik / Cybersecurity
  - data-science — Veri Bilimi ve Yapay Zekâ / Data Science & AI
- Turkish register: informal "sen" everywhere (UI and SEO).
- Navbar: brand (signal monogram "MS" + visible name), links About · Projects · Certificates · Contact, TR/EN toggle (visible text in accessible name), theme toggle, mobile sheet (aria-controls, Escape closes, focus moves in and returns).

## Pages

- **Home:** Hero → 01 About (bio + facts + 4 area cards + GitHub chart) → 02 Projects (featured NOBLE, grid of the other five, open-source repo grid — static, no marquee, no modal) → 03 Stack (static categorised grid, text + icon) → 04 Certificates → 05 Contact (channels + form).
- **Area pages** (`SpecialtyPageLayout`): back link, mono `Alan 0N / 04`, h1, lead, meta aside (stack, counts), page content, closing CTA band (contact + next area).
- **Case study:** same tokens; header with preview, facts strip, numbered sections, mobile jump list, sticky TOC on lg, prev/next.
- **404:** centered, mono `404`, area links in a `nav`.

## Kept contracts (tests rely on these)

`main#main`, single `a[href="#main"]`, `a[href="/cv.pdf"][download]`, `#projects` with an `h3` per project (all six titles) and `#projects h3 a` → `/case-study/<id>`, `ul[aria-label*="GitHub"]`, `input[name="website"]` honeypot, case-study preview images `/previews/<id>-live.webp`, msscan terminal text `msscan>` + `HTML report ready`, noble `video[preload="none"]` + 5 gallery images, prev/next nav named "Proje gezinme|Project navigation", "Diğer projeler|Other projects" nav, unknown case study → 404.
