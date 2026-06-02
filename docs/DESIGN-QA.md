# Design QA — Raycast-grade Motion Revamp (dark-default)

Date: 2026-06-02 · Scope: dark-first reskin + site-wide motion system + signature network
motif. Decisions: **dark default** (light = toggle), **Ember Red** accent, **Framer Motion +
lazy canvas** (no GSAP/Lottie/shadcn), applied **whole-site**. Verdict: **PASS**.

## Automated gates
| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | ✅ clean |
| `npm run lint` | ✅ clean (0 problems) |
| `npm run build` | ✅ 43/43 static pages |

## Hard rule — engine preserved (verified live)
SEO/behaviour unchanged by the reskin:
- **JSON-LD intact per page type**: home → Organization + WebSite; service → Service + FAQPage + BreadcrumbList; article → BlogPosting + BreadcrumbList; report → Article + BreadcrumbList.
- **Titles + canonicals unchanged** (e.g. `/services/it-procurement` title + canonical verified).
- **sitemap.xml** = 35 `<loc>`; **robots.txt** 200. All routes 200.
- Routes, `generateStaticParams`/`revalidate`/`dynamicParams`, MDX content, content layer, forms, and API handlers untouched.

## Theme
- **Dark is the default** (deep forest-green canvas `#0b1612`); applied before paint by the head init script (defaults to dark, removes only on stored `light`). Light remains via the accessible header toggle (persisted).
- Class-based via `@custom-variant dark`. No FOUC.

## Motion system (§6) — tokenized, reduced-motion-aware
- Tokens in `src/components/motion/tokens.ts` (durations 150/220/320ms, ease `cubic-bezier(0.22,1,0.36,1)`, spring).
- **Primitives**: `FadeIn`, `Stagger`/`StaggerItem` (scroll reveals), `CountUp` (stats), `Magnetic` (cursor-pull CTAs), `Marquee` (logo scroll). All gate on `useReducedMotion`; resting states are fully visible (SSR/crawl-safe, no content hidden without JS).
- **Route transitions**: CSS `.route-enter` via `template.tsx` (JS-free, can't hide content; reduced-motion disables).
- **Signature motif**: `NetworkField` (canvas 2D) — drifting infrastructure nodes + hairline links + Ember data pulses; cursor-magnetic; pauses offscreen and when tab hidden; DPR-capped; node count capped (≤60, scales down on mobile). Lazy (`dynamic ssr:false`) → **not in SSR HTML or the shared bundle**; aurora is the fallback beneath it. Reduced-motion → single static frame.

## Section application (§7)
- **Home**: motif+aurora hero, magnetic primary CTA, marquee trust strip, two-beat "Why" pillars, staggered services grid, **filterable** industries grid (layout-animated chips), count-up stats, staggered testimonials, glass "content shelf" for insights+report, aurora closing CTA.
- **Services / Industries**: staggered card grids, FadeIn sections, stronger display hero, hover-lift cards.
- **Approach**: 6-step **process timeline** that draws down an Ember spine on scroll (reduced-motion → static spine).
- **About**: count-up stats + FadeIn sections. **Contact**: calm reveal, sticky details, form logic untouched.
- **Insights / Reports**: glass article/report cards with hover lift, staggered grids, FadeIn bodies; search/pagination and the gated report form preserved.

## Accessibility / performance
- Heading order + single `<h1>` per page preserved; focus-visible rings intact; filter chips use `aria-pressed`.
- All animation `transform`/`opacity`-based; motif is `requestAnimationFrame`, paused offscreen/hidden.
- Framer Motion is code-split per client component; the heavy canvas motif is a separate lazy chunk.
- Dark contrast: text `#edf2ee` on `#0b1612` ≈ 16:1; muted ≈ 7:1; Ember accent retained.

## Follow-ups
- Run Lighthouse + axe on staging in BOTH themes with real imagery to confirm Perf ≥90 / SEO ≥95 / CWV "Good" on mobile and dark-mode contrast over photos.
- Optional top route-progress bar (not added — CSS route transition covers the "no white flash" requirement).
- Partner trust-strip logos still text placeholders (BLOCKERS), unrelated to this pass.
