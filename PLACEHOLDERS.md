# PLACEHOLDERS — swap before launch

Every in-code placeholder that must be replaced with real, client-supplied data before
launch. Each spot is marked in-source with a `// PLACEHOLDER — replace with client data`
comment (grep for it). This registry exists so nothing is forgotten at swap time.

> Quick find:
> ```bash
> grep -rn "PLACEHOLDER — replace with client data" src
> ```

## 1. Testimonials — `src/data/testimonials.ts`
**Status:** safe placeholders. Realistic quote text with **role-based attributions only** —
no invented person or company names (e.g. "Head of IT, Lagos manufacturing group").
Shown on `/` and every `/services/[slug]`.

| Slot | Current attribution | Replace with |
|---|---|---|
| 1 | Operations Director · Abuja financial services firm | Real, attributable, client-approved quote + attribution |
| 2 | Head of IT · Lagos manufacturing group | Real, attributable, client-approved quote + attribution |
| 3 | Managing Director · Port Harcourt SME | Real, attributable, client-approved quote + attribution |

**Do not** polish these to sound more credible — they need genuine client quotes and written
permission to attribute. Keep role-based (or real named) attributions; never invent a company.

## 2. Report "key findings" — `content/reports/state-of-enterprise-it-in-nigeria-2026.mdx`
**Status:** illustrative, already disclaimed in-body (lines 23, 33, 121: "Draft, illustrative
figures… Do not publish the numbers as fact until verified").
**Replace with** real survey/portfolio data before the figures are cited as research; until
then the disclaimer must stay. Do not invent credible-sounding numbers.

## 3. Client-count figure — RESOLVED (no placeholder needed)
The unverifiable "50+ enterprise clients" claim was **removed**, not placeheld:
- `src/data/stats.ts` — the "By the numbers" tile is now the **verifiable** "8 · Industries
  served" (countable from `src/data/industries.ts`).
- `src/app/(marketing)/about/page.tsx` and `src/data/authors.ts` — rephrased to verifiable
  sector coverage.
If the client later supplies a **verified** client count, it can be added back as a stat tile.

## 4. Assets & integrations (tracked in `docs/BLOCKERS.md`)
Partner-logo reseller authorisation, real photography, report cover images and PDFs, and all
env-gated integration keys (email / marketing / CRM / analytics / Supabase / Upstash) are
placeholders/stubs tracked in [`docs/BLOCKERS.md`](docs/BLOCKERS.md) and consolidated in
[`docs/redesign/13-launch-ledger.md`](docs/redesign/13-launch-ledger.md) §3 (PENDING — HUMAN).

## 5. Partner logos rendered as single dark ink (Apple-light rebuild, 2026-07-17)

`src/components/ui/TrustStrip.tsx` and `src/components/home/TrustMarquee.tsx` render all 17
partner marks through `[filter:brightness(0)]` — knocking each one to a single dark ink.

**Why:** the dark theme used `[filter:brightness(0)_invert(1)]` to force the marks to pure
white. On the white canvas that renders every logo **invisible**. Dark ink is the safe,
consistent, ships-today treatment (client-approved at the Phase 1 STOP, option b).

**The real end state (option a):** drop the filter entirely and use each partner's real
full-colour logo. It is the best-looking and most Apple-like treatment, and the reason it
isn't done yet is that we don't have the assets — not a technical constraint.

**What's needed from the client:** the official logo file for each of the 17 partners
(SVG preferred, or PNG at ≥2x), ideally each partner's approved monochrome-dark variant as
a fallback. Note this is coupled to the partner-logo **reseller authorisation** item already
tracked in `docs/BLOCKERS.md` — usage rights need settling regardless of file format.

Until then the strips are visually consistent but flat, and read as generic rather than as a
credible named-partner roster.
