# 10 — Consistency & Design-System Audit (dark-raycast)

_Branch: `redesign/dark-raycast`. Date: 2026-07-12. Method: static read-only review of the
`@theme` token layer (`globals.css`), every `src/components/ui/*`, and every route under
`src/app/(marketing)/**`, `src/app/insights/**`, `src/app/reports/**`, `src/app/page.tsx`,
plus the shared card/list components they compose. No builds run. Canonical references:
CLAUDE.md button system + `docs/redesign/05-dark-audit.md` (green = structural ink /
links / eyebrows / numbers / icons; orange = single primary-CTA **fill** only, dark label;
"accent colours as body text" is banned)._

## Summary

**Total defects: 27** — Buttons: 9 (D1–D9) · Colors: 8 (D10–D17) · Typography: 2 (D18–D19)
· Templates: 3 (D20–D22) · Spacing: 2 (D23–D24) · States: 3 (D25–D27).

Highest-impact themes: (1) the **secondary + ghost Button variants do not match the
canonical spec**; (2) **orange (`--accent`) is used as ink pervasively** for links, arrows,
numbers and eyebrows where the spec mandates green; (3) **one contact/quote CTA intent ships
under 8+ different labels**; (4) two genuine functional bugs — an unrendered CTA button and a
broken focus-ring token.

Clean / verified-good (not defects): heading order (no h1→h3 skips found); the "testimonial
display-font" bug is **NOT present** — `Testimonial.tsx` correctly sets the quote in the body
face at 19px, not the display face; focus rings are green and consistent everywhere **except**
D25; the six `services/[slug]` and eight `industries/[slug]` items each render from a single
shared template (no per-item conditional block divergence within a family).

---

## Buttons

| # | File:line | Element | Current state | Canonical state | Sev |
|---|---|---|---|---|---|
| D1 | `components/ui/Button.tsx:20` | `secondary` variant | Filled surface `bg-surface-raised text-text border border-hairline` (0.08 border) | Transparent bg, hairline border white/0.14, WHITE text, border brightens on hover | High |
| D2 | `components/ui/Button.tsx:21` | `ghost` variant | Neutral white `bg-transparent text-text hover:bg-surface` — no green, no underline; the `.link-underline` utility in globals.css is **never used** | GHOST/LINK = green (`--accent-green`) text with animated underline | High |
| D3 | `services/[slug]/page.tsx:264`, `industries/[slug]/page.tsx:193`, `insights/[slug]/page.tsx:289`, `industries/page.tsx:62`, `insights/category/[category]/page.tsx:111`, `about/page.tsx:197`, `approach/page.tsx:63`, `ecosystem/page.tsx:136` | Primary contact/quote CTA label | 8+ variants for ONE intent: "Get a quote", "Get a quote for {title}", "Talk to our {title} team", "Book a Consultation", "Talk to an Expert", "Partner with Digitplus", "Start with a discovery call", "Request an assessment" | One label per intent sitewide (canonical elsewhere: "Get a quote") | High |
| D4 | `insights/[slug]/page.tsx:289`, `industries/page.tsx:62`, `ecosystem/page.tsx:136` | CTA casing | Title Case ("Book a Consultation", "Talk to an Expert", "Request an assessment") | Sentence case ("Get a quote", "See how we work") | Med |
| D5 | `ecosystem/page.tsx:135` | Closing CTA button | Button passed as CTABand **`children`**; `CTABand` renders only the `actions` prop, so the button is **silently dropped and never rendered** — the ecosystem page has no working CTA | Pass button via `actions={…}` like every other CTABand | High |
| D6 | `services/[slug]/page.tsx:264` vs `industries/[slug]/page.tsx:193` | Parallel detail-template closing CTA | Service = "Get a quote for {title}"; Industry = "Talk to our {title} team" — sibling templates diverge | Identical CTA pattern across the detail-page family | Med |
| D7 | `page.tsx:146,285`, `services/[slug]/page.tsx:117`, `industries/[slug]/page.tsx:102`, `insights/category/[category]/page.tsx:101` | Secondary/nav "see all" CTA | Mixed phrasing + arrows: "View all services →", "All insights →" (ghost, trailing →) vs "All services"/"All industries" (secondary, none) vs "All insights" (leading ←) | One phrasing + arrow convention | Low |
| D8 | `page.tsx:369` / `contact/page.tsx:118` / `contact/page.tsx:103` | WhatsApp CTA | "Chat on WhatsApp" vs "Chat with us on WhatsApp" vs "Message us on WhatsApp" | One WhatsApp label | Low |
| D9 | `locations/page.tsx:46`, `ecosystem/page.tsx:88` | Card-as-link | Raw `<a>`/`<article>` re-implement the card recipe (border/hover/focus) inline instead of composing `Card`/`ServiceCard` | Compose the shared card component | Med |

