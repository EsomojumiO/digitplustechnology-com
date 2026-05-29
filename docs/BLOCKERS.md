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
