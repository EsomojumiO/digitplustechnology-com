# Design Audit — Apple Human Interface Guidelines

Date: 2026-09-07 · Scope: whole site, light theme (the only theme) · Verdict: **Good, with four critical defects**

## Method

Graded against the Human Interface Guidelines directly, not against the internal
rubric. Two kinds of evidence, no impressions:

1. **Static read** of `src/**`, `globals.css`, and the gate scripts.
2. **Rendered measurement** — production build, `next start -p 4310`, Playwright
   Chromium. 107 frames across 19 routes at 390 / 768 / 1440, plus open states
   (mobile menu, nav dropdown, cookie banner, form error, focus), an iPhone 13
   touch profile, 200% page zoom, 200% user text size, and `prefers-contrast: more`.

Every finding below carries either a `file:line` or a measured number. Where the
two disagree, the measurement wins.

**Deliberately excluded.** The `docs/BLOCKERS.md` asset items are already tracked
and are not design defects: interim Unsplash imagery (#8, #11), single-ink partner
logos pending reseller authorisation (#2, #9), placeholder testimonials (#3),
draft legal copy (#7), stubbed integrations (#12–#18).

## Summary

The token system is the best part of this codebase and it is not close. One CSS
file, one ladder, computed contrast ratios recorded in `docs/DECISIONS.md` rather
than eyeballed, and five gates that run against real Chromium. Adoption is close
to total: Tailwind's default type scale appears twice in the entire tree.

The defects cluster in one place: **the things no gate was written to look at.**
The gates run at 1440px only, on 15 routes that exclude every `[slug]` template,
with nothing open and nothing scaled. Four of the six worst findings below are
invisible to all five gates by construction, and three of them are WCAG failures.

`docs/redesign/15-rubric.md` scores every route 8–9/10. That score was taken at
desktop width in the default state. It does not survive contact with a phone, a
reader who has enlarged their text, or a published article containing a table.

---

## Critical

### C1 — At 200% text size the page scrolls sideways, and the CTA label stops scaling

**Measured.** `/contact` at a 390px viewport with the user's root font size set to
32px (200% of the 16px default):

| | 16px root | 32px root |
|---|---|---|
| `h1` | 38.1px | 72px |
| body copy | 13px | 26px |
| footer link | 13px | 26px |
| eyebrow | 11px | 22px |
| **button label** | **15px** | **15px** |
| document scrollWidth | 390 | **616** |

Two separate failures in one measurement.

**The layout breaks.** `documentElement.scrollWidth` is 616 against a
`clientWidth` of 390 — 226px of horizontal scroll. The causal chain is exact:

- `src/components/ui/Button.tsx:8` puts `whitespace-nowrap` in the shared base.
- At 32px root, the submit label "Send your brief" cannot wrap, so its min-content
  width is **576px**.
- The form sits in a grid item with the default `min-width: auto`, so it cannot
  shrink below that min-content floor.
- The measured `grid-template-columns` on `src/app/(marketing)/contact/page.tsx`'s
  `grid gap-12 lg:grid-cols-[1.4fr_1fr]` resolves to **`576.062px` inside a 310px
  container**.

The same mechanism is loaded on "Chat on WhatsApp" (446px), "Call us" (446px) and
"Start a conversation" (325px).

**The call to action becomes the smallest text on the page.** `Button.tsx:32`
sizes the default button `text-[15px]`. A hard pixel value does not respond to the
user's font-size setting, so at 200% the visitor reads 26px body copy next to a
15px CTA.

> **HIG — Accessibility > Vision:** "Ideally, give people the option to enlarge
> text by at least 200 percent."
> **HIG — Typography > Supporting scalable text:** "Make sure your app's layout
> adapts to all font sizes… Prioritize important content when responding to
> text-size changes."

Also WCAG 1.4.4 Resize Text (AA) and 1.4.10 Reflow (AA).

**Fix.** Drop `whitespace-nowrap` from the `Button.tsx:8` base, or scope it to
`sm:` and up. Add `min-w-0` to the grid children in the two-column page layouts.
Replace `text-[15px]` with a real `--text-*` step.

---

### C2 — The hero carousel auto-advances on touch with no way to stop it

**Measured.** iPhone 13 device profile, no interaction of any kind: slide 1
("Managed IT") at t=0, slide 2 ("Deployment & Implementation") at t≈5.6s, slide 3
("IT Procurement") at t≈11.2s. Seven slides on a 5-second dwell — a 35-second
cycle the visitor cannot stop.

`src/components/home/HeroCarousel.tsx:114,145` —
`Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })`.

The pause paths that exist are real and were clearly thought about: hover
(`stopOnMouseEnter`), focus (`:188-192`), and `useReducedMotion` disabling
autoplay outright (`:140`). All three are mouse-and-keyboard paths. **On touch
there is no hover, and no focus without committing to a tap.** The phone visitor
gets the one path with no exit.

> **HIG — Accessibility > Cognitive:** "Minimize use of time-boxed interface
> elements… Avoid autoplaying audio and video content without also providing
> controls to start and stop it."

Also WCAG 2.2.2 Pause, Stop, Hide (Level **A** — the only Level A failure in this
report). No gate detects this and axe cannot.

**Fix.** Add a pause/play toggle to the existing indicator row. That also fixes C3
below, since the row needs rebuilding anyway.

---

### C3 — Form controls have their focus outline switched off

**Measured** on `/contact` at 1440, computed styles while focused:

| control | outline | ring |
|---|---|---|
| text input | `2px **none** rgb(45,93,73)` | `rgb(173 69 39 / 0.3)` at 2px |
| textarea | `2px **none** rgb(45,93,73)` | `rgb(173 69 39 / 0.3)` at 2px |
| submit button | `2px **solid** rgb(45,93,73)` | none |
| header link | `2px **solid** rgb(45,93,73)` | none |

`src/components/forms/controls.ts:11` opens with `focus:outline-none`. Because
`:focus-visible` is a subset of `:focus`, that kills the global green ring defined
at `globals.css:336-340` for every input and textarea on the site. What replaces
it is a 2px ring at 30% alpha, which composites over white to roughly **1.35:1**.
The `focus-visible:border-accent` does carry the full `#ad4527` at 5.74:1, but it
is a 1px border colour change, and the thing that reads as the focus indicator is
the ring.

Net effect: form fields are the only controls on the site with a different, and
much weaker, focus treatment. Keyboard users lose the indicator exactly where
losing it costs most.

> **HIG — Accessibility > Speech:** "Let people use the keyboard alone to navigate
> and interact with your app."

Also WCAG 2.4.11 Focus Appearance and 1.4.11 Non-text Contrast (3:1).

**Fix.** Delete `focus:outline-none` from `controls.ts:11` and let the global
`:focus-visible` outline apply, exactly as buttons and links already do.

---

### C4 — Markdown tables render with no cell padding and no rules

**Measured** on `/insights/what-an-it-sla-should-cover`:

```
th padding: 0px      th border-bottom: 0px solid
td padding: 0px      td border-bottom: 0px solid
table border: 0px solid       parent overflow-x: visible
```

`src/lib/content/mdx.tsx:39` enables `remarkGfm`, so markdown tables become real
`<table>` elements. `src/components/ui/Prose.tsx:22-53` styles `h2 h3 h4 p strong
a ul ol li blockquote code pre img hr figcaption` and gives `<pre>` an
`overflow-x-auto` wrapper. It styles no table element at all.

The result is not subtle. At **1440px** adjacent cells collide with no gutter, and
the rendered text reads:

> `Medium` `Single-user issue, workaround exists` `2 hours` → **"MediumSingle-user issue, workaround exists2 hours"**

At **390px** the table is 350px wide, four columns, zero padding, no header rule
and no row rules. Rows that wrap to three lines run into the next row with nothing
separating them.

Five published articles contain tables:
`what-an-it-sla-should-cover`, `complete-guide-to-it-procurement-in-nigeria`,
`how-to-write-a-managed-services-scope-of-work-that-prevents-scope-creep`,
`it-asset-procurement-hospitals-nigeria`, `school-computer-lab-ipele-ondo-starlink`.

This survived because `/insights/[slug]` is in neither gate's route list.

> **HIG — Layout > Best practices:** "Group related items to help people find the
> information they want… use negative space, background shapes, colors, materials,
> or separator lines to show when elements are related and to separate information
> into distinct areas."

**Fix.** Add table rules to `Prose.tsx`: an `overflow-x-auto` wrapper, `text-left`
+ `font-semibold` + a `border-b` hairline on `th`, `py-3 pr-6` on cells, a hairline
`border-b` per row. One edit fixes all five articles and everything published after.

---

## High

### H1 — The mobile hero scrim destroys the photograph

At 1440 the hero is genuinely good: the datacenter image reads clearly under a
light scrim, and the type sits over it with room to breathe. At 390 the same slide
is **an almost solid black rectangle** with the image surviving only in the
top-right corner.

The scrim at `HeroCarousel.tsx:272` is a fixed gradient —
`rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.34) 68%, transparent 82%`.
On a wide viewport those stops fall outside the text column. On a 390px portrait
viewport they cover the whole frame.

It is also inconsistent between slides, because the stops are fixed but the
photographs are not: slide 1 (dark datacenter) goes to black, slide 3 (bright
warehouse) survives intact. The `hero-contrast.mjs` gate passes throughout, because
white text on near-black passes trivially. Nothing checks that the image survives.

`docs/redesign/15-rubric.md` scores home imagery **9/10**. That score is correct at
1440 and wrong at 390.

**Attempted fix, reverted — the diagnosis above is wrong about the cause.**
A mobile-only scrim (diagonal dropped, ramp shortened) was built and measured.
It moved the hero's mean luminance from **47.7 to 47.9** on slide 1 and **82.7 to
83.8** on slide 3. That is nothing. A first, more aggressive version failed
`hero-contrast` on slide 5's eyebrow at 3.43:1, which bounds how far the scrim
can be weakened at all. The scrim is therefore not what darkens slide 1:
`managed-services.jpg` is a low-key photograph, and `object-cover` at 390x658
crops a shadow-heavy centre slice out of it. Both gradients were restored and the
finding stands open.

**Real fix.** Art direction, not CSS: a brighter frame for slide 1, or a per-slide
`object-position` so the portrait crop takes a lit part of the image. That sits
with `docs/BLOCKERS.md` #8 (imagery is still interim stock).

### H2 — The only touch control on the hero is 32 × 4 pixels

**Measured** at 390: seven slide buttons, each **32px wide by 4px tall**. Inactive
bars are white at 40% alpha, which over the bright ceiling of the warehouse slide
is close to invisible.

> **HIG — Accessibility > Mobility:** default control size 44 × 44 pt, minimum
> 28 × 28 pt.

Four pixels of height is not a near miss. Also WCAG 2.5.8 Target Size (24 × 24
minimum) and 1.4.11 for the inactive state's contrast against a variable
background.

**Fix.** Keep the 4px bar as the visual, wrap it in a 44px-tall transparent hit
area, and give the inactive state a fixed dark under-layer so its contrast does not
depend on the photograph behind it.

### H3 — Increased-contrast support does not exist

**Measured.** Rendering `/` with `prefers-contrast: more` produces byte-identical
tokens to the default:

```
default : text #1d1d1f  muted #6e6e73  hairline #d2d2d7  accent #ad4527
more    : text #1d1d1f  muted #6e6e73  hairline #d2d2d7  accent #ad4527
identical? true
```

A repo-wide grep for `prefers-contrast` and `forced-colors` returns nothing. The
only member of that family anywhere is `globals.css:99` `color-scheme: light`,
which additionally pins form controls and scrollbars to light for a visitor whose
OS is set to dark.

> **HIG — Accessibility > Vision:** "If your app doesn't provide this minimum
> contrast by default, ensure it at least provides a higher contrast color scheme
> when the system setting Increase Contrast is turned on."

The site does clear 4.5:1 by default, so this is a missing accommodation rather
than a contrast failure. It still means the Increase Contrast setting does nothing
here.

**Fix.** A `@media (prefers-contrast: more)` block in `globals.css` §2 stepping
`--text-muted` to `#4b4b50` and `--border-hairline` to `#8e8e93`. Roughly eight
lines.

### H4 — Navigation targets are 16 to 36 pixels tall

**Measured** at 390 across `/`, `/services`, `/contact` and an article:

| control | size | where |
|---|---|---|
| footer nav links | **48 × 16** | `Footer.tsx` — site-wide |
| mobile drawer nav links | **334 × 36** | `Header.tsx` — the primary mobile nav |
| open / close menu | 40 × 40 | `Header.tsx:641`, `:367` |
| home filter chips | ~110 × 35 | `IndustriesFilter.tsx` |
| contact dropdown items | 112 × 39 | `Header.tsx` |
| share buttons | 40 × 40 | `ShareBar.tsx:37` |
| ghost button | ~20px tall | `Button.tsx:70` opts ghost out of size classes |

The 16px footer links are the worst on the site, and they are on every page. The
36px drawer links are the entire mobile navigation.

`Button.tsx:70` is worth calling out separately: `variant === "ghost" ? "gap-1" :
sizes[size]` deliberately skips height so the underline hugs the label. Ghost is
used as a real CTA, including `src/app/not-found.tsx:33`.

**Fix.** Raise interactive heights to 44px below `sm:` only, so desktop density is
untouched. For ghost, keep the tight underline and add a `::before` hit-area
expansion.

### H5 — Five stroke widths across four icon grids

20 hand-rolled inline `<svg>` across 12 files, no shared icon module.

- **Stroke widths:** `1.4` (`Header.tsx:467`), `1.5` (×10), `1.75` (×5, including
  `Header.tsx:650` and `FormStatus.tsx:35`), `2` (×2, including `Breadcrumbs`).
- **Grids:** `0 0 16 16` (×7), `0 0 24 24` (×6), `0 0 20 20` (×5), `0 0 18 18` (×2).

> **HIG — Icons > Best practices:** "all interface icons in your app need to use a
> consistent size, level of detail, stroke thickness (or weight), and perspective."

`CLAUDE.md` sets the same bar in its own words: "consistent stroke widths".

**Fix.** One `src/components/ui/icons.tsx` on a single 20px grid at stroke 1.5 with
`currentColor`, then replace the 20 copies.

### H6 — Twelve article headings are orphaned under one article's title

`src/app/insights/page.tsx` renders `h1` at `:97`, then `h2` at `:128` which is
**the featured article's own title**, then the main grid at `:207-224` with **no
heading of its own** and cards at `headingAs="h3"` (`:217`).

The outline a screen reader announces is:

```
h1  Insights
  h2  <title of the featured article>
    h3  <article 1>
    h3  <article 2>   … ×12
```

Every article in the grid is announced as a subsection of the featured article.

Related, same root cause: `src/components/ui/IndustryCard.tsx:60` renders its title
as a `<span class="text-h4">` and `src/components/home/WhyPillar.tsx:21` renders
its title as a `<p class="text-h4">`, while their siblings `ServiceCard.tsx:61` and
`about/page.tsx:181` render the identical role as `<h3>`. Same visual weight, same
job, half of them missing from the outline.

**Fix.** Give the grid section an `sr-only` `h2` — the codebase already does this
correctly at `approach/page.tsx:44`, `services/page.tsx:43` and `Footer.tsx:38`.
Make `IndustryCard` and `WhyPillar` take a `headingAs` prop like `ArticleCard`
already does.

### H7 — Every primary CTA is a full page reload

`src/components/ui/Button.tsx:74-85` renders a raw `<a href>` when `href` is
passed. The rest of the site imports `Link` from `next-view-transitions` in 14
files. So all 25-plus `<Button href="/…">` call sites trigger a document reload,
skipping the App Router and the 220ms view transition defined at
`globals.css:415-419`.

`ServiceCard.tsx:45` and `IndustryCard.tsx:43` do the same, while
`insights/_components/ArticleCard.tsx:2` correctly uses the view-transitions
`Link`. Clicking an article card crossfades. Clicking a service card white-flashes.

> **HIG — Motion > Providing feedback:** "feedback motion that doesn't make sense
> can make them feel disoriented."

**Fix.** Import `Link` from `next-view-transitions` inside `Button`, `ServiceCard`
and `IndustryCard`, keeping a raw `<a>` for external `href`.

---

## Medium

### M1 — Seven ad-hoc type sizes bypass the nine-step ladder

The `@theme` ladder is caption / small / body / body-lg / h4 / h3 / h2 / h1 /
display, each carrying its own line-height, tracking and weight. Outside it:

| value | file:line | note |
|---|---|---|
| `text-[15px]` | `Button.tsx:32` | the **default** button size (see C1) |
| `text-[0.8125rem]` | `Eyebrow.tsx:43` | exactly `--text-small`; a duplicate for no reason |
| `text-[0.6875rem]` | `Header.tsx:47`, `ecosystem/page.tsx:107` | 11px, the HIG mobile *minimum*, in `text-muted` |
| `text-[1.0625rem]` | `Logo.tsx:49` | a ninth step |
| `text-[clamp(2.25rem,1.8rem+2vw,3rem)]` | `Stat.tsx:25` | a tenth step with its own tracking |
| `text-lg` | `TrustStrip.tsx:80` | raw Tailwind |
| `text-sm` | `insights/[slug]/page.tsx:174` | raw Tailwind |

> **HIG — Typography > Conveying hierarchy:** "Minimize the number of typefaces you
> use, even in a highly customized interface."

Three call sites also fight the token they just applied —
`page.tsx:129`, `approach/page.tsx:52`, `about/page.tsx:195` all set
`text-h2`/`text-h3` then override weight with `font-medium` and tracking with
`tracking-tight`. That is a pull-quote voice worth having, declared inline in three
files instead of once (see M6).

`Prose.tsx:35` sets `[&_p]:leading-relaxed` (1.625) on elements the `text-body`
token already gives 1.6. Two sources of truth for prose leading, 0.025 apart.

### M2 — Error colour is raw Tailwind with no semantic token

There is no `--color-danger` or `--color-success` in `@theme`, so every error state
reaches for Tailwind's red, and gets a slightly different one each time:

```
FormStatus.tsx:25      border-red-500/30 bg-red-50 text-red-700
NewsletterForm.tsx:119 text-red-600
Field.tsx:72           text-red-600
controls.ts:14         aria-[invalid=true]:border-red-500
```

Plus `insights/[slug]/page.tsx:174`, which uses `amber-*` and is the only `dark:`
variant left in the tree — dead code, since the dark theme is retired and its
tokens are a hard failure in the conformance gate.

Credit where it is due: `FormStatus` pairs colour with an icon and
`role="alert"` / `aria-live`, so it does **not** violate *HIG — Color > Inclusive
color*. This is token hygiene, not an accessibility defect: these are the only
colours on the site the conformance gate's palette checks cannot see.

### M3 — The trailing nav dropdown ran off the right edge at 1024px

> **Corrected 2026-09-07.** This entry originally read "Header dropdowns overflow
> the viewport at 200% zoom", citing `scrollWidth` 1934 against `clientWidth`
> 1440. That measurement was an artifact of the emulation: it applied CSS
> `zoom: 2` to the root element, which scales boxes but does **not** change how
> media queries evaluate. Real browser page zoom shrinks the layout viewport, so
> at 200% the `hidden lg:block` desktop nav is not rendered at all. Re-measured
> honestly, as a 720x450 viewport at `deviceScaleFactor: 2`, there is no overflow
> at 150% or 200% on any route. The lesson is in the method: emulate a user
> setting the way the browser implements it, or the finding is about the emulator.

There is a real defect underneath, at a different width. Measured with each
panel's width against its trigger's left edge:

| viewport | Services | Insights | About | Ecosystem |
|---|---|---|---|---|
| 1024px | fits | fits | fits | **41px off-screen** |
| 1100px | fits | fits | fits | **3px off-screen** |
| 1280px | fits | fits | fits | fits |

1024px is exactly where `lg:` turns the desktop nav on, so the first width at
which the nav appears is also the width at which its last panel does not fit.
`Header.tsx:145` clamps the panel with `w-[34rem] max-w-[calc(100vw-2rem)]`, but
`max-width` limits a panel's width, not its left edge: a 544px panel anchored
`left-0` to a trigger near the end of the rail still runs past the viewport.

### M4 — Off-scale section padding, invisible to a 1440-only gate

`scripts/style-conformance.ts:89` gates section padding to
`[48, 64, 80, 96, 128, 160]`. Three values ship outside it:

- `reports/[slug]/page.tsx:106` — `pb-10` = **40px**
- `HeroCarousel.tsx:279` — `pb-14` = **56px**
- `Hero.tsx:38` — `sm:pt-28` = **112px** (dead component, see M7)

The first two are mobile-only utilities and `checkRoute` runs at 1440
(`style-conformance.ts:430`), so the gate never evaluates them. `/reports/[slug]`
is not in its route list either.

Separately, `CTABand.tsx:30` uses `py-16 sm:py-20` (64/80) — a pair that exists
nowhere in `Section.spacings`. It passes the gate because both values are allowed,
but it means every page closes on a rhythm no other section uses.

Below section level the "8pt grid" in the `globals.css:231` comment is not what
ships: `px-3.5` (14px) ×6, `py-2.5` (10px) ×5, `py-1.5` (6px) ×4, `py-0.5` (2px)
×4, `px-5`/`py-5`/`p-5` (20px) ×8, `px-2.5` (10px) ×2. Concretely,
`ServiceCard.tsx:48` uses `p-6` and its sibling `IndustryCard.tsx:46` uses `p-5` —
4px apart for no reason. Both hand-roll their surface instead of using `Card`,
whose padding set (`p-4` / `p-6` / `p-8`) is a clean 8pt ladder.

### M5 — Two scroll-reveal delays are in the wrong unit

`src/components/motion/Reveal.tsx:22` emits `${delay}ms` and its prop is documented
"Delay in ms." Two call sites pass seconds, left over from a Framer Motion API:

```
app/(marketing)/contact/page.tsx:68   <FadeIn delay={0.08}>
app/reports/[slug]/page.tsx:133       delay={0.08}
```

Those render `--reveal-delay: 0.08ms`, which is zero. The intended stagger on the
contact sidebar and the report cover has never run.

### M6 — Structural duplication where the divergence is accidental

- **`/services/[slug]` and `/industries/[slug]` are the same template.** The intro
  grid string, the `h1`, the `FeatureImage` block, the card grid and the FAQ layout
  are byte-identical across two ~270-line files. Where they diverge it reads as
  drift rather than intent: the "Relevant industries" cross-link at
  `services/[slug]:196-206` is a row of secondary button chips, while the
  mirror-image "Relevant services" at `industries/[slug]:166-181` is a two-column
  card grid. Their "Related insights" lists differ in size, metadata, hover
  treatment and focus ring.
- **The pull-quote band is hand-built three times** (`page.tsx:126`,
  `approach/page.tsx:49`, `about/page.tsx:192`), each with
  `<Eyebrow className="text-muted">` — an override that cancels the component's
  entire purpose (`Eyebrow.tsx:43` sets `text-accent-green` and `:36-38` explains
  why). Three identical overrides mean the real requirement is a second Eyebrow
  variant. Home uses `text-h2`, the other two `text-h3`.
- **`/about` runs the same section shape three times** (`:104-136`, `:139-167`,
  `:170-189`) and pastes the same card three times inside the first (`:113-119`,
  `:120-126`, `:127-133`). `:178-187` also renders the `whyUs` dataset a second
  time on the site — the homepage already renders it at `page.tsx:110-122` through
  a different component with different heading semantics.

> **HIG — Layout > Visual hierarchy:** "Align components with one another to make
> them easier to scan and to communicate organization and hierarchy."

### M7 — Four dead components, two of them carrying live defects, still exported

```
src/components/ui/TrustStrip.tsx        0 usages — exported at ui/index.ts:12-15
src/components/ui/Hero.tsx              0 usages — exported at ui/index.ts:10
src/components/motion/AnimatedRule.tsx  0 usages
src/components/home/ContentShelf.tsx    0 usages
```

Verified: `<Hero` matches only `<HeroCarousel`; the `Hero` primitive itself is
unused. This matters beyond tidiness. `TrustStrip.tsx:80` carries
`text-muted opacity-70`, which composites to roughly **2.87:1** on white at 18px
semibold — a contrast failure. `Hero.tsx:38` carries the off-scale 112px padding.
Both are invisible to every runtime gate precisely because they never render, and
both are one import away from shipping.

`TrustStrip.tsx:80` also breaks a rule the codebase states out loud at
`CTABand.tsx:38`: "text-muted, never opacity-85: alpha-on-text was the dark-canvas
idiom and dissolves on white." `HeroCarousel.tsx:307` breaks it too, with
`text-white/85`.

---

## Low / craft

- **`z-50` on a sticky banner that sits under a `z-100` header.**
  `insights/[slug]/page.tsx:174` writes a raw z-number against the rule stated at
  `globals.css:253-258`, and `--z-index-header` is 100. The draft warning is
  occluded. Dev-only, but it is the one place the layer scale is bypassed.
- **Eight transitions with no duration or easing token** — `Footer.tsx:77,85,95,190,195`,
  `services/[slug]:260,262`, `industries/[slug]:206`. They fall back to Tailwind's
  `cubic-bezier(0.4,0,0.2,1)` instead of the brand's `cubic-bezier(0.22,1,0.36,1)`.
- **The retired uppercase eyebrow is still live in four files** —
  `TrustStrip.tsx:58`, `ecosystem/page.tsx:100`, `contact/page.tsx:32`,
  `LocationPage.tsx:175`, all `uppercase tracking-[0.12em]`, the idiom
  `Eyebrow.tsx:36-38` says was deleted.
- **`/404` offers three CTAs at two heights.** `not-found.tsx:26-36` — two `size="lg"`
  (48px) and one unsized ghost, so the row is optically unaligned.
  `docs/VOICE.md` also says "two options, not three."
- **`sm:grid-cols-4` on the footer** (`Footer.tsx:110`) gives roughly 126px per
  column at 640px for labels like "Deployment & implementation".
  `LocationPage.tsx:136,158` jumps 1 → 3 columns at `sm:`, bypassing `Grid`'s own
  `1 → sm:2 → lg:3` ladder (`Grid.tsx:17`).
- **Off-brand hex in the hero.** `HeroCarousel.tsx:291` uses `text-[#5fbf94]` for
  the eyebrow — a light green in no brand ramp (`--brand-300` is `#79a089`). It was
  chosen to survive the scrim, but it means the first coloured word a visitor reads
  is a green the brand does not own. `:213` uses `bg-[#1d1d1f]`, which is
  `var(--text)`.
- **Card titles have five treatments for one role** — `text-h4` on `/about` and
  `/services/[slug]`, `text-body` on `LocationPage.tsx:139,161`, `text-h3` on
  `ecosystem/page.tsx:113`, and `Footer.tsx:114` vs `:141` uses `text-caption` and
  `text-h4` for two `h3`s inside the same component.

---

## What the site does well

Not a courtesy section. These are things most sites get wrong.

- **The type ladder is real and adopted.** Tailwind's default scale appears twice
  in the whole tree. `src/lib/utils.ts:38` registers the scale with tailwind-merge
  so a token cannot be silently evicted.
- **Tracking is size-dependent and tightens as type grows** — `-0.01em` at h3 to
  `-0.025em` at display. That matches the measured Apple behaviour recorded in
  `docs/redesign/14-apple-light-spec.md` (`-.022em` / `-.016em` / `-.01em`).
- **`prefers-reduced-motion` is handled properly, in both layers.** Five CSS guards
  in `globals.css` (351, 314, 420, 460, 537, 593) and seven JS gates including
  `SmoothScroll.tsx:51-57`, which tears the Lenis instance down when the preference
  changes *at runtime*. I could not find a motion path that ignores the setting.
- **The reveal system fails open.** `reveal.js:32-38` returns before adding
  `reveal-ready`, so content is never hidden when JS or motion is unavailable.
- **Contrast decisions are computed, not eyeballed.** `docs/DECISIONS.md`
  correctly rejects Apple's own `#86868b` at 3.62:1 and the brief's `#e0561f` at
  3.80:1.
- **`FormStatus.tsx` is a textbook feedback component** — colour plus icon plus
  `role="alert"` / `aria-live`, so it satisfies *HIG — Color > Inclusive color*
  without relying on colour alone.
- **Every image has an alt.** 19 image call sites, 19 alts, with `Logo.tsx:34`
  correctly using `alt=""` and an `aria-label` on the wrapper. `FAQ.tsx:80-101` is
  a correct disclosure pattern. `Field.tsx:42-69` wires
  `aria-describedby`/`aria-invalid`/`aria-required` properly.
- **The mobile menu is a real modal** with `inert`, a focus trap, focus restore and
  Escape.
- **The measure is enforced**, not decorative: `.measure` / `.measure-tight` /
  `.measure-wide` at 65/52/78ch across roughly 45 call sites.

---

## The meta-finding: the gates have a shaped blind spot

Four of the six worst findings above are invisible to all five gates, and the
reason is structural rather than accidental. Every gate runs:

- **at 1440px only** — `style-conformance.ts:430`, `a11y-sweep.mjs:11`
- **on 15 routes that exclude every `[slug]` template** —
  `style-conformance.ts:33-65`, `a11y-sweep.mjs:5`
- **in the default state** — nothing open, nothing focused, nothing scaled
  (`overlay-stacking.mjs` is the sole exception, and it exists precisely because
  this blind spot had already caused one bug)

So: C4 hides in an ungated `[slug]` route. C1 and M3 need a scaled viewport. C3
needs a focused control. M4 needs a mobile width. H2 needs a device profile.

Three cheap changes would have caught roughly half of this report automatically:

1. Add the `[slug]` templates to both route lists.
2. Run the padding and contrast passes at 390 as well as 1440.
3. Add a text-scaling assertion: set the root font-size to 32px and fail if
   `scrollWidth > clientWidth`.

## Environment note, unrelated to design

`CLAUDE.md` instructs every agent to `export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"`.
That directory no longer exists; node is now Homebrew **v26.8.1** on the default
PATH. Separately, Playwright's browser binaries were not installed, so
`npm run gates` could not have run in this environment until
`npx playwright install chromium` was run during this audit. Both are worth fixing
so the gates stay runnable.

---

## Ranked fix plan

Ordered by severity against effort. The first four are each a single edit.

| # | Fix | Severity | Effort | Files |
|:-:|---|---|---|---|
| 1 | Delete `focus:outline-none`, let the global focus ring apply | Critical | 1 line | `forms/controls.ts:11` |
| 2 | Add table rules + overflow wrapper to `Prose` | Critical | ~8 lines | `ui/Prose.tsx` |
| 3 | Drop `whitespace-nowrap` from the Button base; add `min-w-0` to the two-column grids | Critical | ~4 lines | `ui/Button.tsx:8`, contact/report layouts |
| 4 | Pause/play toggle on the hero, and a 44px hit area on the indicators | Critical | ~30 lines | `home/HeroCarousel.tsx` |
| 5 | `@media (prefers-contrast: more)` token block | High | ~8 lines | `globals.css` §2 |
| 6 | Responsive hero scrim, bottom-anchored on mobile | High | ~5 lines | `home/HeroCarousel.tsx:272` |
| 7 | 44px minimum interactive height below `sm:` | High | ~10 sites | `Footer`, `Header`, `Button`, `ShareBar`, `IndustriesFilter` |
| 8 | `sr-only` h2 on the insights grid; `headingAs` on `IndustryCard` + `WhyPillar` | High | ~6 lines | `insights/page.tsx`, 2 components |
| 9 | View-transitions `Link` inside `Button` / `ServiceCard` / `IndustryCard` | High | ~9 lines | 3 components |
| 10 | One icon module, 20px grid, stroke 1.5 | High | 20 call sites | new `ui/icons.tsx` |
| 11 | `--color-danger` token; retire the four raw reds and the dead `amber`/`dark:` | Medium | ~6 sites | `globals.css`, 4 form files |
| 12 | Replace the 7 off-ladder type sizes | Medium | 7 sites | see M1 |
| 13 | Fix `delay={0.08}` → `delay={80}` | Medium | 2 lines | contact, report |
| 14 | Delete the 4 dead components and their barrel exports | Medium | 6 files | `ui/index.ts` + 4 files |
| 15 | Extract `<SectorPage>` and `<PullQuote>`; de-duplicate `/about` | Medium | larger | 5 page files |
| 16 | Clamp the nav dropdown position, not just its width | Medium | ~2 lines | `Header.tsx:145` |
| 17 | Off-scale padding (40/56/112) onto the approved scale | Medium | 3 lines | see M4 |
| 18 | Extend the gates: `[slug]` routes, 390px pass, text-scaling assertion | Medium | ~20 lines | 2 scripts |
| 19 | Retire the 4 uppercase eyebrows; tokenise the 8 untokenised transitions | Low | 12 sites | see Low |
| 20 | `/404` down to two CTAs at one height; raw `z-50` onto the scale | Low | 2 lines | `not-found.tsx`, `insights/[slug]:174` |

Items 1–4 are the ones that change what a visitor actually experiences.

---

# Remediation — 2026-09-07

Applied in the same pass as the audit. Gate suite green throughout:
`tsc --noEmit` clean, `lint` 0 errors, `npm run gates` **PASS — all 5 gates green**.

## Fixed, with the measurement that proves it

| # | Finding | Before | After |
|:-:|---|---|---|
| C1 | Horizontal scroll at 200% text size (`/contact` @390) | `scrollWidth` **616** vs `clientWidth` 390 | **390 vs 390** |
| C1 | CTA label did not scale with user text size | 15px at both 100% and 200% | **16px → 32px** |
| C2 | Carousel unstoppable on touch | slide 1→2→3 in 11s, no interaction | pause control holds slide 1 across **11.5s** |
| C3 | Form focus outline switched off | `outline: 2px **none**` + a 1.35:1 ring | `outline: 2px **solid** rgb(45,93,73)`, ring removed |
| C4 | Table cells collided | `th/td padding: 0px`, no rules, `overflow-x: visible` | `padding: 12px 24px 12px 0px`, hairline row rules, `overflow-x: auto` |
| H2 | Slide indicators 32x4px | 4px tall | **32x44**, bar unchanged visually |
| H3 | `prefers-contrast: more` changed nothing | tokens byte-identical | muted **5.07:1 → 8.67:1**, hairline **1.51:1 → 5.07:1** |
| H4 | Sub-44px targets @390 | **63** elements on `/` | **17**, and the rest are inline prose links, the skip link and the logo |
| H6 | 12 article `h3`s nested under a featured article's `h2` | orphaned outline | `sr-only` h2 on the grid; `headingAs` on `IndustryCard` / `WhyPillar` / `ServiceCard` |
| H7 | Every CTA a full page reload | raw `<a href>` | `next-view-transitions` `Link` for internal hrefs |
| M2 | Four different raw Tailwind reds | `red-500/600/700/50`, `amber-*`, dead `dark:` | one `--danger` ramp, computed: **6.54:1** / **4.77:1** / tint |
| M3 | Trailing dropdown off-screen at 1024px | 41px past the edge | trailing panels anchor `right-0`; fits at 1024–1440 |
| M5 | `delay={0.08}` → `0.08ms` | stagger never ran | `delay={80}` |
| Low | `z-50` draft banner under a `z-100` header | occluded | `z-toast`, on the semantic scale |

Root causes worth keeping, because none of them were the obvious suspect:

- **C1 was not one bug but three, in sequence.** `whitespace-nowrap` on the Button
  base was the first (min-content 576px). Removing it took the overflow from 616
  to 616 — no change, because the next floor was the **inputs' intrinsic ~20
  character width**, which at 32px root is also 576px; `w-full` sets width, not
  minimum, so `min-w-0` was needed. That took it to 551, where the last cause was
  `hello@digitplustechnology.com`, 29 unbreakable characters. `overflow-wrap:
  break-word` was not enough there: only `anywhere` also lowers min-content, which
  is what an inline-block's shrink-to-fit actually reads.
- **I introduced and then removed a regression mid-fix.** Making footer links 44px
  tall with `inline-flex min-h-11` turned each label into a single flex item at
  max-content, so long labels stopped wrapping and pushed the page 14px wide.
  Padding (`py-3 sm:py-0`) gives the same target and leaves wrapping alone.

## Not fixed, and why

- **H1 — mobile hero scrim.** Attempted, measured, reverted. The scrim is not the
  cause; see the corrected entry above. Needs art direction, tracked at BLOCKERS #8.
- **H5 — icon system.** 20 inline SVGs across 5 stroke widths and 4 grids. This is
  a mechanical replacement across 12 files and deserves its own pass rather than
  being folded into a fix batch.
- **M1 — remaining off-ladder type sizes.** `Button`'s `text-[15px]` is gone. Still
  outstanding: `Eyebrow.tsx:43`, `Logo.tsx:49`, `Stat.tsx:25`, `Header.tsx:47`,
  `ecosystem/page.tsx:107`, and the two raw Tailwind sizes.
- **M4, M6, M7** — off-scale padding, the duplicated `SectorPage` / pull-quote /
  `/about` structures, and the four dead components. All are refactors, not
  defects; M7 in particular should be a deliberate deletion, not a drive-by.
- **The gate blind spots.** Unchanged, and still the reason most of this survived.
  Extending `style-conformance.ts` and `a11y-sweep.mjs` to the `[slug]` routes,
  adding a 390px pass, and asserting `scrollWidth <= clientWidth` at a 32px root
  font size would catch C1, C4 and M4 automatically next time.

## Files changed

`globals.css` (danger + hero-eyebrow tokens, `prefers-contrast: more`,
`overflow-wrap`) · `ui/Button.tsx` · `ui/Prose.tsx` (+ `proseMdxComponents`) ·
`ui/ServiceCard.tsx` · `ui/IndustryCard.tsx` · `ui/index.ts` ·
`forms/controls.ts` · `forms/FormStatus.tsx` · `forms/Field.tsx` ·
`forms/NewsletterForm.tsx` · `forms/ContactForm.tsx` · `layout/Header.tsx` ·
`layout/Footer.tsx` · `layout/Logo.tsx` · `home/HeroCarousel.tsx` ·
`home/WhyPillar.tsx` · `home/IndustriesFilter.tsx` · `insights/page.tsx` ·
`insights/[slug]/page.tsx` · `insights/_components/ShareBar.tsx` ·
`reports/[slug]/page.tsx` · `(marketing)/contact/page.tsx`

---

# Gate coverage — 2026-09-07 (second pass)

The audit's meta-finding was that the gates ran at 1440px only, on routes that
skipped every `[slug]` template, in the default state — and that this shape,
not bad luck, is why four of the six worst findings survived. That is now closed.

## What changed

| Gate | Before | After |
|---|---|---|
| `style-conformance` | 28 routes @ 1440 | **36 routes x 2 widths** (1440 + 390) |
| `a11y-sweep` | 15 routes @ 1440 | **20 routes x 2 widths** |
| `text-scaling` | did not exist | **new gate**, 13 routes at a 200% root font size |

`scripts/text-scaling.mjs` asserts two things per route: no horizontal scroll at a
32px root, and no text pinned to a hard px size (a `text-[15px]` the reader
cannot enlarge). It is wired into `npm run gates` and `npm run gate:textscale`.

## What the widened gates immediately caught

Everything below was invisible to the previous configuration.

- **Six more routes failed reflow at 200% text** — `/services`,
  `/services/it-procurement`, `/industries/government`, `/about`, `/insights`,
  `/insights/[slug]`. `/contact` had been fixed by hand; these had not, and
  nothing would have told us. One token change fixed all six: `overflow-wrap`
  moved from `break-word` to **`anywhere`**, because only `anywhere` also lowers
  an element's min-content width, which is what a flex or grid item's default
  `min-width: auto` actually reads.
- **A critical `button-name` violation on `/insights/[slug]`.** The ShareBar
  "Copy link" button's only label was `<span aria-hidden="true">`, so it had no
  accessible name at all. Pre-existing; the route had never been scanned.
- **A serious `scrollable-region-focusable` violation — caused by this audit's
  own C4 fix.** Adding a scroll container to article tables made a region that a
  keyboard user could not scroll. Fixed with `tabIndex` and a named role. Worth
  recording: the fix for one barrier introduced another, and only the widened
  gate caught it.
- **`/reports/[slug]` section padding of 40px**, the M4 finding, now enforced
  rather than merely written down.
- **A false positive in the gate itself.** The orange-fill check tested only the
  vertical viewport bounds, so at 390 the off-canvas mobile drawer (parked with
  `translate-x-full`) counted as a second orange fill on 16 routes. The check now
  tests both axes. Widening a gate's coverage tests the gate as well as the site.

## One check was rewritten rather than merely extended

The hero headline budget (<=2 lines desktop) is right for a marketing hero, where
the headline is copy and its length is a design decision. Applied to
`/insights/[slug]` it asserted the wrong thing: the longest published article
title is **91 characters**, which no width and no type step fits in two lines, and
trimming it would be the gate setting editorial policy.

Content detail routes now assert **density** instead — characters per rendered
line, floor 15 desktop and 11 mobile. A 91-character title over 4 lines is 22.8
and passes; the same title over 9 lines is 10.1 and fails, which is the actual
defect worth catching (a title crammed into a collapsed column). Marketing routes
keep the hard line budget.

## Regression introduced and removed in the same pass

Making `overflow-wrap: anywhere` global let flex tracks shrink further than
intended in the header contact dropdown, and the five-letter word **"Email"**
broke across two lines. Caught by comparing rendered line counts against
`overflow-wrap: normal` at both widths. Fixed by pinning the fixed UI label
(`shrink-0` + `overflow-wrap: normal`) and widening the panel from `w-60` to
`w-72`, since 240px left 174px for an address needing 180px. Re-verified: line
counts are now identical with and without `anywhere` at 390 and 1440, so the
change costs nothing at ordinary sizes.

## Status

`tsc --noEmit` clean · `lint` 0 errors · **`npm run gates` PASS — all 6 gates green.**

Still open from the audit and unchanged by this pass: H1 (hero imagery, art
direction), H5 (icon system), M1 remainder (five off-ladder type sizes), M4/M6/M7
(refactors).