## Colors

| # | File:line | Element | Current state | Canonical state | Sev |
|---|---|---|---|---|---|
| D10 | `services/[slug]/page.tsx:103`, `components/ui/Prose.tsx:34`, `contact/page.tsx:82,90,98`, `locations/{abuja,lagos,port-harcourt}/page.tsx:104,108`, `insights/[slug]/page.tsx:252`, `components/layout/CookieConsent.tsx:85` | Text / links | Orange `text-accent` used as ink — service tagline as orange body text; MDX, contact, location and article links all orange | Orange is a FILL only; links/ink use green (`--accent-green`) | High |
| D11 | `components/ui/ProcessStep.tsx:25`, `approach/_components/ProcessTimeline.tsx:87`, `reports/[slug]/page.tsx:161`, `components/home/WhyPillar.tsx:21`, `insights/_components/AuthorBio.tsx:31`, `components/ui/ServiceCard.tsx:57,63`, `components/ui/IndustryCard.tsx:24,55`, `reports/_components/ReportCard.tsx:107,158`, `locations/page.tsx:59`, `ArticleCard.tsx:62`, `insights/page.tsx:116` | Numbers / eyebrows / arrows / icons | Orange `text-accent` for step numbers, key-finding numbers, "eyebrow" labels, card arrows/icons and hover states | Per 05-audit these are the GREEN structural accent, not orange | High |
| D12 | `components/layout/Footer.tsx:53` | Focus ring | `focus-visible:outline-accent-green-300` — no such token exists (theme has only `--color-accent-green`) → utility is invalid, store link has **no visible focus ring** | `outline-accent-green` (valid green ring) | High |
| D13 | `components/layout/Footer.tsx:54` | Store link text | `text-accent-300` = `#e08d6e` (legacy Ember ramp) — a DIFFERENT orange than `--accent` `#ff8a3d`, and orange-as-ink | Green ink; single orange value from tokens | Med |
| D14 | `app/opengraph-image.tsx:19-22` | OG image palette | Hardcodes retired cream-theme hex: `ACCENT="#c75334"`, `CREAM="#f7f1e0"`, `BRAND="#20493b"`, `MUTED="#a8c2b3"` — off-brand vs the shipped dark tokens (accent is now `#ff8a3d`, canvas `#060707`) | Dark-theme token values | Med |
| D15 | home hero / list grids (systemic, from D10/D11) | >1 orange per viewport | Orange primary CTA co-occurs with orange arrows / numbers / category badges in the same viewport (e.g. home hero button + orange-tinted `Badge tone="accent"` cards) | Max ONE orange element per viewport | Med |
| D16 | `insights/_components/ArticleCard.tsx:34`, `reports/_components/ReportCard.tsx:81,136`, `components/home/ContentShelf.tsx:21`, `ProcessTimeline.tsx:87` | Card hover border | `hover:border-accent/40` (orange-tinted) vs `Card`/`ServiceCard`/`IndustryCard` using neutral `hover:border-hairline-hover` | One hover-border treatment (hairline-hover); no orange | Med |
| D17 | `page.tsx:178`, `approach/page.tsx:49`, `about/page.tsx:181` | Eyebrow on inverse band | `<Eyebrow className="text-neutral-400">` hardcodes a neutral hex-ramp value, overriding the green | Semantic muted token; not a raw neutral ramp | Low |

## Typography

