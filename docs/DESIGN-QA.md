# Design Revamp QA — Restrained Futurism

Date: 2026-05-29 · Scope: visual reskin (light default + on-brand dark), Ember Red accent,
re-skin in place (no shadcn). Verdict: **PASS**.

## Automated gates
| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | ✅ clean |
| `npm run lint` | ✅ clean (0 problems) |
| `npm run build` | ✅ 43/43 static pages |

## Live verification (prod server)
- **Routes**: `/`, services, insights, reports, contact, `/sitemap.xml`, `/robots.txt` → all **200**.
- **SEO preserved**: sitewide JSON-LD (`Organization` + `WebSite`) intact; home `<title>` unchanged; metadata untouched. No route/MDX/form/API behavior changed.
- **Dark theme**: `.dark` token block compiled (deep forest canvas `#0b1612`); class-based via `@custom-variant dark`. Light is the default.
- **Theme toggle**: accessible `role="switch"` button in header; persists to `localStorage` (`dpt-theme`); no-FOUC init script in `<head>` applies the saved theme before paint.
- **Mono technical labels**: 36 `font-mono` usages on home (eyebrows + stat figures); JetBrains Mono wired as `--font-geist-mono`.
- **Signature moment**: `.aurora` gradient-mesh present on the home hero (brand greens + ember, `color-mix`), with `aurora-drift` keyframes gated by `prefers-reduced-motion`.
- **Texture**: fixed `.grain-overlay` (SVG noise, ~2.5% / 4% dark), `pointer-events:none`.
- **Fonts**: Montserrat (display/H1/H2) + Inter (body) + JetBrains Mono (labels) all compiled.

## Accessibility / craft
- Toggle: keyboard-operable, `aria-checked`, dynamic `aria-label`/title; both icons rendered, CSS swaps by theme (no hydration mismatch).
- Motion: aurora drift + scroll-reveal gated by `prefers-reduced-motion`.
- Contrast: light theme unchanged (already AA). Dark theme: near-white text `#edf2ee` on `#0b1612` (~16:1); muted `#9fb1a6` on canvas (~7:1). Ember accent retained.
- Headings/landmarks/focus rings unchanged.

## Notes / follow-ups
- `color-mix(in oklab …)` (aurora) degrades gracefully on older browsers (blob simply not painted) — content unaffected.
- Re-run Lighthouse + axe on staging in **both** themes with real imagery to confirm CWV ≥90 / SEO ≥95 and dark-mode contrast on photographic content.
- Partner trust-strip logos still text placeholders (BLOCKERS) — unrelated to this revamp.
