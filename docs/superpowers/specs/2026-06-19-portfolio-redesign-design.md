# Portfolio Redesign — Design Spec

**Date:** 2026-06-19
**Scope:** Full site-wide visual + motion redesign of the Mert Soylu portfolio (React 18 SPA). Presentation layer only — all content, i18n (TR/EN), data flows (GitHub API, EmailJS), routing, SEO, and PWA behavior are preserved.

## Goal

Replace the current "Nocturne Lab" theme (neon violet/aqua/ember trio gradients, grid-line backgrounds, glow shadows, glassmorphism, terminal/decrypt/glitch/morph effects, "lab/studio" mono jargon, WebGL particles) with a **calm, spacious, warm editorial** system that reads as a confident developer portfolio — airy and usable, with zero "terminal / code-aesthetic" gimmicks.

Driving constraints (from the user):

- Ferah (airy / spacious) and kullanışlı (usable).
- For a software developer, but **no** terminal / code-toy aesthetic.
- Design **and** animations must change completely.
- Mobile responsive throughout.
- Delete everything unused.

## Design Language: "Warm Editorial Minimal"

### Typography

- **Display / headings:** Fraunces (variable soft serif) — editorial, human, distinctive.
- **Body / UI:** Inter — neutral, highly readable.
- Drop: Syne, Bricolage Grotesque, Space Mono, Compressa VF (TextPressure font).

### Color (semantic CSS-var tokens, light/dark swap)

Light: canvas `#FAF8F4`, surface `#FFFFFF`, surface-2 `#F2EFE9`, ink `#1C1815`, muted `#6F665C`, hairline `rgba(28,24,21,.10)`, accent `#C2562F`, accent-strong `#A2441F`.
Dark: canvas `#13110F`, surface `#1B1815`, surface-2 `#221E1A`, ink `#F3EEE7`, muted `#A39A8E`, hairline `rgba(243,238,231,.12)`, accent `#E0764F`, accent-strong `#EF9069`.
One accent (warm clay/terracotta) used sparingly — links, key CTAs, small marks. No multi-stop gradients as the primary identity.

### Motion (small, consistent, reduced-motion aware)

- `Reveal`: fade + 16px rise on scroll into view (once).
- Card hover: gentle 4px lift + soft shadow.
- Link: accent underline grow.
- Page transition: clean fade + small slide (no clip-path wipes).
- Drop: glitch, decrypt, morph blobs, split-flap, TextPressure, WebGL particles, 3D tilt, magnetic buttons, marquee, morphing device frame, sticky morph rail.

### Layout

Generous whitespace + vertical rhythm. Max width ~5xl–6xl. Section headers: small uppercase label (muted/accent, not mono) + large serif title + optional short lead — no "01 / lab" numbering. Cards: surface fill, 1px hairline border, calm radius, minimal shadow, subtle hover.

## Page Inventory (all rebuilt)

- **Shell:** App.jsx (transitions, background, providers), Navbar (replace StaggeredMenu with clean minimal nav), Footer.
- **Home sections:** Hero, About, Projects, Certificates, Contact.
- **Specialty pages:** /web, /android, /cybersecurity, /data-science (+ SpecialtyPageLayout).
- **Case studies:** /case-study/{mnemosyne,typesprint,walkkittie,msscan} (+ CaseStudyLayout, preview component).
- **404:** NotFoundPage.

## Components Removed

DecryptedText, SplitFlapText, TextPressure, motion/MorphBlob, motion/KineticHeadline, motion/ScrollScene, MorphDeviceShowcase, WalkKittiePetScreen, SitePreview (replaced by a clean image/browser preview), ui/fluid-particles-background, hooks/useMagnetic, CommandPalette (kbar). Associated deps (kbar, ogl, and gsap/lenis if unreferenced) pruned from package.json + vite manualChunks.

## Preserved

All copy (TR/EN), GitHub repo feed + fallback + rate limiting, EmailJS contact form + validation + honeypot, dark mode, language toggle, SEO/PageMeta/Helmet, structured data, PWA, lazyWithRetry, ScrollToTop/hash handling, accessibility (skip link, focus-visible, reduced-motion), security headers.

## Verification

`npm run lint`, `npm run build`, Playwright screenshots of every route in light+dark and desktop+mobile, update affected e2e specs, confirm no dead imports.
