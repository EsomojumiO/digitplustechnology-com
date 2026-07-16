# 14 — Apple-Light Overhaul: Design Spec

**Gate document.** Nothing in Phase 2+ starts until the client approves this.
Branch: `redesign/apple-light` (cut from `redesign/dark-raycast`, PR #1 preserved on origin).
Scope: **visual only.** Copy, IA, URLs, JSON-LD, forms, integrations, logo & brand identity: zero changes.

---

## 0. How Apple's values in this spec were obtained

Not from memory or vibes. `apple.com/mac` was fetched and its **12 production stylesheets (805 KB of CSS)**
downloaded and mined directly. Every "Apple uses X" claim below is a measured frequency count from that CSS.
Every contrast ratio is **computed** (WCAG 2.1 relative-luminance formula), not eyeballed — the calculator
becomes the seed of `scripts/style-conformance.ts` in Phase 5.

Measured from Apple's CSS:

| Property | Measured reality |
|---|---|
| Canvas / alt band | `#ffffff` / `#f5f5f7` (7 hits) — brief confirmed ✅ |
| Ink | `#1d1d1f` (7 hits) — brief confirmed ✅ |
| Muted ink | **`#6e6e73`** (10 hits) and `#86868b` (8 hits) — *not* `#424245` (1 hit) |
| Hairline | `#d2d2d7` (6 hits) — brief confirmed ✅ |
| Link | `#0071e3` blue (24 hits) |
| **Orange-as-ink** | **`#bf4800`** — Apple's own orange is a *deepened* one for text |
| Button radius | **`980px`** pill (`--sk-button-border-radius`) |
| Card radius | **`28px`** / `44px` (`--corner-radius`) |
| Type ladder | 12 · 14 · **17** · 19 · 21 · 24 · 28 · 32 · 40 · 48 · **64** · **80** px |
| Tracking | `-.022em` / `-.016em` / `-.01em` — **size-dependent, tighter as it grows** |
| Alignment | `center` (39) > `start`/`left` (21) — **centered heads confirmed** ✅ |
| Easing | **`cubic-bezier(.4,0,.6,1)`** (119 hits, dominant); `cubic-bezier(.25,.1,.3,1)` (13) |
| Durations | `.24s` · `.3s` · `.32s` · `.4s` · `.5s` |
| Section padding | 76 · 80 · 96 · 112 · **120** · **144** px |

---

## 1. ⚠️ Two findings that change the brief

### 1.1 The brief's orange **fails its own contrast requirement**

The brief says: *"use a deepened `#e0561f`-family fill with white label (verify ≥4.5:1)"*. Verified — it does not:

| Candidate | White label ratio | Verdict |
|---|:-:|:-:|
| `#ff8a3d` (current dark-theme orange) | **2.35:1** | FAIL (brief already knew) |
| **`#e0561f` (brief's proposal)** | **3.80:1** | ❌ **FAILS AA** — large text only |
| `#ad4527` (**brand Ember-600**) | **5.74:1** | ✅ AA |
| `#8c3820` (**brand Ember-700**) | **7.77:1** | ✅ AAA |

Also flagged: Apple's `#86868b` computes to **3.62:1** — Apple ships it, but it fails AA. Our bar is
"every pair ≥4.5:1", so **`#86868b` is banned**; `#6e6e73` (5.07:1) is the Apple-authentic value that passes.

### 1.2 The brand kit already contains the right light-canvas values — we shouldn't invent a third palette

The brief proposes green `#0d7a43` and orange `#e0561f`. But `globals.css` §1 already ships the **official
Pishon brand ramps** (Forest Green `#20493b`, Ember Red `#c75334`), and their darker steps are *already*
AA-safe on white — and stronger than the brief's invented values:

| Role | Brief's invented value | **Brand-kit value (recommended)** | Ratio on white |
|---|---|---|:-:|
| Green ink | `#0d7a43` → 5.41:1 | **Forest-600 `#20493b`** | **10.11:1** AAA |
| Orange fill | `#e0561f` → 3.80:1 ❌ | **Ember-600 `#ad4527`** | **5.74:1** AA |
| Orange ink (chevron links) | — | **Ember-700 `#8c3820`** | **7.77:1** AAA |

The constraint says *"DigitPlus logo + brand identity untouched."* Inventing `#0d7a43`/`#e0561f` would be a
third green and a third orange, matching neither the brand kit nor the dark theme. **Recommendation: use the
official brand ramp.** It passes harder, it's already in the codebase, and it keeps the constraint literally true.
(Note: `#ff8a3d`/`#3ddc84` in §2 today are *dark-theme-only inventions*, not brand colors — they retire here.)

> **DECISION NEEDED (client):** approve the brand-kit palette (recommended) or insist on `#0d7a43`/`#e0561f`.
> If the latter: `#e0561f` cannot carry a white label at AA — the orange button would have to grow to
> large-text-only sizing or drop to `#ad4527` anyway.

### 1.3 Prior art: there is an abandoned branch doing exactly this

`redesign/apple-minimal` (sibling of `dark-raycast`, same merge-base) already attempted a light flip —
a **cream** canvas, and independently reached the same conclusion: use brand Forest `#20493b` + Ember `#ad4527`,
ban Ember-as-ink. It also contains `src/components/motion/AnimatedRule.tsx` (a Connective Line implementation)
worth harvesting rather than rewriting. Its canvas (cream `#f7f1e0`) is superseded by this brief's pure white.

---

## 2. Token layer — the flip (`globals.css` §2)

§1 primitive ramps stay **untouched** (brand kit). Only §2 semantic tokens change. §3 `@theme` wiring is unchanged
in shape, so **every component reading semantic tokens flips for free**.

| Token | Today (dark) | **New (Apple-light)** | Role |
|---|---|---|---|
| `--background` | `#060707` | **`#ffffff`** | Primary canvas |
| `--surface` | `#0b0d0c` | **`#f5f5f7`** | Alternating band (Apple's exact off-white) |
| `--surface-raised` | `rgb(255 255 255 /.03)` | **`#ffffff`** on gray / **`#f5f5f7`** on white | Cards — value, not alpha |
| `--border-hairline` | `rgb(255 255 255 /.08)` | **`#d2d2d7`** | Hairline |
| `--border-hairline-hover` | `rgb(255 255 255 /.14)` | **`#86868b`** | Non-text — 3.62:1 is fine for borders |
| `--text` | `#fafafa` | **`#1d1d1f`** | Body / high-emphasis — 16.83:1 |
| `--text-heading` | `#fafafa` | **`#1d1d1f`** | Headlines — 16.83:1 |
| `--text-muted` | `rgb(255 255 255 /.6)` | **`#6e6e73`** | Secondary — 5.07:1 ✅ |
| `--text-faint` | `rgb(255 255 255 /.5)` | **`#6e6e73`** | ⚠️ collapses into muted — `#86868b` banned (3.62:1) |
| `--accent` | `#ff8a3d` | **`#ad4527`** (Ember-600) | Single primary CTA fill per viewport |
| `--accent-hover` | `#ffa15c` | **`#8c3820`** (Ember-700) | Darken on hover (light-canvas idiom) |
| `--accent-foreground` | `#060707` | **`#ffffff`** | Label on orange — 5.74:1 ✅ |
| `--accent-green` | `#3ddc84` | **`#20493b`** (Forest-600) | Structural accent — 10.11:1 |
| `--accent-text` | `var(--accent-green)` | `var(--accent-green)` | Accent-as-ink stays green |
| `--accent-subtle` | `rgb(255 138 61 /.12)` | **`rgb(173 69 39 /.08)`** | Faint orange tint |
| `--brand` | `#0a100d` | **`#f5f5f7`** | ⚠️ **Footer is no longer dark** (brief: footer may be `#f5f5f7`) |
| `--brand-foreground` | `#fafafa` | **`#1d1d1f`** | Text on brand band |
| `--shadow-sm/md/lg` | near-black glows | **soft neutral**, `md` on hover only | See §5 |
| `color-scheme` | `dark` | **`light`** | + `<meta theme-color>` → `#ffffff` |

**Hard rules (enforced by Phase 5 script):**
- **Orange is a fill, not an ink** — except as a chevron text-link, where it must be Ember-700 `#8c3820`.
- **≤1 orange fill per viewport.** Green carries links/eyebrows/active/icons/Connective Line.
- **No third hue.** Neutrals do everything else.
- **Depth from value + whitespace**, never alpha-on-dark, never glow.

### Full verified contrast table (computed)

| Pair | Ratio | Verdict |
|---|:-:|:-:|
| Ink `#1d1d1f` on white | 16.83:1 | AAA |
| Ink `#1d1d1f` on `#f5f5f7` | 15.46:1 | AAA |
| Muted `#6e6e73` on white | 5.07:1 | AA |
| Muted `#6e6e73` on `#f5f5f7` | 4.66:1 | AA |
| Forest `#20493b` on white | 10.11:1 | AAA |
| Forest `#20493b` on `#f5f5f7` | 9.28:1 | AAA |
| White label on Ember-600 `#ad4527` | 5.74:1 | AA |
| Ember-700 `#8c3820` ink on white | 7.77:1 | AAA |
| ~~`#86868b` on white~~ | 3.62:1 | ❌ BANNED for text |
| ~~`#e0561f` + white label~~ | 3.80:1 | ❌ BANNED |

---

## 3. Typography

Fonts today: Sora (display) + Figtree (body) + JetBrains Mono (eyebrows). The mono uppercase eyebrow is a
dark-theme artifact — **retired**; eyebrows become small semibold **green** (`#20493b`) sentence-case text.

Per brief, `/font-preview` (noindex) presents three candidates on white — **client picks before rollout (Phase 2 STOP)**:

- **A: Inter Display** (headlines, tight tracking) + **Inter** (body) — closest SF-like system
- **B: Instrument Sans** (display + body, two weights apart)
- **C: Schibsted Grotesk** (display) + **Inter** (body)

Scale (locked to Apple's measured ladder, fluid via `clamp()`):

| Role | Size | Weight | Tracking | Colour |
|---|---|---|---|---|
| Hero H1 | `clamp(48px, 6vw, 80px)` | 600–700 | **`-.022em`** | `#1d1d1f` |
| Section H2 | `clamp(32px, 4vw, 48px)` | 600 | **`-.016em`** | `#1d1d1f` |
| H3 | 24–28px | 600 | `-.01em` | `#1d1d1f` |
| **Body** | **17px / 1.6** | 400 | `-.01em` | `#1d1d1f` |
| Secondary | 17px / 1.6 | 400 | `-.01em` | `#6e6e73` |
| Eyebrow | 14px | 600 | `0` | `#20493b` |

Tracking is **size-dependent** (Apple's real pattern: tighter as it grows), not one global `-0.015em`.
Body measure 65ch. Discipline: ≤4 visible type sizes per page.

---

## 4. Layout & rhythm

- **Section heads centered** (measured: Apple centers 39:21); **body copy stays left**.
- Section padding: **120–144px desktop / 64–80px mobile** (Apple's measured 76→144 range).
- Section rhythm: white → `#f5f5f7` → white alternation. **Separation is whitespace + background alternation only** — no rules, no glows.
- Cards: white on gray / `#f5f5f7` on white, radius **`28px`** (Apple's `--corner-radius`), `shadow-md` **on hover only**.
- Buttons: radius **`980px`** pill (Apple's real value).
- ≥1 **full-bleed image moment** per major page.
- Nav: `rgba(255,255,255,0.72)` + blur + `#d2d2d7` bottom hairline, dark text, 48px compact. Contact dropdown survives.
- Footer: **`#f5f5f7`, not black.**
- Images: `.cover-dark` scrims + desaturation **deleted** — photos render bright, full-colour, large.

### The 3-button system (re-skinned, structure unchanged)

| Variant | Skin |
|---|---|
| **primary** | Ember-600 `#ad4527` fill, white label, 980px pill. **One per viewport.** |
| **secondary** | `#1d1d1f` label, `#d2d2d7` hairline pill, transparent fill |
| **ghost** | Forest `#20493b` link + chevron (`Get a quote ›`), underline on hover only |

---

## 5. Elevation

Dark's near-black glows retire. Apple's light elevation is soft and neutral:

```
--shadow-sm: 0 1px 2px  rgb(0 0 0 / 0.04);
--shadow-md: 0 4px 16px rgb(0 0 0 / 0.08);   /* hover only */
--shadow-lg: 0 12px 32px rgb(0 0 0 / 0.10);  /* sparing */
```

---

## 6. Motion

Keep framer-motion. Adopt Apple's **measured** easing `cubic-bezier(.4,0,.6,1)` (dominant) and durations
`.24s`/`.3s`/`.4s`/`.5s`. Character: **things settle, never bounce.**

- Entrances: opacity + 8–12px rise, 0.5–0.6s.
- Carousel Ken Burns: soften to **scale 1.03**.
- **(1) Scroll-scrub reveals** on full-bleed bands: `useScroll` + `useTransform`, scale 1.05→1.0 + slight brighten.
- **(2) Sticky-section storytelling** on **one page only** (home "3 movements"): 2–3 steps, visual pinned, compositor-only.
- Connective Line: ⚠️ **currently dead code, renders nowhere** (§8.4). If the client wants it, it is a *new
  feature* — a thin **green** (`#20493b`) rule drawing in on section entry. See §9.5.
- All respect `prefers-reduced-motion`; nothing >0.8s; transform/opacity only. Perf ≥90, CLS <0.1.

---

## 7. Design-plugin evaluation (default = NO)

| Candidate | Verdict | Justification |
|---|:-:|---|
| `tailwindcss-animate` | ❌ **Reject** | Redundant — framer-motion already owns motion; adds a second, conflicting idiom. |
| `lenis` (smooth scroll) | ❌ **Reject** | Hijacks native scroll → INP + a11y risk; Apple's feel comes from easing/reveals, not scroll interception. Fails "removes more code than it adds". |
| `next-view-transitions` | ⚠️ **Defer to Phase 4** | Next **16.2.6** has native View Transitions support; a wrapper lib is likely redundant. Re-evaluate natively; adopt only if free. |
| Any UI kit / theme | ❌ **Reject** | Design system is bespoke to DigitPlus. |

**Net new dependencies: zero.**

---

## 8. Codebase inventory — what must change

### 8.1 The split: 60 of 82 flip for free

| Bucket | Count |
|---|:-:|
| UI-bearing `.tsx` under `src/components` + `src/app` | **82** |
| **Flip for free** (read only semantic tokens) | **60** |
| **Need hand edits** | **22** + `globals.css` |

The semantic-token discipline held. Notably the **shadow ramp is 100% token-mediated** across all 13 consumers
(`Card`, `Button`, `Header`, `CookieConsent`, `ArticleCard`, `ReportCard`, `ContentShelf`, `IndustryCard`,
`ServiceCard`, `Footer`, `WhatsAppWidget`, `forms/controls.ts`, `page.tsx`) — so retuning `globals.css:91–93`
fixes every one. Same for `bg-surface` / `bg-brand` / `border-hairline` / `text-muted`.
**Zero `dark:` Tailwind variants exist** — the site is single-theme, so there is nothing to unwind.

### 8.2 The real work is image treatment, not colour

`.cover-dark` + `brightness`/`saturate`/`invert()` filters span **10 files** and all encode
"seat a light photo into near-black". That inverts wholesale on white:

| File:line | Treatment |
|---|---|
| `globals.css:614–630` | `.cover-dark` — `brightness(0.92)` + `rgb(6 7 7 /.65)` scrim |
| `insights/page.tsx:101`, `insights/[slug]/page.tsx:214` | `.cover-dark` |
| `reports/_components/ReportCard.tsx:41`, `reports/[slug]/page.tsx:133` | `.cover-dark` |
| `ui/FeatureImage.tsx:52` | `saturate-[0.85] brightness-[0.9]` + `from-background/70` scrim |
| `home/HeroCarousel.tsx:130` | `saturate-[0.85] brightness-[0.9]` |
| `home/ContentShelf.tsx:44`, `insights/_components/ArticleCard.tsx:48` | `brightness-[0.92]` |
| **`ui/TrustStrip.tsx:66`** | **`[filter:brightness(0)_invert(1)]`** |
| **`home/TrustMarquee.tsx:43`** | **`[filter:brightness(0)_invert(1)]`** |

> 🔴 **Critical:** the two trust strips force all **17 partner logos to pure white**. On a white canvas they
> render **invisible**. This is the single hardest breakage in the flip and needs a real decision (§9.6).

### 8.3 Dark-only decorative primitives → delete

| Primitive | Defined | Usage | Action |
|---|---|---|---|
| `.grain-overlay` | `globals.css:364` | `layout.tsx:107` — **site-wide** | **Delete** (brief bans grain) |
| `.aurora` | `globals.css:376–420` | `page.tsx:70,350`; `Hero.tsx:47` (+prop :18,34) | **Delete** + remove `aurora` prop |
| `CircuitTraces` | `motion/CircuitTraces.tsx` | `page.tsx:79`; `HeroMotif.tsx:15` | **Delete** (brief bans traces) |
| `HeroMotif` | `motion/HeroMotif.tsx` | `Hero.tsx:5,48` (+`motif` prop) | **Delete** — wraps CircuitTraces |
| `.circuit-pulse` | `globals.css:422–436` | via `CircuitTraces.tsx:47` | **Delete** |
| `Glow` / `.glow` | `motion/Glow.tsx`; `globals.css:590–609` | **DEAD — zero call sites** | **Delete** (free) |
| `AnimatedRule` / `.reveal-rule` | `motion/AnimatedRule.tsx`; `globals.css:544–569` | **DEAD — zero call sites** | **See §9.5** |
| `.hero-progress-fill` | `globals.css:635–653` | `HeroCarousel` | **Retune** (orange→green) |

### 8.4 ⚠️ The "Connective Line" does not currently render anywhere

The brief says the Connective Line *"survives — now a thin green rule drawing in on section entry."*
But `AnimatedRule.tsx` is **dead code**: the only references in `src/` are its own definition and the
re-export at `motion/index.ts:2`. **Zero call sites.** It is not on the live site today — so "survives" is
inaccurate; it would be a **new feature**, not a port. Decision needed (§9.5). `Glow.tsx` is likewise dead
and can be deleted for free.

### 8.5 Hardcoded dark colours — only 7 files

- `page.tsx:179,367` (`text-neutral-50`, `hover:bg-white/10`), `about/page.tsx:182`, `approach/page.tsx:51`
- `Footer.tsx:43,138,184` (`border-white/10`), `:163` (`border-white/15 bg-white/10`) + 11 `text-[var(--cream)]` sites
- `Button.tsx:20` (`inset…rgb(255_255_255/0.25)` inner glow), `:24` (`hover:border-white/28`)
- `FeatureImage.tsx:60` (`rgb(255_255_255/0.02)`), `:69` (`text-white/50`)
- `opengraph-image.tsx:20–23` — dark OG palette `#060707`/`#fafafa`/`#ff8a3d`
- `layout.tsx:43` `themeColor:"#060707"`, `:44` `colorScheme:"dark"`; `globals.css:95` `color-scheme: dark`

**Verified benign, leave alone:** `WhatsAppWidget.tsx:18` (`bg-[#25D366] text-white` — brand-correct on any
canvas); `lib/seo/schema.ts:31` (logo URL, canvas-independent).

### 8.6 Logo — cheap fix, prop already exists

No component references `logo-full.png`/`logo-full-white.png`. The coupling is `layout/Logo.tsx:20–23`:
`const inverse = true` is **hardcoded**, comment *"Dark-only theme: every surface is dark… (the `tone` prop is
kept for API stability)"*. It forces `/brand/digitplus-icon-white.png` (:35) + `text-[var(--cream)]` (:50).
**The `tone` prop already exists and is `void`-ed at :22 — restoring it is a few lines, not an API change.**

### 8.7 Section alternation — a trap

`ui/Section.tsx:18–23` is the single switch (`default` `bg-background` / `muted` `bg-surface` /
`raised` `bg-surface-raised` / `inverse` `bg-brand`); `ui/CTABand.tsx:14–16` mirrors it.
⚠️ On white, `default` and `muted` **collapse into each other** unless `--surface` carries real separation —
hence `#ffffff` vs `#f5f5f7` in §2. `bg-brand` is the only genuinely dark band
(`page.tsx:349`, `Footer.tsx:35`, `AuthorBio.tsx:25`, `Section` `inverse`, `CTABand` `inverse`) — all go light.

### 8.8 Mono uppercase eyebrows — 11 sites to retire

`Eyebrow.tsx:31` (canonical), `Stat.tsx:28`, `FeatureImage.tsx:61,69`, `HeroCarousel.tsx:150`,
`WhyPillar.tsx:22`, `ContentShelf.tsx:55`, `IndustriesFilter.tsx:71`, `services/[slug]/page.tsx:253`,
`AuthorBio.tsx:31`, `Header.tsx:419`. Not eyebrows, keep mono: `Prose.tsx:41` (`code`), `Stat.tsx:25` (numerals).

### 8.9 Motion values to soften

`HeroCarousel.tsx:133` Ken Burns `scale(1.06)` → **1.03**. Aurora drift (`globals.css:412,415`) dies with `.aurora`.
Hover zooms already Apple-calm: `ContentShelf` 1.04, `ArticleCard` 1.03, `insights/page` 1.02, `Logo` 1.04,
`WhatsAppWidget` 1.03, `Button` `active:scale-[0.98]` — **keep as-is**.

### 8.10 No `/font-preview` route exists — Phase 2 builds it from scratch.

---

## 9. Open questions for the client (the Phase 1 STOP)

**Blocking (Phase 3 cannot start without these):**

1. **Palette (§1.2) — the one real decision.** Approve the **brand-kit ramp** (Forest `#20493b` + Ember `#ad4527`,
   recommended, AA-verified, brand-true), or insist on the brief's `#0d7a43`/`#e0561f` (the orange fails AA at 3.80:1)?
2. **Partner logos (§8.2) — the hardest breakage.** Both trust strips force all 17 logos to pure white via
   `[filter:brightness(0)_invert(1)]`; on white they vanish. Options:
   **(a)** drop the filter and use each partner's real full-colour logo — best-looking and most Apple-like, but
   needs the real assets and they'll be visually inconsistent; **(b)** invert to a single dark ink
   (`brightness(0)` alone → all-black logos) — consistent, safe, ships today, slightly flat;
   **(c)** source proper monochrome-dark variants per partner (human task → PLACEHOLDERS.md).
   **Recommendation: (b) now, (a) later** as an asset-collection task.

**Non-blocking (I'll take the recommendation unless you say otherwise):**

3. **Footer goes light** (`#f5f5f7`). Brief permits it; it's the single biggest visual departure. Confirm.
4. **`--text-faint` collapses into `--text-muted`** — the only AA-safe option, since `#86868b` fails at 3.62:1.
   Accepted, or should faint survive as large/decorative-only?
5. **Connective Line (§8.4)** — it's dead code and renders nowhere today, so "survives" would actually mean
   *build it new*. Wire it up as a green section-entry rule, or delete it with `Glow` and drop the idea?
6. **Sticky-storytelling page**: home "3 movements" (assumed) or the flagship service page?
7. **OG image** (`opengraph-image.tsx:20–23`) is dark-palette. It's visual, so I'd reskin it to match. Confirm.
8. **Logo**: `Logo.tsx` un-hardcodes `inverse`, standard mark returns everywhere (§8.6). Confirm.
