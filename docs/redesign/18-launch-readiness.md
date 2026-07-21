# 18 — Launch readiness

**Branch:** `redesign/apple-light` · **PR:** [#2](https://github.com/EsomojumiO/digitplustechnology-com/pull/2) (open — do not merge; client merges)
**Date:** 2026-07-21 · **Verified against:** a production `next build` served locally, not the dev server and not memory.

Every claim below was re-measured on the current build. Where an earlier document
asserted something was fixed, this pass checked whether it actually was — and three
times it was not.

---

## A. VERDICT

| Lens | Verdict | Basis |
|---|---|---|
| **QA / technical** | 🟢 **GREEN** | 71/71 sitemap URLs 200 with non-empty `<main>` · 0 console errors sitewide · conformance gate PASS across 28 routes · axe 0 violations across 15 templates · hero-contrast PASS (worst-case pixel ≥ 4.5:1 on every overlay element, both breakpoints) · `tsc` clean · build 79/79 · 18 redirects all permanent + single-hop + 200 · forms correct in stub mode · 404 branded and returning a true 404 |
| **Copy** | 🟢 **GREEN** | Prose is the strongest asset here and the AI-tell scan is genuinely clean. Four shipped-artefact defects were found and fixed, and both editorial AMBERs were then closed by client decision (§A.2). Re-audited on the current build. |
| **Design** | 🟢 **GREEN** | Rubric holds at 8–9. One regression introduced during this pass (over-long H1s) was caught by the gate and fixed rather than waived. Image set is 63 files with zero duplicates. |
| **SEO** | 🟢 **GREEN** | 71 unique titles, 71 unique descriptions, all inside length bounds · 0 orphans · 0 non-descriptive anchors · JSON-LD on every template and valid · 14/14 target pages now carry their keyword in H1 + first 100 words · robots/sitemap/canonicals coherent · no noindex leaks, no draft URLs in the sitemap |

**No REDs remain open, and no AMBER is left to the client's judgement.** Five REDs were
found: four fixed, one closed by client decision (§A.1). Both editorial AMBERs were then
also resolved (§A.2). Six known issues remain, every one of them blocked on a human input
rather than on engineering (§A.3).

### A.1 The REDs that were found and what happened to them

| # | RED | Resolution |
|---|---|---|
| R1 | **Above-the-fold entrances never painted from hidden.** `8fac918` fixed the task-ordering half of this but not the cause: the transition sat on `.reveal-init` unconditionally, so adding `reveal-ready` made elements *animate* 1→0 instead of snapping. With `reveal-in` arriving two rAFs later, an above-fold element travelled ~2 frames of a 600ms fade — a ~3% dip. An rAF sampler measured **min opacity 1.00** on every above-fold element on `/`, `/about`, `/services`, `/insights`, `/industries/government`. | **Fixed** (`64fb579`). Transition armed only on `.reveal-in`; hidden state snaps. Re-measured: **min opacity 0.00**. Below-fold was never affected — those elements complete the 1→0 fade off-screen, which is why scroll reveals looked right while the first impression was static. |
| R2 | **Report covers 404'd.** `public/images/reports/` did not exist. `next/image` returned **400** on `/reports` and both detail pages, so covers rendered broken — and the same files were both routes' `og:image`, so social shares 404'd too. | **Fixed** (`64fb579`, `582f33a`). Two policy-compliant interim covers sourced, `coverAlt` rewritten to describe the actual images (it had described a designed cover that never existed). |
| R3 | **Stats rendered as zero in shipped HTML.** `CountUp` used `useState(0)`, so crawlers, no-JS visitors and first paint read "**0** Industries served / **0** Service lines / **0** Cities served" on home and "**0+** Enterprise clients" on `/about`. The component docstring claimed the opposite. | **Fixed** (`8e4570a`). Server renders the real figure; the client drops to 0 in a layout effect (before paint) only when it will animate. Verified in shipped HTML: **8 / 6 / 3**. |
| R4 | **Broken sector grammar on all 8 industry pages, 3 slots each.** Headings and CTAs were built from `title.toLowerCase()`, shipping "Talk to a **sme** specialist", "Talk to a **education** specialist", "Talk to a **oil, gas & energy** specialist", "What **sme** demands". | **Fixed** (`8e4570a`). Sentence forms are now written per sector in an `IndustryPhrasing` block instead of derived. Verified on all 8. |
| R5 | **A lead gate collecting PII for a 771-byte stub.** The report form asked for full name, work email, company and role in exchange for "category-level pricing, the methodology behind every figure". The files are 771 B and 765 B one-page stubs. | **Closed by client decision** — ungate now, keep the HTML report (`a1707b5`). The API route, schema, honeypot and rate limiting are all intact; only the call site is removed, with restore instructions in place. Hub copy corrected too: it promised "independent, data-led research… written to be cited" over figures the report itself labels "Draft, illustrative… Do not publish the numbers as fact". |

### A.2 Resolved after the first draft of this report (client decision, `0fbe8a9`)

Both AMBERs that had been left to the client's judgement are now closed.

- **~~Retail Google reviews as the homepage's only social proof.~~** ✅ Relocated to
  `/services/hardware-supply` and `/services/it-procurement`, the two lines they
  genuinely vouch for — context-matched proof rather than borrowed proof. Verified:
  0 occurrences on `/`, 1 on each of those two pages, 0 on `managed-services` as a
  control. **Home's testimonial slot stays dark** pending the three direct-testimonial
  approvals (runbook step 15); it renders nothing rather than showing an empty heading
  or publishing unapproved drafts.
- **~~Two byte-identical insight covers.~~** ✅ Both pairs broken. The shared photo
  stayed on the article it actually illustrated and the other was re-shot:
  `network-installation-checklist-new-office` → a rack-mounted switch with fibre
  uplinks above a UPS; `securing-multi-branch-networks` → a symmetrical service
  corridor. The image set is now **63 files with zero duplicates**. Both `coverAlt`s
  described staged scenes no stock frame matched (an engineer in an Abuja fit-out; a
  network diagram) — inaccurate before the swap too — and were rewritten to describe
  the actual images.

### A.3 Known issues we are shipping with (AMBER)

1. **Two service pages miss their keyword in an H2** (`infrastructure-solutions`,
   `managed-services`). They carry it in the H1 and the first 100 words. Not worth
   keyword-stuffing a heading over.
2. **`LocalBusiness` / `Organization` carry no `streetAddress`** — only Abuja / FCT /
   NG. Local-pack eligibility is weaker without one. Blocked on BLOCKERS #4.
3. **Partner logos ship without confirmed reseller authorisation** (BLOCKERS #2/#9).
   Sharpened by the fact that the site's own vendor-evaluation article tells buyers to
   demand exactly that certificate. See runbook step 12.
4. **`/privacy` and `/terms` carry a live "DRAFT — pending legal counsel review"
   banner** while four forms collect personal data. See runbook steps 13–14.
5. **Hero slide `alt` attributes are inconsistent** — 3 of 5 describe the image, 2 are
   empty. Empty is arguably correct (the overlay headline is real DOM text, so the
   photo is decorative); the inconsistency is the defect, not the empty value. Cosmetic.
6. **The CTA gate only inspects orange-fill CTAs.** That is how `/services` shipped an
   off-map "Speak to our team" as a hairline pill. Fixed at the call site; widening the
   check to all CTAs needs its own pass to avoid false positives on inline links.

---

## B. SHIPPED

75 commits on `redesign/apple-light`. What the client is launching:

### Foundation
| Commit | What |
|---|---|
| `3c445c3` `24490db` | Recon + the Apple-light design spec (docs 00–03, 14) |
| `c4d0385` | Type system: Candidate A (Inter) rolled; Sora/Figtree and the preview route retired |
| `9696345` | Phase 3 — light token flip and every primitive re-skinned |
| `010c33c` | Type scale migrated out of `@layer components` into `@theme` |
| `0e486fc` | Motion foundation — View Transitions, lenis, root fix |
| `fb98f5f` | `next-mdx-remote` 5→6 (security advisory; Vercel deploy gate) |

### Structure & design system
| Commit | What |
|---|---|
| `689642c` | Canonical 3-variant button system; single CTA labels; CTABand `children`→`actions` bug |
| `ac8cb04` | Colour tokens enforced — orange is fill-only, green is ink (D10–D17) |
| `4a4c73f` `dbb56a5` | Rogue font sizes onto the modular scale; every prose heading was body-sized |
| `e929c3a` | Unified card radius, hover elevation, cover scrims |
| `a4de493` `c4d7506` `584a1f8` | Two tones only; stacked same-tone collapse fixed systemically (/about 439px→359px) |
| `1aef388` | Connective Line rendered full-bleed — width belongs to the component |
| `1db69ec` | **style-conformance gate** + global spacing/eyebrow sweep |

### Home & hero
| Commit | What |
|---|---|
| `0de5d11` | Phase 4 home rollout — one orange fill per viewport |
| `385cf90` | Sticky storytelling + scroll-scrub full-bleed band |
| `65d45d0` | **Full-bleed overlay hero carousel** with per-slide verified contrast |
| `9a0f777` | Real stagger + in-range amplification |

### Content, imagery, copy
| Commit | What |
|---|---|
| `ed01dbf` `bab736d` | Verified image download script + page imagery |
| `7ce523c` `d3200e9` `1854720` | Imagery-policy pass: 39 covers audited, 15 swapped (services-over-faces, African subjects) |
| `47ecd3c` `5a78455` | Real Google reviews live; 3 drafts gated behind approval; strip linked to the verified profile |
| `36ab89c` | `PLACEHOLDERS.md` + verifiable stats |
| `f529203` | Copy & voice audit fixes (C1–C11) |
| `383202e` | Page ledes sharpened; **CTA intent map** (`src/lib/cta.ts`) wired sitewide; scrim + CTA gate checks encoded |

### SEO & accessibility
| Commit | What |
|---|---|
| `dda9b90` | SEO & IA architecture — keyword map, hub-and-spoke, lead-gen |
| `d12327d` | Hub-and-spoke internal linking |
| `ebdc6c0` | Titles, descriptions, heading order, OG (S1–S6); `clampDescription()` at the metadata layer |
| `93a01cd` | 24 critical/serious axe violations → 0 across 15 templates |
| `01c27e2` | Settled axe sweep + rubric scores |
| `06d5367` | OG/theme reskin for the light palette |

### This pass (launch readiness)
| Commit | What |
|---|---|
| `64fb579` | Reveal entrances never painted from hidden (R1); report covers 404'd (R2) |
| `8e4570a` | Stats shipped as zeros (R3); sector grammar (R4); off-map `/services` CTA; unverifiable "50+ clients" removed; `/industries` copy drift |
| `48ce831` | Lagos/PH stopped promising offices that don't exist; CTA-gate prefix bug; gate widened 15→20 routes |
| `582f33a` | Report cover duplicated the home hero; **every CREDITS file completed** (7 folders, 63 images) |
| `a1707b5` | Keyword H1s on 14 pages; report gate removed (R5); gate widened 20→28 routes |
| `74c18ad` | Three stale register entries corrected; last over-length SERP title trimmed |
| `0fbe8a9` | Google reviews relocated to the two service lines they vouch for; both duplicate insight covers broken |

### Verification harnesses (kept in-repo, re-runnable)
`scripts/style-conformance.ts` (28 routes, 10 checks against real computed styles) ·
`scripts/a11y-sweep.mjs` (axe, 15 templates, settled-animation aware) ·
`scripts/hero-contrast.mjs` (worst-case-pixel contrast on the real composite) ·
`scripts/download-images.sh` (reproducible image set).

---

## C. PENDING — HUMAN: launch runbook

In execution order. Nothing here is blocked on further engineering.

> **Keep the registers honest as you work through this.** As each item lands, update
> `docs/BLOCKERS.md` and `PLACEHOLDERS.md` to say what is *actually* true — and if you
> skip a step, record that too. This pass found three register entries asserting a defect
> was fixed while it was still shipping (the "50+ enterprise clients" claim was live on the
> very page the register named as fixed). **A register that lies is worse than no register:**
> the first one gets trusted and stops anyone looking, the second at least sends someone to
> check. Every "✅ RESOLVED" below should be earned by looking at the running site.

**The canonical NAP — copy this verbatim wherever it is needed. It must match the site exactly.**

```
Name:     Digitplus Technology Limited
Phone:    +234 803 786 8120
Email:    hello@digitplustechnology.com
Website:  https://digitplustechnology.com
Locality: Abuja, FCT, Nigeria
WhatsApp: https://wa.me/2348037868120
```
> No `streetAddress` is published yet. Supply one (step 11) and it must be added to
> `siteConfig` at the same time, or the Google profile and the site will disagree.

---

### 1. Turn off Vercel Deployment Protection — 2 min
Vercel → project → **Settings → Deployment Protection** → set **Vercel Authentication** to
**Disabled** (or add the reviewers to the team).
**Unblocks:** anyone opening the preview URL, and Lighthouse/axe running against it.
**If skipped:** every preview link returns a login wall; the review below cannot happen.

### 2. Review the preview build — 30–45 min
Open the PR #2 preview URL. Walk `/`, one service, one industry, one location, `/insights`,
one article, `/reports`, `/contact`, and a deliberate 404.
Check by eye: the hero carousel advances and pauses when you hover; entrances animate on
first load (this was broken until `64fb579` — worth confirming on real hardware); nothing
overlaps at a narrow window width.
**Unblocks:** merge confidence.
**If skipped:** you merge on my measurements alone.

### 3. Lighthouse + axe in the browser — 15 min
Chrome DevTools → Lighthouse → **Mobile**, run on `/` and one article. Targets: **SEO ≥ 95,
Performance ≥ 90**. Then the axe DevTools extension on the same two pages.
**Note:** my sweep covers 15 templates headlessly at 1440px and reports 0 violations; this
is the in-browser confirmation on a throttled mobile profile, which is the number the brief
actually specifies.
**If skipped:** you launch without a real-device performance number.

### 4. Validate the structured data — 10 min
Paste each into <https://validator.schema.org> and Google's Rich Results Test:
`/` (Organization, WebSite) · `/services/it-procurement` (Service, FAQPage, BreadcrumbList) ·
`/insights/<any>` (BlogPosting) · `/locations/abuja` (LocalBusiness) · `/reports/<any>` (Article).
**Expected:** valid, with a warning about the missing `streetAddress` on LocalBusiness — that
one is known and tracked at step 11.
**If skipped:** a malformed graph silently costs you rich results.

### 5. Merge PR #2 — 2 min
Only after steps 2–4. Squash or merge commit, your preference; the history is clean either way.
**Unblocks:** everything downstream.

### 6. Connect the domain + production deploy — 20 min (+ DNS propagation)
Vercel → **Settings → Domains** → add `digitplustechnology.com` **and** `www.digitplustechnology.com`.
Set **www → Redirect to** the apex. Point DNS at Vercel (A `76.76.21.21` or the CNAME Vercel shows).
Wait for the certificate to issue.
**Note:** the app also enforces www→apex itself, so this is belt-and-braces, not a single
point of failure.
**If skipped:** no site.

### 7. Set the environment keys — 45–60 min
All integrations are stubs that log and succeed until the key is present; no code changes are
needed. In Vercel → **Settings → Environment Variables** (Production):

| Key | Notes |
|---|---|
| `RESEND_API_KEY` | **Verify the sending domain in Resend first** (DKIM + SPF records on `digitplustechnology.com`), or lead notifications will land in spam. Implement the marked TODO in `src/lib/integrations/email.ts` and add `resend` to deps. |
| `MARKETING_API_KEY`, `MARKETING_LIST_ID` | Brevo. TODO in `src/lib/integrations/marketing.ts`. |
| `CRM_WEBHOOK_URL` | HubSpot. The generic webhook path runs as-is once set — simplest option. |
| `NEXT_PUBLIC_ANALYTICS` | Plausible. `track()` no-ops until set. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | **Then run `supabase/migrations/0001_leads.sql`.** Without it, `store.persist()` falls back to in-memory and leads are lost on redeploy. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Free Upstash Redis. Rate limiting falls back to in-memory (per-instance, so ineffective on serverless) without it. |

**If skipped:** the forms still return success to the visitor and the lead goes nowhere. This
is the single most expensive thing to get wrong.

### 8. Smoke-test the contact form end to end — 15 min
**Do this after step 7, on the production domain, not the preview.**
1. Submit `/contact` with real details. Expect the inline success message naming +234 803 786 8120.
2. Confirm the email arrives at `hello@digitplustechnology.com` — check spam, and if it's there, fix DKIM/SPF before launching.
3. Confirm the row lands in Supabase `leads`.
4. Confirm the contact appears in HubSpot.
5. Submit the footer newsletter; confirm the Brevo list.
6. Submit the form 6× quickly; expect a **429** on the last one (proves Upstash is wired).
7. Submit with the hidden `company_website` field filled; expect a silent success and **no** lead anywhere.
**If skipped:** you find out the pipeline is broken from the client asking where the leads are.

### 9. Search Console — 15 min (+ crawl time)
<https://search.google.com/search-console> → add **Domain** property → add the TXT record to DNS
→ verify → **Sitemaps** → submit `sitemap.xml`. Then **URL Inspection** on `/` → Request indexing.
**Verified ready:** 71 URLs in the sitemap, all 200, zero `noindex`, no draft URLs, canonicals
coherent. Submit the moment the domain is live.
**If skipped:** indexing takes weeks instead of days and you get no coverage diagnostics.

### 10. Google Business Profile — 30 min
Create/claim at <https://business.google.com>. **Use the canonical NAP block at the top of this
section verbatim** — locality, phone, and the `https://digitplustechnology.com` website field
must match the site character for character, or the local signals split.
**If skipped:** the LocalBusiness schema on `/locations/*` has nothing to corroborate it.

### 11. Supply a street address — client, 5 min once known
Add it to `siteConfig` in `src/lib/site.ts`; it flows into `Organization` and all three
`LocalBusiness` blocks automatically. Must be identical to the Google profile.
**Unblocks:** local-pack eligibility (AMBER #4).

### 12. Confirm partner reseller authorisation — client, variable
Microsoft, HP, HPE, Dell, Cisco, Lenovo, Fortinet, Juniper, Aruba. Either produce the
authorisation for each **or** pull the logo strips and state "we source through authorised
distribution" in words only.
**Why this one matters more than it looks:** `/insights/how-to-evaluate-it-vendors-in-nigeria`
tells buyers to demand exactly this certificate. A CIO who applies the site's own test to the
site finds an unverifiable claim.
**If skipped:** trademark exposure, and a self-inflicted credibility wound.

### 13. Counsel sign-off on Privacy + Terms — client, variable
Send `/privacy` and `/terms` to counsel. Confirm NDPA/NDPR alignment, the NDPC complaint
route, and the retention language — while noting that four forms are live and collecting
personal data.
**If skipped:** a regulated buyer's legal team flags it before your proposal reaches the CIO.

### 14. Remove the DRAFT markers — 5 min, **only after step 13**
Delete the "DRAFT — pending legal counsel review" banner from both pages.
**Do not do this before counsel approves.** The banner is honest; removing it early replaces
an ugly truth with a false assurance.

### 15. Testimonial approvals — client, variable
Three direct testimonials are drafted and `approved: false`, so they render nowhere. Get
written sign-off from each named person, then flip `approved: true` in
`src/data/testimonials.ts`. **Do not** flip it to make the section look fuller.
Approving these is what fills the homepage testimonial slot, which currently renders
nothing by design. The retail Google reviews are no longer available to fill it — they
now run only on the two service pages they actually vouch for (§A.2).

### 16. Swap the placeholder assets as they arrive — variable
| Asset | Replaces |
|---|---|
| Real quarterly-report PDFs | The 771 B / 765 B stubs. **Then restore the lead gate** — re-add `<ReportGateForm>` to `src/app/reports/[slug]/page.tsx`; the route, schema and rate limiting are all still in place. |
| Real report data | The illustrative figures and their in-body disclaimer; then the `/reports` hub copy can go back to claiming research. |
| Client photography | Interim Unsplash imagery throughout (BLOCKERS #8) — the single biggest lift to perceived credibility available. |
| Designed report covers | The two interim covers in `public/images/reports/`. |
| Designed covers for the two swapped insight articles | The interim frames chosen in `0fbe8a9` — optional, they are policy-compliant and no longer duplicated. |

---

### Re-running the gates

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
npm run build && npx next start -p 4310 &
node --experimental-strip-types scripts/style-conformance.ts http://localhost:4310
node scripts/a11y-sweep.mjs      http://localhost:4310
node scripts/hero-contrast.mjs   http://localhost:4310
```
All three must exit 0. They are the drift protection — the reveal bug, the zero-stats bug and
the sector-grammar bug all shipped *past* earlier reviews, and the gates were widened this
pass (15 → 28 routes) specifically because one-route-per-template was hiding per-slug defects.
