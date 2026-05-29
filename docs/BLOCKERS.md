# Blockers — Inputs Needed From Client

These do not stop the build (we use clearly-labelled placeholders), but must be supplied before launch.

| # | Item | Placeholder used | Where to replace |
|---|------|------------------|------------------|
| 1 | Full brand kit (logo variants, colors, fonts, spacing) | Neutral ramp + single accent token; Inter font | `src/app/globals.css` `@theme` tokens; `/public` logos |
| 2 | Authorized-reseller confirmation per partner logo (Microsoft, HP, Dell, Cisco, Lenovo, Fortinet) | Monochrome text/SVG placeholder logos in trust strip | `src/components/ui/TrustStrip` + `/public/logos` |
| 3 | Real, attributable testimonials / named case studies | 3 illustrative testimonials in `src/data/testimonials.ts` | that file |
| 4 | Canonical contact identity + stray-domain decisions (digitplus.tech, alt numbers/emails) | hello@digitplustechnology.com / +234 803 786 8120 used everywhere; redirect map stubbed | `next.config.ts` redirects + NAP constants |
| 5 | CRM + email-marketing platform choice | Stub adapters (log + succeed) behind `src/lib/integrations` | env vars in `.env.example` |
| 6 | Quarterly-report original data source | 1 sample report + placeholder PDF in `/public` | `content/reports/*` |
| 7 | Final Privacy Policy + Terms content | Drafted placeholder legal copy clearly marked "DRAFT — counsel review required" | `/privacy`, `/terms` pages |
| 8 | High-quality photography of real projects/team | next/image placeholders w/ alt text | throughout marketing pages |
| 9 | Real brand/partner logo image files | text-based logo placeholders | `/public` |
| 10 | Real quarterly-report PDF (original data) | Minimal valid placeholder PDF | `public/reports/nigeria-enterprise-it-hardware-price-index-q2-2026.pdf` — replace with the real original-data report before launch |
| 11 | Cover/inline imagery for insights + reports | Referenced paths only (files absent) | `public/images/insights/<slug>.jpg`, `public/images/reports/<slug>.jpg` — supply real, optimized images with the alt text already in frontmatter |

## Forms & integrations — stubbed pending decisions

All lead-capture integrations ship as **stub adapters** that validate, log to the
server console, and return success when env is absent (see `.env.example`). They swap
to real providers via env only — no code changes. Confirm/supply before launch:

| # | Item | Current state | Where to enable |
|---|------|---------------|-----------------|
| 12 | **Email provider** for internal lead notifications to hello@ | Stub (console log). | Set `RESEND_API_KEY` (recommended) or `SMTP_*`; implement the marked TODO in `src/lib/integrations/email.ts`; add `resend`/`nodemailer` to deps. |
| 13 | **Email-marketing platform** (Brevo / Mailchimp / similar) | Stub. | Set `MARKETING_API_KEY` + `MARKETING_LIST_ID`; implement TODO in `src/lib/integrations/marketing.ts`. |
| 14 | **CRM** (client CRM or HubSpot free tier) | Stub. Generic webhook path runs as-is once set. | Set `CRM_WEBHOOK_URL` (simplest) or `CRM_API_KEY`; implement TODO in `src/lib/integrations/crm.ts`. |
| 15 | **Analytics platform** (Plausible / Fathom / GA4) | `track()` no-ops until enabled. | Set `NEXT_PUBLIC_ANALYTICS`; wire provider call in `src/lib/analytics.ts`. |
| 16 | **Lead persistence — needs a real DB** | `src/lib/integrations/store.ts` is in-memory + console only; per-instance and wiped on every cold start/redeploy. Leads are NOT durably stored. | Replace `record()` with a DB insert (e.g. Postgres/Supabase) or a queue publish. |
| 17 | **Rate limiting — needs a shared store** | `src/lib/integrations/rate-limit.ts` is in-memory fixed-window (5 req / 60s / IP per endpoint). Per-instance only; serverless instances each keep their own window and cold starts reset it — best-effort only. | Move to a shared store (Upstash Redis / `@upstash/ratelimit`). |
