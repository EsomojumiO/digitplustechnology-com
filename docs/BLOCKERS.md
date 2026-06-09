# Blockers — Inputs Needed From Client

These do not stop the build (we use clearly-labelled placeholders), but must be supplied before launch.

| # | Item | Placeholder used | Where to replace |
|---|------|------------------|------------------|
| 1 | ~~Full brand kit (logo variants, colors, fonts, spacing)~~ ✅ **RESOLVED** | Official Pishon kit applied: Forest Green/Ember Red/Cream palette, Montserrat+Inter, real logos in `public/brand/` | `src/app/globals.css` tokens |
| 2 | Authorized-reseller confirmation per partner logo (Microsoft, HP, Dell, Cisco, Lenovo, Fortinet) | Monochrome text/SVG placeholder logos in trust strip | `src/components/ui/TrustStrip` + `/public/logos` |
| 3 | Real, attributable testimonials / named case studies | 3 illustrative testimonials in `src/data/testimonials.ts` | that file |
| 4 | Canonical contact identity + stray-domain decisions (digitplus.tech, alt numbers/emails) | hello@digitplustechnology.com / +234 803 786 8120 used everywhere; redirect map stubbed | `next.config.ts` redirects + NAP constants |
| 5 | CRM + email-marketing platform choice | Stub adapters (log + succeed) behind `src/lib/integrations` | env vars in `.env.example` |
| 6 | Quarterly-report original data source | 1 sample report + placeholder PDF in `/public` | `content/reports/*` |
| 7 | Final Privacy Policy + Terms content | Drafted placeholder legal copy clearly marked "DRAFT — counsel review required" | `/privacy`, `/terms` pages |
| 8 | High-quality photography of real projects/team | next/image placeholders w/ alt text | throughout marketing pages |
| 9 | Real **partner** logo files (Microsoft, HP, Dell, Cisco, Lenovo, Fortinet) | ✅ Official SVGs added in `/public/logos`, wired into TrustStrip + TrustMarquee (forced uniform white). **Reseller authorization per brand still required before public use.** | `/public/logos`, `src/components/ui/TrustStrip`, `src/components/home/TrustMarquee` |
| 10 | Real quarterly-report PDF (original data) | Minimal valid placeholder PDF | `public/reports/nigeria-enterprise-it-hardware-price-index-q2-2026.pdf` — replace with the real original-data report before launch |
| 11 | Cover/inline imagery for insights + reports | ✅ **Insights covers done** — all 33 sourced from Unsplash (license: free commercial, no attribution required), 1600×900 JPEG in `public/images/insights/`; photographer credits saved in `public/images/insights/CREDITS.json` (optional use). Topic-matched on concept (not Nigeria-specific stock). **Reports covers still pending** (`public/images/reports/<slug>.jpg`). | swap any specific insight cover by replacing the file; supply report covers |

> ⚠️ **Update 2026-06-05:** **19 new content-engine drafts** (dated 2026-06, all `draft:true`) reference cover images that do **not** yet exist (`public/images/insights/<slug>.jpg`). There is no auto-fetcher script or Unsplash API key in the repo — the existing 33 covers were hand-curated. For each, curate one Unsplash image (1600×900 JPEG, license: free commercial), save it at `public/images/insights/<slug>.jpg`, and add a `CREDITS.json` entry. **These drafts cannot be published (flip `draft:false`) until their covers exist — the `cover:` paths currently 404.**
>
> List the slugs still needing covers at any time with:
> ```bash
> # drafts whose cover file is missing
> for f in content/insights/*.mdx; do s=$(basename "$f" .mdx); \
>   [ -f "public/images/insights/$s.jpg" ] || echo "$s"; done
> ```

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
| 16 | ~~**Lead persistence — needs a real DB**~~ ✅ **WIRED (env-gated)** | `store.persist()` does a Supabase REST insert when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set; in-memory fallback otherwise. | Set the two env vars; run `supabase/migrations/0001_leads.sql`. |
| 17 | ~~**Rate limiting — needs a shared store**~~ ✅ **WIRED (env-gated)** | `rate-limit.ts` uses Upstash Redis (atomic EVAL window) when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set; in-memory fallback otherwise; fails open. | Create a free Upstash Redis DB; set the two env vars. |
