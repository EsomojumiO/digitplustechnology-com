# PLACEHOLDERS — swap before launch

Every in-code placeholder that must be replaced with real, client-supplied data before
launch. Each spot is marked in-source with a `// PLACEHOLDER — replace with client data`
comment (grep for it). This registry exists so nothing is forgotten at swap time.

> Quick find:
> ```bash
> grep -rn "PLACEHOLDER — replace with client data" src
> ```

## 1. Testimonials — `src/data/testimonials.ts`
**Status: SUPERSEDED — the role-based placeholders described here no longer exist.**
This section previously listed three invented role-based quotes ("Operations Director ·
Abuja financial services firm" etc.). They were removed when real reviews landed. It is
kept only as a pointer, because the stale version contradicted the resolved section
further down this file and was cited as accurate during the launch-readiness audit.

**What actually ships:** five real Google reviews, verbatim, attributed by real name +
"Google review", linked to the verified Google profile. Three direct testimonials are
drafted but `approved: false` and therefore render nowhere — `testimonials.ts` keeps the
raw array module-private and exports only pre-filtered lists, so an unapproved quote has
no code path to a page. Verified against shipped HTML: zero hits for any pending name.

**Open editorial issue (not a placeholder):** the five live reviews are retail PC-shop
reviews ("Great store for high-end computing systems"). They are honest and correctly
handled, but they argue the opposite of the enterprise positioning on the page that
carries them. See `docs/redesign/18-launch-readiness.md`.

## 2. Report "key findings" — `content/reports/state-of-enterprise-it-in-nigeria-2026.mdx`
**Status:** illustrative, already disclaimed in-body (lines 23, 33, 121: "Draft, illustrative
figures… Do not publish the numbers as fact until verified").
**Replace with** real survey/portfolio data before the figures are cited as research; until
then the disclaimer must stay. Do not invent credible-sounding numbers.

## 3. Client-count figure — RESOLVED (verified 2026-07-21)
The unverifiable "50+ enterprise clients" claim is removed, not placeheld:
- `src/data/stats.ts` — the "By the numbers" tile is the **verifiable** "8 · Industries
  served" (countable from `src/data/industries.ts`).
- `src/app/(marketing)/about/page.tsx` and `src/data/authors.ts` — rephrased to verifiable
  sector coverage.

> **This section was previously wrong.** It claimed the removal was complete while
> `about/page.tsx` still hard-coded `<CountUp value={50} suffix="+" />` → "50+ Enterprise
> clients" on the very page named as fixed. Corrected in the launch-readiness pass
> (commit `8e4570a`); the tile is now "8 · Industries served". Re-verified in shipped HTML.

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


## Testimonials — RESOLVED (pending approvals) — 2026-07-17

`src/data/testimonials.ts` no longer contains placeholders. It now holds **real**
testimonials in two classes, and `approved` is enforced by construction: the raw
array is module-private and only pre-filtered lists (`testimonials`,
`googleReviews`, `directTestimonials`) are exported. **An unapproved quote has no
code path to a page** — forgetting to filter at a call site cannot publish one.

### Live now — 5 Google reviews (`source: "google-review"`, `approved: true`)
Already published publicly by their authors, so quotable verbatim without further
approval. Quoted exactly; attributed by name + "Google review". Rendered as a
compact ★★★★★ **supporting strip**, deliberately not as the main cards: they read
as retail/hardware-store reviews, which vouches for the supply line honestly but
says nothing about enterprise managed services.

### PENDING — 3 direct testimonials (`approved: false`)
Drafts written by us and sent for approval. **They are not testimonials until the
named person approves in writing.** Currently invisible on the site — verified: none
of the three quotes or names appears anywhere in the shipped HTML.

| Person | Company | Status |
|---|---|---|
| Adel Salimullin (CTO) | Nizamiye | draft sent — awaiting written reply |
| Arc. Henshaw | Greyboulders | draft sent — awaiting written reply |
| Bashir Lawal | DewDrop TV | draft sent — awaiting written reply |

**To publish one:** flip `approved: true` **only** on confirmation that the person
approved in writing — and publish **what they sent back**, not the draft, if they
edited it. Keep the reply (screenshot/email) as the consent record.

**Consequence while pending:** the home "In their words" section renders **not at
all** (an empty grid under that heading is worse than no section), and
`/services/[slug]` shows no testimonial. Both are guarded — `directTestimonials`
is empty, and `index % 0` is `NaN`, which would otherwise have taken every service
page down.

### ~~NEEDED FROM CLIENT — Google profile URL~~ — RESOLVED 2026-07-17
Client supplied `https://maps.app.goo.gl/5RnHHpYhWGDz9ygt9`. Verified before
wiring: 302 → `google.com/maps/place/Digitplus+Technologies` at 9.0626, 7.4713
(Abuja) — right business, right city. Now `siteConfig.googleReviewsUrl`, and the
strip's "From our Google reviews" label links to it (external, `rel="noopener
noreferrer"`, `aria-label` naming the destination and the new tab).
