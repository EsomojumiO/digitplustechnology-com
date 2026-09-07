---
name: restrained-futurism
description: Use whenever building, restyling, or reviewing any UI for the Digitplus corporate site. Encodes the brand's modern, minimalist, Apple-light design language so the frontend feels designed, not assembled. Use proactively for any component, page, layout, color, type, or motion work.
---

# Restrained Futurism — Digitplus Design Language

Designing for **digitplustechnology.com**, an enterprise B2B IT company whose site must win
trust from government, banking, and enterprise procurement buyers. The aesthetic is
**modern, minimalist and precise**. Futuristic in *craft*, never in costume. The polish of
Apple, Linear, Vercel and Stripe, not a neon crypto landing page. Calm, inevitable, premium.

> **Corrected 2026-09-07.** This file previously described a design that no longer ships
> (dark-or-light toggle, Montserrat, mono uppercase eyebrows, grain overlay, aurora hero).
> Every one of those is now either retired or a hard failure in `npm run gate:conformance`,
> so following the old text produced code the build rejects. What follows is the shipped
> system. The live visual spec is `docs/redesign/14-apple-light-spec.md`. The findings
> behind the additions in §6 are in `docs/DESIGN-AUDIT.md`.

## 1. What actually ships (binding)

- **Light only.** `globals.css:99` sets `color-scheme: light`. There is no dark theme and no
  toggle. Dark token values are a **hard failure** in the conformance gate. Do not add
  `dark:` variants; the one remaining is dead code slated for removal.
- **Two canvas tones, and only two.** White `#ffffff` and `#f5f5f7`. `Section` exposes
  `default` and `muted` only. `inverse` was **deleted** rather than aliased, so TypeScript
  catches it at compile time. **Green is ink, never canvas** — the footer and closing bands
  are `#f5f5f7`, not forest green.
- **One typeface.** Inter, loaded once via `next/font` with `axes: ["opsz"]`, serving both
  display and body. JetBrains Mono exists as `--font-mono` for one surviving use (`Stat`)
  and is on borrowed time. The conformance gate allows exactly four font families:
  `Inter`, `Inter Fallback`, `JetBrains Mono`, `JetBrains Mono Fallback`.
- **Colour, computed not chosen.** These values passed a WCAG relative-luminance
  calculation; the alternatives that failed are recorded in `docs/DECISIONS.md`.

  | Role | Token | Value | On white |
  |---|---|---|---|
  | Ink | `--text` | `#1d1d1f` | 16.83:1 |
  | Muted ink | `--text-muted` | `#6e6e73` | 5.07:1 |
  | Hairline | `--border-hairline` | `#d2d2d7` | non-text |
  | Orange fill | `--accent` | `#ad4527` (Ember-600) | 5.74:1 with white label |
  | Orange ink | `--accent-ink` | `#8c3820` (Ember-700) | 7.77:1 |
  | Green ink | `--accent-green` | `#2d5d49` (Forest-500) | 7.57:1 |

  Banned: Apple's `#86868b` (3.62:1) and the brief's `#e0561f` (3.80:1). Forest-600
  `#20493b` passes AAA but reads near-black at accent sizes, so Forest-500 is the ink.
- **One orange fill per viewport, maximum.** Gated. The orange is the conversion beat; a
  second one destroys it. Everything else that wants emphasis uses green ink.
- **Eyebrows are sentence-case green pills**, not mono uppercase. The uppercase
  wide-tracking idiom belonged to the dark canvas; on white it reads as shouty technical
  chrome rather than a quiet label.
- **No texture layer.** `grain-overlay`, `aurora`, `glow`, `glow-orange`, `circuit-pulse`,
  `cover-dark` and `route-enter` are on the gate's `RETIRED` list. Depth comes from
  hairlines, spacing and one soft hover shadow.

## 2. Hard rule: reskin, do not break the engine

Visual work only. Do not alter routes, page metadata, JSON-LD, sitemap/robots, MDX content,
the content-access layer (`src/lib/content`), forms, or API handlers in ways that change
behaviour or SEO. Preserve semantics and accessibility (WCAG 2.1 AA).

## 3. Aesthetic principles

