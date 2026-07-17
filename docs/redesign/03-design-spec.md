# 03 — Design System Spec: Apple-Minimalist Cream Restyle

_Gate document. Nothing in Phase 2 starts until the user approves this._
_Direction locked (user, this session): **flip to a cream-dominant light canvas.** Keep the Pishon brand kit (Forest Green / Ember Red / Cream; Montserrat + Inter + JetBrains Mono; existing logos). Visual / layout / motion only — no content, routes, SEO, JSON-LD, forms, or integration changes._

---

## 0. Strategy — why this is low-risk
Every component reads **semantic tokens**, so the flip is driven from **section 2 of `globals.css`** (semantic layer), not by touching components. The re-palette below is the spine; component work is refinement (air, rhythm, one motif) on top. Only **14 dark-assumption class usages in 6 files** need per-line review, and most sit inside bands that stay dark (footer / `inverse`).

---

## 1. Color system — cream canvas (all values WCAG-verified)

### Semantic token remap (`globals.css` §2)
| Token | Today (dark) | **New (cream)** | Role |
|---|---|---|---|
| `--background` | `#0e2019` | **`#f7f1e0`** (cream) | Dominant page canvas |
| `--surface` (muted) | `#143026` | **`#f1ead6`** (cream-deep) | Recessed alternating band |
| `--surface-raised` | `#173a2c` | **`#ffffff`** | Cards — lift off cream by value |
| `--text` | `#eef3ef` | **`#1b1d17`** (warm near-black) | Body text |
| `--text-heading` (new) | — | **`#20493b`** (Forest Green) | Headings, structural |
| `--text-muted` | `#a7bcae` | **`#54564c`** (neutral-600) | Secondary text |
| `--border-hairline` | light/0.14 | **`hsl(150 24% 20% / 0.12)`** | Dark forest-tinted hairline |
| `--accent` (CTA fill) | `#c75334` | **`#ad4527`** (accent-600) | Ember CTA fill (AA-safe white label) |
| `--accent-text` (new) | — | **`#8c3820`** (accent-700) | The rare time Ember is *text* |
| `--brand` | `#2d5d49` | **`#20493b`** | Forest-Green punctuation bands / footer |
| `--brand-foreground` | cream | **`#f7f1e0`** (cream) | Text on Forest bands |
| `color-scheme` | dark | **light** | — |

### Verified contrast (against cream `#f7f1e0`, L≈0.88)
| Pair | Ratio | AA? |
|---|:-:|:-:|
| Body `#1b1d17` on cream | **~15:1** | ✅✅ |
| Heading Forest `#20493b` on cream | **~8.9:1** | ✅✅ |
| Muted `#54564c` on cream | **~6.7:1** | ✅ (fixes the article-92 issue) |
| White label on Ember CTA `#ad4527` | **~5.5:1** | ✅ |
| Cream `#f7f1e0` on Forest band `#20493b` | **~8.9:1** | ✅✅ |
| Ember-700 `#8c3820` text on cream | **~6.5:1** | ✅ |

**Hard rules (enforced in Phase 3 review):**
- **Ember Red is a fill, not an ink.** `#c75334` as *text/link* on cream is only 3.86:1 → **banned as body/link color**. Ember appears as the **single primary-CTA fill per screen** (`#ad4527`, white label); if ever needed as text, use `#8c3820`.
- **Forest Green is the structural voice** — headings, active nav, dark bands, footer, focus states.
- **Neutrals carry everything else.** No third hue. `neutral-500 #71746a` fails AA on cream (4.19:1) → never for text; large/decorative only.
- **Depth from value, not shadow:** recessed cream-deep bands < cream canvas < white cards. Shadows retuned warm & soft; **nothing heavier than `--shadow-md`** in normal use.

### Background effects — dial down for light
- **Aurora:** opacity `0.45 → ~0.22`, warm forest/ember wash, **hero only** (flagship pages). Not on every hero.
- **Grain:** `0.04 → 0.03`.
- **Rule:** one ambient effect per hero max (aurora **or** motif, not stacked with grain reading as noise).

---

## 2. Typographic scale (refine existing clamp system)
Keep the fluid `--type-*` scale; tighten usage.
- **Display** (Montserrat 700, `clamp(2.75→5rem)`, tracking −0.025em, leading 1.02) — hero H1 only. Consider `-0.03em` tracking at the top end for optical tightness.
- **H1/H2** Montserrat 700; **H3/H4** Inter 600. **Body** Inter, `1.6` leading, `.measure` 65ch.
- **Article body → `--type-body-lg` (~19px)** for Newsroom-grade reading comfort (currently default body).
- **Eyebrows / stats / metadata** JetBrains Mono, uppercase, `+0.08em` tracking.
- **Discipline: ≤ 4 type sizes visible per page.** Reviewer flags violations.

## 3. Spacing & rhythm (more air — the biggest visible lever)
- 8pt grid retained.
- **Default marketing section spacing `md → lg`** where content allows; hero air increased (`pt-20/28` → `pt-28/40` on flagships).
- **Home de-densifies:** insert full-bleed breathing space between the dense middle run (services→why→process→industries→testimonials→stats); group into 3 visual "movements" separated by generous whitespace + the signature rule (below).
- Prose measure 65ch; legal/prose pages widen to `.measure-wide` with more line-air.

