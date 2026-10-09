# Blockers — Inputs Needed From Client

These do not stop the build (we use clearly-labelled placeholders), but must be supplied before launch.

| # | Item | Placeholder used | Where to replace |
|---|------|------------------|------------------|
| 1 | ~~Full brand kit (logo variants, colors, fonts, spacing)~~ ✅ **RESOLVED** | Official Pishon kit applied: Forest Green/Ember Red/Cream palette, Montserrat+Inter, real logos in `public/brand/` | `src/app/globals.css` tokens |
| 2 | **DECIDED 2026-10-08:** no partner status claimed; strip captioned as brands we source and support. Still open only if you want the word "partner" back: needs written confirmation per brand. Authorized-reseller confirmation per partner logo (Microsoft, HP, Dell, Cisco, Lenovo, Fortinet) | Monochrome text/SVG placeholder logos in trust strip | `src/components/ui/TrustStrip` + `/public/logos` |
| 3 | Real, attributable testimonials / named case studies | **5 real Google reviews live** (verbatim, real names, linked to the verified profile). 3 direct testimonials drafted but `approved: false` → render nowhere. No illustrative/invented testimonials remain. | `src/data/testimonials.ts` — flip `approved: true` only on written sign-off from the named person |
| 4 | **2026-10-09:** digitplus.tech + www attached to the Vercel project. Owner action left: at Namecheap set A @ → 76.76.21.21 and CNAME www → cname.vercel-dns.com (keep Namecheap DNS, which preserves the email forwarding). **DECIDED 2026-10-08:** digitplustechnology.com canonical; secondary domains 301 at Vercel (owner action). Canonical contact identity + stray-domain decisions (digitplus.tech, alt numbers/emails) | hello@digitplustechnology.com / +234 803 786 8120 used everywhere; redirect map stubbed | `next.config.ts` redirects + NAP constants |
| 5 | ✅ **RESOLVED 2026-10-09** (DECISIONS): Supabase dp-os `website_leads` is the lead store and working CRM view. A dedicated CRM or newsletter platform can be added later through the existing adapters. CRM + email-marketing platform choice | Stub adapters (log + succeed) behind `src/lib/integrations` | env vars in `.env.example` |
| 6 | Quarterly-report original data source | 1 sample report + placeholder PDF in `/public` | `content/reports/*` |
| 7 | **DECIDED 2026-10-08:** pages stay live as published; counsel review recommended; register with NDPC unless counsel advises otherwise (owner action). Final Privacy Policy + Terms content | Drafted placeholder legal copy clearly marked "DRAFT — counsel review required" | `/privacy`, `/terms` pages |
| 8 | High-quality photography of real projects/team | Interim Unsplash imagery on service/industry/location pages. **/about now has NO team photo at all** — it held a stock frame of ~15 identifiable people in a visibly American boardroom, captioned "Our team" with alt "The Digitplus Technology team". That is a false claim about real people, not a placeholder, so it was removed (2026-07-21) rather than re-captioned. The layout gap is the honest state. | throughout marketing pages; restore the /about block only with the client's own photograph |
| 9 | Real **partner** logo files (Microsoft, HP, Dell, Cisco, Lenovo, Fortinet) | ✅ Official SVGs added in `/public/logos`, wired into TrustStrip + TrustMarquee (forced uniform white). **Reseller authorization per brand still required before public use.** | `/public/logos`, `src/components/ui/TrustStrip`, `src/components/home/TrustMarquee` |
| 10 | Real quarterly-report PDF (original data). **Update 2026-10-09:** the annual report's download is gated again now that leads persist. **Update 2026-10-08:** the new annual report `digitplus-industry-report-2026` ships a real 348 KB PDF, offered ungated (see DECISIONS 2026-10-08). The two older reports still have no PDF and show the contact card instead. | Minimal valid placeholder PDF (771 B / 765 B). **The lead-capture gate that sat in front of it has been REMOVED** — it collected a named buyer's work email, company and role in exchange for a one-page stub, which is a reputational and NDPA-consent problem. Restore the gate (`<ReportGateForm>` in `src/app/reports/[slug]/page.tsx`; the API route, schema and rate limiting are all still in place) only once the real PDF exists. | `public/reports/nigeria-enterprise-it-hardware-price-index-q2-2026.pdf` — replace with the real original-data report before launch |
| 11 | Cover/inline imagery for insights + reports | ✅ **Insights covers done** — all 33 sourced from Unsplash (license: free commercial, no attribution required), 1600×900 JPEG in `public/images/insights/`; photographer credits saved in `public/images/insights/CREDITS.json` (optional use). Topic-matched on concept (not Nigeria-specific stock). **Report covers now present** — 2 interim Unsplash covers added 2026-07-21 (`public/images/reports/`, CREDITS.json alongside). Before that the files were absent entirely and next/image returned 400, so the covers rendered broken on /reports and both detail pages, and both og:images 404'd. Still interim: replace with the client's own designed covers. | swap any specific insight cover by replacing the file; supply report covers |

