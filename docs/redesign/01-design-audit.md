# 01 — Design Audit vs. Apple Minimalism (Reconnaissance)

_Orchestrator-level heuristic audit from reading the token layer + representative templates (`page.tsx`, `Hero`, `Section`, `Button`, `Header`). Scores are directional (1–10); per-page deep line-audits happen inside Phase 2 for the owning agent. The current site is genuinely well-built — this is a "very good → Apple-grade" delta, not a rescue._

## Global finding: the biggest tension (now resolved)
The site is a **deliberate dark theme** (deep Forest Green canvas, `globals.css` header says *"DARK THEME ONLY"*). The master prompt's Phase 1 calls for a **cream-dominant light canvas**. **Decision (user, this session): flip to cream canvas.** This reframes the whole audit: the target is a calm cream page where **Forest Green is structural** (headings, dark punctuation bands, footer) and **Ember Red is reserved for one primary CTA per screen**.

## What is already strong (keep)
- Fluid clamp type scale with tight tracking on large headings, `text-wrap: balance/pretty`.
- 8pt-adjacent rhythm; `Section` tone/spacing system; `.measure` 65ch.
- Real motion system (framer-motion + exact signature ease), reduced-motion everywhere, frosted sticky nav, hairlines, JetBrains-mono eyebrows.
- Accessible nav (dropdown roving focus, mobile slide-over with focus trap), skip link, `:focus-visible` ring.

## Scorecard (pre-restyle, against Apple bar)
| Page / template | Whitespace | Type hierarchy | Grid/align | Color restraint | Density | Imagery | CTA clarity | Notes |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| Home (`app/page.tsx`) | 7 | 8 | 7 | 6 | 6 | 7 | 7 | Many sections back-to-back (services→why→quote→process→industries→testimonials→stats→insights→report→CTA) — reads dense; two CTAs compete in hero; aurora+motif+grain stacked. |
| About | 6 | 7 | 7 | 6 | 6 | 6 | 7 | Hardcoded dark classes; needs air + one hero message. |
| Approach | 7 | 7 | 8 | 7 | 6 | 6 | 7 | ProcessTimeline strong; watch step density. |
| Services (list) | 7 | 8 | 6 | 7 | 5 | 6 | 7 | 6-up card grid risks "identical card" monotony. |
| Services `[slug]` | 6 | 7 | 7 | 6 | 6 | 6 | 7 | Long; needs sectioning + whitespace. |
| Industries (list + slug) | 7 | 7 | 6 | 7 | 6 | 6 | 7 | Filter is nice; card grid uniformity. |
| Locations (+3) | 6 | 7 | 7 | 7 | 6 | 6 | 7 | NAP-heavy; keep calm. |
| Ecosystem | 6 | 7 | 6 | 6 | 5 | 6 | 6 | Logo/partner density; grayscale discipline. |
| Insights (list) | 7 | 7 | 6 | 7 | 6 | 7 | 7 | Card grid; good covers. |
| Insights `[slug]` (article) | 6 | 7 | 8 | 6 | 7 | 7 | 6 | **A11y: muted contrast + unnamed share links.** Body could be larger (Newsroom-style). |
| Insights category | 7 | 7 | 6 | 7 | 6 | 7 | 7 | — |
| Reports (list + slug) | 7 | 7 | 7 | 7 | 6 | 6 | 7 | Report cover images still missing (content gap, tracked in BLOCKERS). |
| Contact | 7 | 7 | 8 | 7 | 7 | — | 8 | Form solid; don't touch logic. |
| Privacy / Terms | 6 | 7 | 8 | 8 | 7 | — | 6 | Prose; widen measure, more air. |

**Averages (rough):** Whitespace ~6.6 · Type ~7.3 · Grid ~6.9 · Color restraint ~6.6 · Density ~6.1 · Imagery ~6.4 · CTA ~6.9. **Target every dimension ≥ 8 post-restyle.**

## Five highest-impact fixes
1. **Cream re-palette at the token layer** — calm light canvas; Forest Green structural; **Ember Red only on the single primary CTA per screen** (audit for red overuse). Fixes "color restraint".
2. **Whitespace / rhythm bump** — increase default section spacing, dramatically more air around heroes and between dense sections; introduce breathing sections on Home. Fixes lowest-scoring dimension.
3. **Fix article A11y** — AA-verified muted text on cream; name all share/icon links. Moves a11y 92 → ≥95.
4. **Break card-grid monotony** — vary rhythm (featured row + supporting grid), hairline-only cards, hover lift; kill the "identical card grid / AI-landing" look. Fixes density.
5. **Hero discipline** — one message, one Ember CTA + one quiet secondary; reduce stacked background effects (aurora+motif+grain) to one restrained moment. Fixes hero clarity across pages.

## Recurring risks to watch
- Stacked background effects (aurora + network motif + grain) reading as noise on a light canvas — retune opacity, pick one per hero.
- 6-up service / industry grids feeling templated — introduce deliberate asymmetry.
- Ember Red creeping onto multiple elements per screen — enforce "one primary action" rule in review.