| # | File:line | Element | Current state | Canonical state | Sev |
|---|---|---|---|---|---|
| D18 | `components/ui/Testimonial.tsx:30,36,39`, `components/ui/FeatureImage.tsx:69` | Font sizes | Rogue px outside the `--type-*` scale: `text-[19px]` (≈`text-body-lg`), `text-[14px]`, `text-[13px]` (≈`text-small`), `text-[11px]` (below `text-caption`) | Use the modular `text-*` scale tokens | Med |
| D19 | `components/ui/Eyebrow.tsx` (`index` prop) vs `page.tsx:82,319` | Eyebrow index convention | The canonical `LABEL · 01` zero-padded index is built into `Eyebrow` but used **nowhere**; instead middot+text is done ad hoc ("Enterprise IT · Nigeria", "Featured report · Q3 2026") | Consistent eyebrow index usage (or remove the unused convention) | Low |

## Templates

| # | File:line | Element | Current state | Canonical state | Sev |
|---|---|---|---|---|---|
| D20 | `services/[slug]/page.tsx:103` vs `industries/[slug]/page.tsx` | Detail-intro blocks | Service intro renders a `tagline` line (orange); Industry intro has no equivalent block — the two sibling detail templates differ by one section | Documented, expected divergence or aligned block set | Low |
| D21 | `locations/abuja/page.tsx:53` vs `locations/lagos/page.tsx:53` / `port-harcourt:53` | Role badge | Abuja hardcodes `Badge tone="accent"`, Lagos/PH hardcode `tone="neutral"` — the three separate location files hardcode the tone rather than deriving from `loc.role` (as `locations/page.tsx:52` does) | Derive tone from data so the three files can't drift | Low |
| D22 | `services/[slug]/page.tsx:263` & `industries/[slug]/page.tsx:192` | Closing CTA variant | Detail closing CTAs use `variant="secondary"` on the green `inverse` CTABand — no page's strongest CTA moment carries the primary orange | Confirm intent: primary orange belongs in the closing band | Low |

## Spacing

| # | File:line | Element | Current state | Canonical state | Sev |
|---|---|---|---|---|---|
| D23 | `ecosystem/page.tsx:90` (vs `components/ui/Card.tsx:33`) | Card radius | Ecosystem card `rounded-2xl` (24px); `AuthorBio.tsx:20`, `FeatureImage.tsx:39`, `CookieConsent.tsx:74`, `Header.tsx:393` use `rounded-xl` (24? →16/24) — cards/surfaces do not share the `Card` standard `rounded-lg` (16px) | One card radius token | Med |
| D24 | `locations/{city}/page.tsx:88` (`padding="md"`) vs `services/[slug]/page.tsx:144` (`padding="lg"`); grids `gap="md"` (services) vs `gap="lg"` (why/testimonials) | Card padding / grid gap | Mixed card padding and grid gaps with no documented rule; `WhyPillar`/ecosystem use raw `p-8` instead of the `padding` prop | Consistent padding + gap scale | Low |

## States

| # | File:line | Element | Current state | Canonical state | Sev |
|---|---|---|---|---|---|
| D25 | `components/layout/Footer.tsx:53` | Focus ring (a11y) | Invalid `outline-accent-green-300` token → the "Visit our store" link has no visible focus outline on dark (keyboard nav) | Visible green focus ring on every interactive element | High |
| D26 | `insights/page.tsx:101`, `insights/[slug]/page.tsx:209`, `reports/_components/ReportCard.tsx:38`, `reports/[slug]/page.tsx:128` | Image scrim | Scrim (`from-background/70…`) applied on `ArticleCard`/`FeatureImage`/`ContentShelf` and `HeroCarousel` (`/80`) but **omitted** on the insights featured image, the article hero cover and all report covers; the `.cover-dark` utility in globals.css (built to standardize this) is never applied | One scrim treatment on every dark cover | Med |
| D27 | `insights/_components/ArticleCard.tsx:34`, `reports/_components/ReportCard.tsx:81,136`, `components/home/ContentShelf.tsx:21` | Card hover lift | Content cards lift `-translate-y-1` + `shadow-lg`; `Card`/`ServiceCard`/`IndustryCard` lift `-translate-y-0.5` + `shadow-md` — two hover magnitudes | One hover elevation recipe | Med |
