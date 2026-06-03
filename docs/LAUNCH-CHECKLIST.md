# Launch Checklist — digitplustechnology.com

Status of everything needed to go from "build-complete" to "live in production".
Updated 2026-06-02.

## ✅ Done (in the codebase)
- Multi-page SSG/ISR site; dark-only forest-green theme; motion system + network motif.
- SEO: per-page meta, JSON-LD (Org/WebSite/Service/Article/Breadcrumb/FAQ/LocalBusiness),
  sitemap.xml (70 URLs), robots.txt, clean URLs, canonicals, single-brand titles.
- Content engine: **33 articles across all 7 categories** + **2 reports** (1 benchmark draft).
- **E-E-A-T**: author registry, bylines, author-bio cards, author schema.
- **CTA system**: primary + contextual CTAs site-wide.
- **Integrations wired (live on env key)**: Resend (email), Brevo (marketing), HubSpot +
  webhook (CRM), Plausible (analytics). Stub fallback when keys absent.
- Forms: validation, honeypot, rate-limit (in-memory).
- Legal: Privacy (NDPA/NDPR-aware) + Terms (Nigeria governing law) — **DRAFT, pending counsel**.

## 📊 Lighthouse baseline (local, mobile, production build)
| Page | Performance | Accessibility | Best Practices | SEO |
|------|:-:|:-:|:-:|:-:|
| Home (with canvas motif) | **90** | 97 | 96 | **100** |
| Article (insights) | **90** | 92 | — | **100** |

Meets the targets (Perf ≥90, SEO ≥95). Re-run on the deployed staging URL with real images
and run **axe** for full WCAG AA (article a11y 92 → check muted-text contrast + link names).

## ⛔ Pending — needs the client / external accounts
**Integrations (5-minute each once you have accounts)**
- [ ] `RESEND_API_KEY` (+ verify sending domain) — lead notification emails
- [ ] `MARKETING_API_KEY` + `MARKETING_LIST_ID` (Brevo) — newsletter/report list
- [ ] `CRM_WEBHOOK_URL` or `CRM_API_KEY` (HubSpot) — lead sync
- [ ] `NEXT_PUBLIC_ANALYTICS` = domain (Plausible) — analytics + event tracking

**Infrastructure** (code complete — activate with env)
- [x] **Lead persistence → Supabase** — WIRED via REST in `src/lib/integrations/store.ts`.
      Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` and run
      `supabase/migrations/0001_leads.sql`. Falls back to in-memory if unset.
- [x] **Rate-limiting → Upstash Redis** — WIRED via REST in
      `src/lib/integrations/rate-limit.ts`. Set `UPSTASH_REDIS_REST_URL` +
      `UPSTASH_REDIS_REST_TOKEN`. Falls back to in-memory if unset; fails open.

**Assets & trust**
- [x] Partner-logo files — official SVGs in `/public/logos` (Microsoft/HP/Dell/Cisco/
      Lenovo/Fortinet), wired into TrustStrip + TrustMarquee (forced uniform white).
      ⚠️ STILL NEEDS reseller **authorization** per brand before public use.
- [ ] Real, attributable testimonials / named case studies
- [ ] Real project/team photography (replace /public/images placeholders)
- [ ] Real **named expert authors** in `src/data/authors.ts` (stronger E-E-A-T)
- [ ] Real **report data** — replace the benchmark report's illustrative figures

**Legal**
- [ ] Privacy + Terms reviewed and signed off by counsel; NDPC registration if applicable

**Deploy & SEO ops**
- [ ] Deploy to Vercel on the canonical domain over HTTPS; set env vars
- [x] App-level `www → non-www` + `digitplus.tech → canonical` 308s in `next.config.ts`
      (`digitplus.tech` rule fires once that domain is attached to the Vercel project)
- [ ] Verify in **Google Search Console**; submit `sitemap.xml`
- [ ] **Google Business Profile** — NAP identical to `src/lib/site.ts`
- [ ] Confirm 301s from old single-page anchors are live
- [ ] Final favicon/OG check; re-run Lighthouse + axe on staging

## Recommended go-live order
1. Deploy to staging (Vercel) → 2. Add integration keys → 3. Wire DB + rate-limit →
4. Swap real assets/authors → 5. Counsel sign-off on legal → 6. GSC + GBP →
7. Lighthouse/axe on staging → 8. Point canonical domain + redirects → launch.
