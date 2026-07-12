# 12 — Copy Audit (Copy Chief, end-to-end)

**Date:** 2026-07-12
**Scope:** Every rendered marketing page read top-to-bottom against a production server at
`http://localhost:3210` — `/`, `/about`, `/approach`, `/contact`, `/ecosystem`, `/services`
(+ `/services/it-procurement` and the other 5 slugs in `src/data/services.ts`), `/industries`
(+ `/industries/government` and siblings), `/locations` (+ `abuja`/`lagos`/`port-harcourt`),
`/insights` + an article, `/insights/category/procurement`, `/reports` +
`/reports/state-of-enterprise-it-in-nigeria-2026`, `/privacy`, `/terms`, the 404 route, plus
header, footer, WhatsApp widget, and all form labels/placeholders/success+error states
(`src/components/forms/**`).
**Method:** Rendered HTML fetched and tag-stripped for the reader's-eye pass; source read in
`src/app`, `src/data`, `src/components/forms`, `content/`. Voice standard: CLAUDE.md design
philosophy + `docs/redesign/08-copy-deck.md` (confident, concrete, calm; zero filler;
sentence case; British English; ₦; `+234 803 786 8120`).

## Headline verification (the two things flagged as critical)
- **"8+ years" vs "since 2022" — NO CONTRADICTION FOUND.** There is no "8+ years" (or any
  computed "X+ years") claim anywhere in the app. Every tenure reference reads **"since 2022"**
  and is consistent: home "Trusted" beat (`src/app/page.tsx:45`), About intro + credential
  (`about/page.tsx:24,114-117`), author bio (`src/data/authors.ts:33,35`), and the stats band
  (`src/data/stats.ts` → `2022 / Operating since`). This was corrected in Phase C
  (`docs/redesign/09-phaseC-report.md`) and holds. No action.
- **Testimonials that read as real named clients — FOUND, all placeholder.** See C13. They are
  labelled "(illustrative)" but still render as attributed quotes; flagged PENDING — HUMAN.

---

## 1. Voice consistency

**C1 — Banned filler "robust" (three times, oil-gas-energy industry)**
File: `src/data/industries.ts:284, 292, 322`
Current: intro "Resilient infrastructure and **robust hardware** built for demanding, remote
energy-sector sites."; concern card title "**Robust hardware**"; SEO description "Resilient
infrastructure, **robust hardware**, and managed services…".
Problem: `08-copy-deck.md` global kills explicitly ban "robust (as filler)".
Fix: replace with concrete words, e.g. card title "**Hardened hardware**" / "**Field-grade
hardware**"; intro "…and **hardware built to survive** demanding, remote energy-sector sites."

**C12 — House comma-splice tic (site-wide, stylistic, low priority)**
Files: `src/data/process.ts`, `src/data/whyUs.ts`, service/industry card `desc` in
`src/data/*.ts`.
Current examples: "…the actual requirement**,** not a product list."; "…staff training**,** IT
deployment and handover done right."; "One partner owns the whole journey**,** planning,
procurement, deployment, and support."
Problem: commas used where an em-dash or full stop is stronger; recurs enough to read as a
verbal tic rather than a choice.
Fix (optional polish): convert the "X, not Y" and appositive joins to em-dashes
("…the actual requirement — not a product list.").

_No instances of "world-class", "cutting-edge", "best-in-class", "seamless", "leverage
synergies", "turnkey", "next-generation" were found in live copy._

## 2. Message discipline

