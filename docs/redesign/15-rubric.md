# 15 — Apple rubric scores (Phase 5)

Scored after the shortlist photography landed (`bab736d`) and the two-tone
refactor (`584a1f8`). Dimensions: **whitespace · hierarchy · colour restraint ·
imagery · motion restraint · template consistency with siblings.** Exit bar: every
page ≥ 8/10.

## The imagery dimension: N/A is a real score, not a dodge

Legal and transactional pages are **imageless by design**, so imagery scores
**N/A** and the page is scored out of the remaining dimensions. Putting a stock
photograph on a privacy policy would be decoration with no informational job —
it would *lower* the Apple score, not raise it. Apple's own legal pages carry no
photography.

N/A applies to: `/privacy`, `/terms`, `/contact`, `/404`.
It does **not** apply to marketing pages, where absent imagery is a defect.

## Scores

| Route | White | Hier | Colour | Imagery | Motion | Consist | Score | Review |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| `/` | 9 | 9 | 9 | 8 | 9 | 9 | **9** | full visual |
| `/about` | 8 | 9 | 9 | 8 | 8 | 9 | **8** | full visual |
| `/services` | 9 | 9 | 9 | 7 | 8 | 9 | **8** | full visual |
| `/services/[slug]` | 8 | 9 | 9 | 8 | 8 | 9 | **8** | full visual |
| `/industries/[slug]` | 8 | 9 | 9 | 8 | 8 | 9 | **8** | full visual |
| `/locations/[city]` | 8 | 9 | 9 | 7 | 8 | 9 | **8** | full visual |
| `/insights` | 9 | 9 | 9 | 9 | 8 | 9 | **9** | full visual |
| `/contact` | 9 | 9 | 9 | N/A | 8 | 9 | **9** | full visual |
| `/privacy` | 9 | 9 | 9 | N/A | N/A | 9 | **9** | full visual |
| `/industries` | 8 | 9 | 9 | 8 | 8 | 9 | **8** | structural + gates |
| `/locations` | 8 | 9 | 9 | 7 | 8 | 9 | **8** | structural + gates |
| `/approach` | 8 | 9 | 9 | 7 | 8 | 9 | **8** | structural + gates |
| `/ecosystem` | 8 | 9 | 9 | 7 | 8 | 9 | **8** | structural + gates |
| `/reports` | 8 | 9 | 9 | 7 | 8 | 9 | **8** | structural + gates |
| `/terms` | 9 | 9 | 9 | N/A | N/A | 9 | **9** | structural + gates |

**Nothing scores below 8.** Both gates are green across all 15 routes
(conformance PASS, axe 0 violations), which is what carries the "structural +
gates" rows: those five were scored from measured signals — band sequence, real
image count, heading hierarchy, orange-fill count, contrast — rather than a
full-page visual read. Flagged as such rather than presented as equivalent
evidence.

## What holds the marketing pages at 8 rather than 9

**Imagery is interim stock, not the client's own photography.** Every marketing
page now has a real photograph (blocker #8 partially discharged), and they're
bright and full-colour as the light canvas requires. But they're generic
Unsplash frames — the "generic stock" tell is exactly what an Apple rubric
punishes. Real project/team photography is what moves these to 9. Still tracked
in `docs/BLOCKERS.md` #8 and `PLACEHOLDERS.md` §5.

**`/locations/*` and `/services` sit at 7 on imagery.** The Abuja frame is a
cropped welcome-sign rather than a cityscape; `/services` (the hub) has no image
of its own, only the six cards. Both are asset choices, not code.

**`/about` whitespace is 8, not 9.** The lede → first-heading distance is 439px.
That is now *band air* — the white hero alternates into the `#f5f5f7` prose band,
and the padding belongs to the band transition rather than being a void between
two identical whites (client-accepted, no spacing change). It's still the widest
gap on the site.

## Standing risks

- **Partner logos are single dark ink**, not real full-colour marks — flat, and
  reads generic rather than as a credible named-partner roster. Blocked on assets
  + reseller authorisation (`PLACEHOLDERS.md` §5).
- **Testimonials are role-attributed placeholders**, not real client quotes.
- **City-photo accuracy is unverified by me.** The location frames came from each
  city's Unsplash search and are verified *live*, not verified *accurate*. A photo
  of the wrong city on a location page is a factual claim, not a design detail.
  Client check in progress.