> ⚠️ **Update 2026-06-05, revised 2026-08-22:** some content-engine drafts reference cover images that do **not** yet exist (`public/images/insights/<slug>.jpg`), and cannot be published (flip `draft:false`) until those covers exist — the `cover:` paths 404 until then.
>
> **No count is recorded here on purpose.** Run `npm run content:drafts` for the current numbers and the slugs behind them. *These figures are derived from `content/insights/` and `public/images/insights/` at the moment you run it — they are never stored in this document, because a pasted count is right on the day it is pasted and quietly wrong afterwards. This note said "19 drafts" for two months, then "18" for a day.*
>
> To fill a missing cover there is an auto-fetcher (`npm run content:covers`, `content-engine/fetch-covers.mjs`), but **no Unsplash API key is present in the repo** — supply `UNSPLASH_ACCESS_KEY` to run it. It writes the image, the `coverAlt`, and the `CREDITS.json` row in one step.
>
> ⚠️ **When you add those covers, REWRITE the `coverAlt` from the image you actually chose.**
> The drafts' current alt text describes an ideal staged scene ("A Nigerian clinic nurse
> reviewing patient records beside a wall-mounted UPS during a power cut") written from the
> article topic, not from a photograph. Shipping that over a generic stock frame is a
> fabrication: it tells screen-reader users the picture shows something it does not, and it
> asserts a nationality and a location no photo can establish. The 39 published covers had
> exactly this problem and were corrected on 2026-07-21 — the ransomware cover's alt claimed
> "A Nigerian IT security team reviewing an incident response plan on a whiteboard" over what
> is actually a Matrix-style falling-code still. Describe what is in the frame; never assert
> nationality, employer or city unless a readable landmark proves it.
>
> List the slugs still needing covers at any time with:
> ```bash
> npm run content:drafts   # scripts/draft-status.mjs
> ```
>
> It prints the drafts missing a cover, the drafts that have one, and a
> published/draft/missing summary line. Archived drafts under `archive/` are
> invisible to it, exactly as they are to the content loader.

## Content confirmations — October 2026 batch (articles, annual report, portfolio)

These are published conservatively (claims softened or omitted). Confirm to strengthen the copy.