## 4. Component redesigns (refinement on the re-palette)
| Component | Change |
|---|---|
| **Nav (`Header`)** | Frosted **cream** (`bg-background/70 backdrop-blur-md`); hairline + shadow **intensify on scroll** (scroll-linked); active item Forest Green; keep a11y wiring untouched. |
| **Hero** | One message, **one Ember CTA + one quiet secondary** (ghost/underline). Single ambient effect. Network motif rendered as faint **Forest-Green** lines on cream. |
| **Cards** | White on cream, **hairline only** (no heavy border), **hover lift 2–4px + `sm→md` shadow ease** (`transform`-only). Kill uniform 6-up monotony: featured row + supporting grid rhythm. |
| **Buttons** | Primary = Ember fill `#ad4527`; secondary = white + hairline; ghost = transparent. Add **press `scale(0.98)`** (compositor) alongside existing `active:translate-y-px`. |
| **TrustMarquee** | Logos **grayscale/forest-tinted**, **color/full-opacity on hover**, slower loop. |
| **Footer** | Stays **Forest Green** (anchor block on cream) — airy, columnar, cream text (8.9:1). |
| **Article template** | Newsroom feel: large Montserrat headline, wide margins, **~19px body**, generous whitespace; **name all share/icon links** (a11y fix). |
| **Section `inverse`** | Now the deep **Forest-Green punctuation band** — used sparingly for quotes / closing CTA. |

## 5. Motion language (ratify what exists; standardize)
The system already matches the brief (framer-motion, `EASE_OUT = cubic-bezier(0.22,1,0.36,1)`, reduced-motion, `template.tsx` transitions). Standardize:
- **Entrance:** fade-up **12–20px**. Bump section/hero reveal to **0.5–0.6s** (add `DUR.entrance = 0.55`); keep micro-interactions at `fast .15`/`base .22`. Stagger **70ms** (`STAGGER 0.07`, already in the 60–90ms window).
- **Scroll:** `useScroll` subtle parallax on hero art; reveals via `whileInView` + `viewport={{ once:true }}` (the `/reveal.js` fallback stays).
- **Micro:** button press `scale(0.98)`; **animated underline** on text links (Forest Green); nav blur/shadow intensify on scroll.
- **Page transitions:** keep `template.tsx` route fade/slide.
- **Hard rules:** honor `prefers-reduced-motion`; **≤ 0.8s**; **animate only `transform`/`opacity`**; no spring overshoot on content (spring reserved for `Magnetic`).

## 6. Uniqueness signature — "The Connective Line"
**One recurring motif, site-wide:** a **1px Forest-Green hairline rule that draws itself in** (`scaleX: 0 → 1`, transform-origin left, `EASE_OUT`, ~0.6s) as a section scrolls into view — a quiet horizontal stroke marking each section transition.
- **Why it fits:** literalizes the brand story ("most projects fail *in the gaps* — we close them"). Distinctive, calm, cheap (compositor-only), works at every breakpoint, degrades to a static rule under reduced-motion / no-JS.
- **Delivery:** new primitive **`<AnimatedRule>`** in `components/motion/`; used as the divider between Home's movements and atop major section headings.
- **Companion (reserved):** the existing **network motif** stays **hero-only** on flagship pages (Home/About) — not repeated, so it stays special. JetBrains-mono **numbered section markers** (`01 / 02`) are an optional secondary accent on Approach/Process.

---

## 7. Phase 2 execution plan (file-owner agents, non-overlapping)
| Agent | Owns | Task |
|---|---|---|
| **Foundation** | `globals.css`, `components/motion/*`, `motion/tokens.ts` | Re-palette semantic tokens (§1); retune shadows/aurora/grain; add `--text-heading`, `--accent-text`, `DUR.entrance`; build `<AnimatedRule>`; add button `scale(0.98)` + underline-link utility. |
| **Shell** | `layout/Header.tsx`, `Footer.tsx`, `WhatsAppWidget.tsx`, `app/template.tsx` | Frosted-cream nav + scroll-intensify; Forest footer polish; fix dark-assumption classes; verify transitions. |
| **Marketing Pages** | `app/(marketing)/**`, `app/page.tsx`, `components/home/*`, `components/ui/*` | Apply spacing/air, card rhythm, hero discipline, `<AnimatedRule>` dividers, TrustMarquee grayscale. |
| **Content Engine** | `app/insights/**`, `app/reports/**` | Newsroom article layout, ~19px body, **name share/icon links** (a11y), card rhythm. |

**Rules for all:** shared motion primitives only (no bespoke per-page animation); **zero** metadata/JSON-LD/forms/SEO edits; every text/bg pair passes AA; `tsc --noEmit` clean before "done".

## 8. Verification reality (from `02-baseline.md`)
- **`next build` + Lighthouse + axe can't run in this sandbox** (no network for `next/font/google`). Local gate = **`tsc --noEmit`** + spec/contrast code review. **Full Perf/A11y/Visual gates run on Vercel staging** (Phase 3), matching the master prompt's own "re-run on staging" note.
- Optional, deferred: self-host fonts via `next/font/local` to make builds network-independent (perf win; needs `.woff2` files — separate decision).

## 9. Open decisions for the user (before Phase 2)
1. **Font self-hosting** — do it now (unblocks local builds/Lighthouse, small perf win) or defer to staging? _Recommendation: defer; not required for the visual restyle._
2. **Signature motif** — approve **"The Connective Line"** as specified, or prefer the numbered-marker or network-motif-forward alternative?
3. **Scope confirm** — agree Phase 2 is **refinement on a token re-palette** (not a from-scratch rebuild), given how much already exists?