- **One accent, disciplined.** Ember for the single primary CTA and focus states. Forest
  green as ink for links, eyebrows and quiet emphasis. Warm neutrals carry everything else.
- **Hairlines, not shadows.** 1px `#d2d2d7` borders. `--shadow-md` is hover-only, never at
  rest. No glows on white.
- **Typographic command.** Nine steps, each carrying its own line-height, tracking and
  weight. Tracking tightens as size grows: `-0.01em` at h3 through `-0.025em` at display.
  Body at 1.6 leading, 65ch measure. Type does most of the design work.
- **Space as luxury.** Section padding comes from `[48, 64, 80, 96, 128, 160]` px and
  nothing else — this is gated. Component padding stays on the 8pt grid. Big confident hero
  moments, quiet dense data sections, aligned edges.
- **Motion with intent.** Durations 150 / 220 / 320 / 650ms, easing
  `cubic-bezier(0.22, 1, 0.36, 1)`, mirrored in `src/components/motion/tokens.ts`. Scroll
  reveals fade and translate 16px. Always gate behind `prefers-reduced-motion`, and always
  fail open: the resting state must be fully visible so content is never hidden without JS.
- **Craft in the 5%.** Pixel-aligned spacing, one icon stroke weight, immaculate focus rings.

## 4. Forbidden (the "AI slop" look)

No centred-everything layouts, no purple or cyan gradient blobs, no emoji bullets, no
identical generic card grids, no foreign accent colours, no clutter. Deliberate choices only.

## 5. Implementation

- Tailwind v4 `@theme` tokens in `src/app/globals.css` are the single source of truth. It is
  the only CSS file in the repo; there is no `tailwind.config.js` and no `src/styles/`.
- Never write a raw z-number. Use the `--z-index-*` scale, and set `isolation: isolate` on
  any component that stacks internally.
- Components stay presentational, prop-driven, accessible and responsive — just as
  considered at 390px as on a wide display.
- Use `Link` from `next-view-transitions` for internal navigation, never a raw `<a>`.
- Performance: `next/image`, lazy decorative effects, Core Web Vitals "Good" on mobile.

## 6. Rules earned the hard way

Each of these cost a real defect. See `docs/DESIGN-AUDIT.md`.

- **Never `focus:outline-none`.** It kills `:focus-visible` too, because focus-visible is a
  subset of focus. Form controls lost their focus ring this way for months.
- **Never `whitespace-nowrap` on a button.** At 200% text size a nowrap label sets a
  min-content floor wider than the viewport, and a grid item with the default
  `min-width: auto` cannot shrink below it. The page then scrolls sideways.
- **Never a hard `px` font size.** `text-[15px]` does not respond to the reader's font-size
  setting. At 200% text the CTA became the smallest type on the page. Use the ladder.
- **Style tables when you enable GFM.** `Prose` styled twelve element types and no table, so
  five published articles shipped with zero cell padding and colliding text.
- **44px minimum interactive height below `sm:`.** Desktop density is fine; a 16px-tall
  footer link is not a target.
- **Anything that auto-advances needs a visible pause control.** Hover and focus pausing
  covers mouse and keyboard and leaves touch with no exit.
- **Add `prefers-contrast: more` when you add a colour.** The Increase Contrast setting
  currently changes nothing on this site.
- **A card title is a heading.** If it looks like `text-h4` and sits at the top of a card, it
  belongs in the outline. Take a `headingAs` prop rather than hard-coding `span` or `p`.

## 7. The gate is the contract

`npm run gates` runs five checks against a real Chromium over the built site. It is the
enforcement layer for everything above, and it is not optional.

1. No dark-theme token values in computed styles
2. Exactly one `<h1>` per route
3. At most one orange fill per viewport
4. Every text/background pair ≥ 4.5:1, composited
5. Section padding from `[48, 64, 80, 96, 128, 160]`
6. Only the four allowed font families load
7. No retired classnames
8. Hero headline ≤ 2 lines desktop, ≤ 3 mobile
9. Em dashes ≤ 1 per 400 words per article

Known blind spots, so you cannot rely on a green run alone: the gates test **1440px only**,
skip every **`[slug]` template**, and test the **default state** with nothing open, focused
or scaled. Check those cases by hand until the gates cover them.