| # | Item | What the copy says now | Where |
|---|------|------------------------|-------|
| 19 | ✅ **DECIDED 2026-10-08** (see DECISIONS): Hospital support scope: are the Canon printers and UPS units at critical desks inside the support arrangement? | Stated as general principle only, never as this client's scope | `after-go-live-how-we-support-a-private-hospital-in-abuja`, `it-support-for-private-hospitals-in-abuja` |
| 20 | ✅ **DECIDED 2026-10-08** (see DECISIONS): Can Digitplus offer prospects a reference they can phone? | Article tells readers to ask any supplier for one; makes no promise for us | `choosing-an-it-partner-for-a-private-hospital-in-abuja` |
| 21 | ✅ **DECIDED 2026-10-08** (see DECISIONS): "Same-day on-site response" in the FCT (from `locations.ts`) | Articles say only that response targets are agreed in writing by priority | `how-an-it-engagement-with-digitplus-works`, `it-support-for-private-companies-in-abuja` |
| 22 | ✅ **DECIDED 2026-10-08** (see DECISIONS): "Authorised channels" / "no grey-market stock" (from `whyUs.ts`, `process.ts`) | Articles say only that warranties are registered in the client's name | all ten new articles avoid "authorised" |
| 23 | ✅ **DECIDED 2026-10-08**: "Nationwide" kept with its definition; sector copy kept (no projects named). Site-wide claims beyond the documented record: "Nationwide reach" (`whyUs.ts`), MDA / bank-branch / teaching-hospital work (`locations.ts`) | Untouched, outside this batch | `src/data/whyUs.ts`, `src/data/locations.ts` |
| 24 | ✅ **DECIDED 2026-10-08** (see DECISIONS): Annual report: Digitplus's **2027 plan** is written as company intentions (FX rate and validity stated on every hardware quote; delivery evidence agreed before shipment; a local product quoted beside an imported one where it meets spec; DPA and breach-notification time in managed-services contracts by default; power assumption stated in every infrastructure proposal; price index and annual report continue) | Published as intentions. Confirm the business will hold to each before promoting the report | `docs/reports/digitplus-industry-report-2026.md` §Digitplus's plan for 2027 |
| 25 | ✅ **DECIDED 2026-10-08** (see DECISIONS): Annual report sources still uncertain: GAID Article 34 (removed, NDPA s.29(2) carries the claim); exact date of the 4% FOB suspension letter; approximate publication dates for sources [3], [4], [30] | Worded to what is verified | same file, Sources |
| 26 | ✅ **DECIDED 2026-10-08** (see DECISIONS): Quote validity on Digitplus's own quotes | Articles give only the market range (a few days to two weeks) | `how-to-read-an-it-quote` |

## Forms & integrations — stubbed pending decisions

All lead-capture integrations ship as **stub adapters** that validate, log to the
server console, and return success when env is absent (see `.env.example`). They swap
to real providers via env only — no code changes. Confirm/supply before launch:

| # | Item | Current state | Where to enable |
|---|------|---------------|-----------------|
| 12 | ✅ **WORKING**: Resend key is in Vercel and the domain is verified (DKIM + bounce MX). hello@ gets an email per enquiry, report download and newsletter sign-up. **Email provider** for internal lead notifications to hello@ | Stub (console log). | Set `RESEND_API_KEY` (recommended) or `SMTP_*`; implement the marked TODO in `src/lib/integrations/email.ts`; add `resend`/`nodemailer` to deps. |
| 13 | **Email-marketing platform** (Brevo / Mailchimp / similar) | Stub. | Set `MARKETING_API_KEY` + `MARKETING_LIST_ID`; implement TODO in `src/lib/integrations/marketing.ts`. |
| 14 | **CRM** (client CRM or HubSpot free tier) | Stub. Generic webhook path runs as-is once set. | Set `CRM_WEBHOOK_URL` (simplest) or `CRM_API_KEY`; implement TODO in `src/lib/integrations/crm.ts`. |
| 15 | ~~**Analytics platform**~~ ✅ **WIRED — GA4, consent-gated** | GA4 (`gtag.js`) loads only after the visitor accepts non-essential cookies; `track()` no-ops until `NEXT_PUBLIC_GA_ID` is set. | Set `NEXT_PUBLIC_GA_ID` (e.g. `G-T1S3L3Y74H`) in Vercel Production, then redeploy (NEXT_PUBLIC_* is build-time inlined). |
| 18 | **Embedded Google Map on /locations/abuja** (the verified GBP listing) | Interim: address block + "View on Google Maps" search link (no iframe, no third-party cookies). No embed. | Needs (a) the street address (blocker #11 in the launch runbook) **and** (b) a decision to consent-gate the Maps iframe like GA4 — a Maps embed sets Google cookies before consent, which would undo the NDPA gating. Then embed the privacy-enhanced Maps iframe behind consent. |
| 16 | ✅ **LIVE 2026-10-09**: leads persist to `public.website_leads` in the dp-os project via the token-guarded `ingest_website_lead()` (migration 0002). **Lead persistence — needs a real DB**~~ ✅ **WIRED (env-gated)** | `store.persist()` does a Supabase REST insert when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set; in-memory fallback otherwise. | Set the two env vars; run `supabase/migrations/0001_leads.sql`. |
| 17 | ~~**Rate limiting — needs a shared store**~~ ✅ **WIRED (env-gated)** | `rate-limit.ts` uses Upstash Redis (atomic EVAL window) when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set; in-memory fallback otherwise; fails open. | Create a free Upstash Redis DB; set the two env vars. |