**C10 — Home "Trusted" beat paired with the wrong pillar body**
File: `src/app/page.tsx` (beats array ~line 45 mapped against `whyUs` bodies)
Current: the beat labelled "**Trusted — since 2022, 50+ clients**" renders above the
**Sector-Specific Experience** description ("Government, banking, healthcare, education…each
have distinct demands…"). Label and supporting sentence describe different ideas.
Problem: minor logic mismatch — the "Trusted" claim isn't the sentence that follows it.
Fix: pair the "Trusted" beat with a trust/track-record sentence, or relabel the beat to match
the sector body.

_Otherwise message order (What / Who / Why us / What next) is sound on every commercial page;
the "one accountable partner" positioning repeats across home, services and the Enterprise
industry but never more than once per page, which is acceptable for a core brand line._

## 3. Microcopy consistency

**C2 — Title-Case CTA button "Speak to Our Team"**
File: `src/app/(marketing)/services/page.tsx:63`
Current: `Speak to Our Team`
Problem: sentence-case standard; every other CTA is sentence case ("Get a quote", "Send
message", "Get the report").
Fix: `Speak to our team`

**C3 — Service headings lowercase the "IT" initialism**
File: `src/app/(marketing)/services/[slug]/page.tsx:139, 261`
Current: `Inside our ${content.title.toLowerCase()}` and
`Ready to talk about ${content.title.toLowerCase()}?` — renders on `/services/it-procurement`
as "Inside our **it procurement**" and "Ready to talk about **it procurement**?"
Problem: blanket `.toLowerCase()` de-capitalises the "IT" acronym; reads as a typo.
Fix (code): derive a lowercase display title that preserves initialisms, e.g. keep a
`lowerLabel` field per service ("IT procurement", "hardware supply", …) or post-process to
re-capitalise standalone "it" → "IT".

**C6 — Pillar titles are Title Case, not sentence case**
File: `src/data/whyUs.ts:8,13,18,23` (renders on `/about` "Four commitments")
Current: "End-to-End Accountability", "Nationwide Reach", "Sector-Specific Experience",
"Procurement Integrity".
Problem: against the sentence-case standard; also inconsistent with the home page, which shows
these as one-word beats ("Accountable / Nationwide / Trusted / Disciplined").
Fix: "End-to-end accountability", "Nationwide reach", "Sector-specific experience",
"Procurement integrity". (Judgment call — acceptable to keep if treated as proper labels, but
they should then match the home wording.)

**C7 — Process step titles are Title Case**
File: `src/data/process.ts:9,15,21,27,33,39` (renders on `/` and `/approach`)
Current: "Discovery & Needs Assessment", "Solution Design & Proposal", "Procurement &
Logistics", "Deployment & Installation", "Testing & Handover", "Ongoing Support & Management".
Problem: same sentence-case standard.
Fix: "Discovery & needs assessment", "Solution design & proposal", etc. (Judgment call, as C6.)

**C8 — Newsletter button label drift for the same action**
Files: `src/components/forms/NewsletterForm.tsx:27` (default "Subscribe", used in footer
`Footer.tsx:177`) vs `src/app/reports/page.tsx:105` (`buttonLabel="Notify me"`).
Current: footer subscribe button = "Subscribe"; reports subscribe button = "Notify me".
Problem: two labels for one intent (join the quarterly list).
Fix: pick one canonical label site-wide (recommend "Subscribe", or "Notify me" if the intent is
strictly "tell me when a report drops") and apply to both.

**C9 — Contact success message is a comma splice**
File: `src/components/forms/ContactForm.tsx:123`
Current: "Thank you, your message has been received."
Problem: two independent clauses joined by a comma.
Fix: "Thank you — your message has been received." (or two sentences).

**C11 — No branded 404 page**
File: (missing) `src/app/not-found.tsx`
Current: the 404 route returns Next.js's default "404 | This page could not be found." (bare,
off-brand, no nav back into the site).
Problem: the 404 is part of the reading experience and currently has zero brand voice or
recovery path.
Fix: add a `not-found.tsx` with sentence-case brand copy and links home / to services /
to contact (e.g. "This page has moved or never existed. Here's the way back.").

_Forms otherwise clean: labels are sentence case ("Full name", "Work email", "Company /
Organisation", "How can we help?"), error strings are consistent ("Something went wrong. Please
try again." / "Could not reach the server…"), success and empty states read well._

## 4. Claims check (critical)

**C13 — Illustrative testimonials render as attributed client quotes** — **PENDING — HUMAN**
File: `src/data/testimonials.ts` (shown on `/` and `/services/[slug]`)
Current: three quotes attributed to "Operations Director, Federal agency (illustrative)",
"Head of IT, Commercial bank (illustrative)", "Managing Director, SME, Lagos (illustrative)".
Problem: although caveated "(illustrative)", they are written as real testimonials and sit in a
"What partnership looks like" / "In their words" section that reads as social proof.
Action: **replace with real, attributable, client-approved testimonials before launch.** Do not
polish these to sound more credible — they need genuine client-supplied quotes and permission.
(Already tracked in `docs/BLOCKERS.md`.)

**C14 — "50+ enterprise clients" is an unverified brand figure** — **PENDING — HUMAN**
Files: `src/data/stats.ts:11`, `src/app/(marketing)/about/page.tsx:24`, `src/app/page.tsx:45`
Current: "50+ / Enterprise clients" (stats band, About intro, home "Trusted" beat).
Problem: presented as fact; `stats.ts` notes it is a client-provided brand fact, but it is not
independently verifiable from the repo.
Action: **confirm the 50+ client figure with the client** and keep, or adjust to the real
number, before launch.

**C15 — Report "key findings" are illustrative placeholders under a "What the data shows"
heading** — **PENDING — HUMAN**
File: `content/reports/…` → `/reports/state-of-enterprise-it-in-nigeria-2026`
Current: five numbered "Key findings / What the data shows" statements, plus a visible
disclaimer "Draft, illustrative figures… Do not publish the numbers as fact until verified."
Problem: honest disclaimer is present and good, but the findings are framed as data ("What the
data shows") while being placeholders pending the primary survey.
Action: **replace with real survey/portfolio data before this is cited as research**, or soften
the "What the data shows" framing until then. No credible-sounding numbers to be invented here.

## 5. Nigerian-market fit

**C16 — Draft insights articles target Ghana, not Nigeria** — **PENDING — HUMAN (content
strategy)**
Files: `content/insights/how-to-structure-an-it-procurement-process-that-survives-a-public-procurement-au.mdx`,
`content/insights/a-migration-runbook-for-replacing-legacy-banking-endpoints-without-downtime.mdx`
Current: both are built around Ghanaian context — Ghana Public Procurement Authority, Act 663 /
Act 914, Bank of Ghana, Accra/Kumasi/Takoradi, the cedi.
Status: both are `draft: true` and return **404** (not on the live site), so no live-market
issue today.
Problem: off-brand for a Nigeria-only company (Abuja HQ, NDPA, CBN). If ever published they
would confuse the market positioning.
Action: keep unpublished, relocalise to Nigeria, or move to a separate property. (Not a live
finding — noted so it isn't published by accident.)

**C5 — American spelling "license" (noun) in an article body**
File: `content/insights/proactive-it-monitoring-explained.mdx:216`
Current: "…platform **license**, time to configure and maintain it…" (used as a noun).
Problem: British standard is "licence" for the noun. (Elsewhere the site is correctly British —
"licence renewals", "organisation", "programme", "prioritise", "enrol" all check out.)
Fix: "platform **licence**".

**C1 — Contact metadata still sells the killed "free IT assessment" CTA**
File: `src/app/(marketing)/contact/page.tsx:15,17`
Current: title "Contact Us, **Request a Free IT Assessment**"; description "…**Request a free IT
assessment**." (also Title Case "Contact Us").
Problem: `08-copy-deck.md` retired the "Request a Free IT Assessment" CTA in favour of "Get a
quote"; the site body no longer offers a "free IT assessment", so the meta promises something
the page doesn't. Stale label + off-standard casing.
Fix: title "Contact Digitplus — get a quote" (or similar); description "Talk to Digitplus about
your IT project by email, phone or WhatsApp — Abuja HQ, delivery across Lagos and Port Harcourt.
We'll come back with next steps." Drop "free IT assessment".

_Phone `+234 803 786 8120` and WhatsApp `wa.me/2348037868120` are correct and consistent
everywhere. No ₦-denominated prices appear on the corporate site (correct — pricing lives on the
store)._

---

## FIX LIST (in-repo — safe copy/casing/spelling fixes)
- **C1** `src/app/(marketing)/contact/page.tsx:15,17` — drop stale "Request a Free IT Assessment"
  from title + description; use a "Get a quote"-aligned title, sentence case.
- **C2** `src/app/(marketing)/services/page.tsx:63` — "Speak to Our Team" → "Speak to our team".
- **C3** `src/app/(marketing)/services/[slug]/page.tsx:139,261` — stop `.toLowerCase()` eating
  the "IT" acronym ("it procurement" → "IT procurement") via a preserved lowercase label.
- **C4** `src/data/industries.ts:284,292,322` — remove banned filler "robust hardware".
- **C5** `content/insights/proactive-it-monitoring-explained.mdx:216` — "license" → "licence".
- **C6** `src/data/whyUs.ts:8,13,18,23` — Title-Case pillar titles → sentence case (and align
  with home wording).
- **C7** `src/data/process.ts:9,15,21,27,33,39` — Title-Case step titles → sentence case.
- **C8** `NewsletterForm.tsx:27` / `reports/page.tsx:105` — unify "Subscribe" vs "Notify me".
- **C9** `src/components/forms/ContactForm.tsx:123` — fix comma splice in success message.
- **C10** `src/app/page.tsx` — pair the "Trusted" beat with a matching trust sentence.
- **C11** add `src/app/not-found.tsx` — branded, sentence-case 404 with a way back.
- **C12** `src/data/process.ts`, `whyUs.ts`, service/industry `desc` — optional: convert the
  comma-splice "X, not Y" joins to em-dashes.

## PENDING — HUMAN (needs real client-supplied data; do NOT polish to sound credible)
- **C13** `src/data/testimonials.ts` — three illustrative testimonials; need real, attributable,
  client-approved quotes before launch.
- **C14** `src/data/stats.ts` + About/home — verify the "50+ enterprise clients" figure with the
  client.
- **C15** `/reports/state-of-enterprise-it-in-nigeria-2026` — illustrative "key findings" under a
  "What the data shows" heading; replace with real survey/portfolio data before it is cited.
- **C16** two `draft: true` Ghana-targeted insights articles — keep unpublished / relocalise to
  Nigeria; do not publish on a Nigeria-only property.

---

## Resolution log (2026-07-12)

11 in-repo fixes applied and re-verified on a fresh production build; C12 deferred; C13–C16
carried to the launch ledger as PENDING — HUMAN.

| Fix | Status | What changed |
|---|---|---|
| **C1** | ✅ | Contact meta title → "Contact Digitplus — get a quote"; description drops the retired "free IT assessment" (now 153 chars). |
| **C2** | ✅ | Services CTA "Speak to Our Team" → "Speak to our team". |
| **C3** | ✅ | Added `lowerTitle()` in `services/[slug]` — lowercases titles but preserves the "IT" initialism; "Inside our IT procurement" now renders correctly. |
| **C4** | ✅ | Removed banned filler "robust hardware" ×3 in `industries.ts` → "hardened hardware" / "hardware built to survive". |
| **C5** | ✅ | `proactive-it-monitoring-explained.mdx`: "license" (noun) → "licence" (British). |
| **C6** | ✅ | `whyUs.ts` pillar titles → sentence case ("End-to-end accountability", …). |
| **C7** | ✅ | `process.ts` step titles → sentence case ("Discovery & needs assessment", …). |
| **C8** | ✅ | Newsletter label unified to "Subscribe" (reports hub was "Notify me"). |
| **C9** | ✅ | Contact success message comma splice → em-dash. |
| **C10** | ✅ | Home "Trusted" beat (mismatched with the sector-experience body) → "Experienced · government, banking, healthcare." |
| **C11** | ✅ | Added a branded, sentence-case `not-found.tsx` (404 → status 404, on-voice, with links home / services / get a quote). |
| **C12** | ⏸ Deferred | Optional comma-splice → em-dash polish; stylistic only, left to avoid over-editing the established voice. |

**PENDING — HUMAN (need real client-supplied data — must NOT be polished to sound credible):**
C13 illustrative testimonials (`src/data/testimonials.ts`) · C14 verify "50+ enterprise
clients" (`src/data/stats.ts`) · C15 illustrative report "key findings"
(`state-of-enterprise-it-in-nigeria-2026`) · C16 two `draft:true` Ghana-targeted articles
(keep unpublished / relocalise). All four carried to `13-launch-ledger.md`.
