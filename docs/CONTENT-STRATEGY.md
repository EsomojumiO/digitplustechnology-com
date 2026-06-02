# Content & SEO Strategy — digitplustechnology.com

How Digitplus ranks organically in Nigeria and builds topical authority. Owns: the
editorial calendar, keyword map, and the rules that keep the content engine compounding.

> Lane reminder: this site is **authority / top-of-funnel** (strategy, guidance, policy for
> B2B decision-makers). Product buying guides ("best laptop", "new vs refurbished") belong
> on the **thedigitplus.com** store — never here. See `docs/EDITORIAL.md`.

## 1. How ranking actually happens here (the model)
1. **Topic clusters** — each service/industry is a "pillar"; supporting articles link up to it.
   Internal links pass authority to the pages that convert (services/industries).
2. **Depth + breadth** — 30+ articles across all 7 categories signal subject authority.
3. **E-E-A-T** — clear authorship (add real named experts in `src/data/authors.ts`), truthful
   claims, and original data (the quarterly report) earn trust + links.
4. **Freshness + cadence** — publish on a steady schedule; refresh top pages quarterly.
5. **Off-page** — promote the report to press/partners for backlinks (the single biggest lever).

## 2. Primary keyword map (Nigeria intent)
Targets are already woven into titles/meta/H1s. Track these in Google Search Console.

| Page / cluster | Primary keyword | Secondary / long-tail |
|---|---|---|
| Home | IT solutions company in Nigeria | IT company in Abuja; B2B IT Nigeria |
| /services/it-procurement | IT procurement Nigeria | LPO IT supply; government IT procurement; hardware sourcing |
| /services/hardware-supply | IT hardware supply Nigeria | server supply; workstation supply Abuja/Lagos |
| /services/infrastructure-solutions | IT infrastructure company Nigeria | structured cabling Lagos; server room setup; network installation |
| /services/managed-services | managed IT services Nigeria | IT support SLA; outsourced IT support |
| /services/technology-advisory | IT consulting Nigeria | IT strategy; IT roadmap; IT budgeting |
| /services/deployment-implementation | IT deployment Nigeria | installation & configuration; IT rollout |
| /industries/government | government IT procurement Nigeria | public sector IT; LPO; audit-ready IT |
| /industries/banking-financial-services | bank branch IT infrastructure | branch network; CBN/NDPR IT compliance |
| /industries/healthcare | hospital IT Nigeria | clinic IT setup; EMR infrastructure |
| /industries/education | school IT infrastructure Nigeria | campus network; university IT |
| /industries/oil-gas-energy | IT for oil and gas Nigeria | OT/IT, field connectivity |
| /reports | enterprise IT report Nigeria | Nigeria IT benchmark; IT price index |

## 3. Editorial calendar — cadence
**Target: 4 new articles/month + 1 report/quarter.** Rotate categories so every cluster stays
fresh. Suggested monthly mix:
- 1 **service-cluster** article (commercial intent — supports a /services page)
- 1 **industry deep-dive** (authority — supports a /industries page)
- 1 **how-to / checklist guide** (featured-snippet + long-tail)
- 1 **industry & policy** piece (NDPR/NITDA/CBN, trends, energy — link-worthy)

Quarterly: publish the **original-data report** (replace illustrative figures with real
Digitplus procurement/survey data — this is the backlink engine). Refresh the 3–5
top-traffic articles each quarter (update stats, dates → bump `updatedAt`).

## 4. Backlog — next 12 article ideas (Nigeria-targeted, in-lane)
1. How to write an IT requirements brief for a Nigerian RFP
2. Disaster recovery & backup planning for Nigerian businesses
3. Wi-Fi planning for large offices and warehouses
4. Choosing between on-premise, cloud, and hybrid in Nigeria
5. IT asset management and lifecycle tracking
6. Vendor SLAs vs OEM warranties — what's actually covered
7. Network segmentation basics for compliance
8. Planning IT for a new office fit-out (end to end)
9. CCTV & access control as part of IT infrastructure
10. IT onboarding/offboarding controls for staff
11. Total cost of ownership for enterprise hardware in Nigeria
12. Business continuity during grid/power instability

(Keep each 1,200–1,800 words; add to `content/insights/*.mdx` with the standard frontmatter;
non-technical staff can publish without a developer — see `docs/EDITORIAL.md`.)

## 5. On-page checklist (every new article)
- [ ] Unique H1; `metaTitle` ~50–60 chars (NO brand — the template appends it); `metaDescription` ~150–160
- [ ] Primary keyword in title, first 100 words, one H2
- [ ] 2–3 internal links UP to the relevant /services or /industries page
- [ ] 1–2 internal links across to related articles (same category)
- [ ] FAQ section (3–4 Q&A) for featured snippets
- [ ] Descriptive `coverAlt`; real cover image added to /public/images/insights
- [ ] Author set (use a real named expert where possible for E-E-A-T)
- [ ] Truthful claims only; cite real sources when quoting data

## 6. Measurement
- **Google Search Console**: submit `sitemap.xml`; track impressions/clicks/position for the §2 keywords.
- **Analytics** (Plausible/GA4): track CTA conversions (assessment requests, report downloads, WhatsApp clicks).
- **Quarterly review**: which clusters gain rankings? Double down; refresh decaying pages.
- **Google Business Profile**: keep NAP identical to `src/lib/site.ts` for local "IT company Abuja/Lagos/PH" intent.
