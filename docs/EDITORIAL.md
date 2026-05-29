# Editorial Guide — Insights & Reports

This guide is for the people who **write and publish content** on
digitplustechnology.com. You do not need to be a developer to use it. It covers
what belongs here, how to add an article or a report, and the rules that keep
our content findable, accessible, and on-brand.

If you can edit a text file and follow a template, you can publish.

---

## 1. The content lane (read this first)

We run **two** web properties on purpose:

- **digitplustechnology.com (this site)** — our authority and credibility
  engine. Top-of-funnel, strategic content for decision-makers.
- **thedigitplus.com** — the online store. Product listings, prices, buying.

**The rule:** content here is **authority and strategy**, never product selling.

| Belongs here (authority / top-of-funnel) | Belongs on the store, NOT here |
|------------------------------------------|--------------------------------|
| "How to structure a multi-site IT refresh" | "Best laptops to buy in 2026" |
| "What banks should budget for branch infrastructure" | "HP vs Dell: which to buy" |
| "Building an audit-ready procurement process" | "Top 5 UPS units under ₦X" |
| Sector trends, policy, planning, strategy | Product comparisons, prices, "buy now" |

A simple test: **if the natural next step for the reader is to *buy a specific
product*, it belongs on the store.** If the next step is to *think differently,
plan better, or talk to us*, it belongs here.

When in doubt, write for the IT director planning a budget — not the person
adding an item to a cart.

---

## 2. Categories (the fixed list)

Every article has exactly **one** category, chosen from this fixed list. Use the
label **exactly** as written (including the `&` and spacing):

| Category label | Use it for |
|----------------|------------|
| `IT Strategy & Advisory` | Planning, budgeting, roadmaps, decision-making |
| `Infrastructure` | Cabling, networks, server rooms, power, uptime |
| `Procurement` | Sourcing, vendor accountability, LPO, audit-ready buying |
| `Cybersecurity` | Security posture, risk, resilience, compliance |
| `Managed Services` | SLAs, monitoring, support models |
| `Industry & Policy` | Regulation, sector trends, market shifts |
| `Guides` | Step-by-step, vendor-neutral how-to (strategy, not products) |

To add a **new** category you do need a developer (it is a one-line change in
`src/lib/content/types.ts`). Do not invent category labels in frontmatter — an
unknown category quietly falls back to **Guides**.

---

## 3. How to add an article

### Step 1 — Create the file
Add a new file in `content/insights/`. The **file name becomes the URL**, so use
lowercase words separated by hyphens, ending in `.mdx`:

```
content/insights/choosing-a-managed-services-partner.mdx
```

That publishes at `/insights/choosing-a-managed-services-partner`.

### Step 2 — Fill in the frontmatter
The block at the top between the `---` lines is the **frontmatter** — the
article's settings. Copy this template and fill every field:

```yaml
---
title: "Choosing a Managed Services Partner: Five Questions to Ask"
slug: "choosing-a-managed-services-partner"   # MUST match the file name
excerpt: "A short, plain summary shown on cards and in search results. 1–2 sentences."
category: "Managed Services"                    # exactly one label from the list above
tags:
  - "managed services"
  - "SLA"
  - "vendor selection"
author: "Digitplus Technology"
publishedAt: "2026-06-01"                        # YYYY-MM-DD
updatedAt: "2026-06-01"                          # set when you revise it later
cover: "/images/insights/choosing-a-managed-services-partner.jpg"
coverAlt: "Describe the cover image for someone who cannot see it"
draft: false                                     # true = hidden; false = live
seo:
  metaTitle: "Choosing a Managed Services Partner | Digitplus"
  metaDescription: "Up to ~155 characters. Used by Google and social previews."
  ogImage: "/images/insights/choosing-a-managed-services-partner.jpg"
---
```

### Step 3 — Write the body
Below the closing `---`, write the article in **Markdown**:

- `## Heading` is a section heading (H2). `### Sub-heading` is an H3.
  **Start sections at `##`** — the article title is already the H1; never use a
  single `#`.
- Leave a blank line between paragraphs.
- A **pull quote** is a line beginning with `>`. Use one or two per article to
  surface a strong sentence.
- A **link** looks like `[the words you see](/the/url)`. Always link to at least
  one relevant `/services/...` or `/industries/...` page.
- Bullet lists use `-`; numbered lists use `1.` `2.` `3.`.

Reading time is calculated automatically — you do not set it.

### Article length
Aim for **600–1,000+ words** of substantive prose. We publish fewer, better
pieces, not filler.

---

## 4. How to add a report

Reports live in `content/reports/` and work the same way, with a different
frontmatter shape. A report has a **public, ungated preview** (everything you
write in the body, plus the key findings) and a **gated PDF** (the full thing,
delivered after someone fills in the download form).

### Step 1 — The PDF
Save the full report PDF in `public/reports/` using the same slug:

```
public/reports/nigeria-enterprise-it-hardware-price-index-q3-2026.pdf
```

### Step 2 — The frontmatter
```yaml
---
title: "Nigeria Enterprise IT Hardware Price Index — Q3 2026"
slug: "nigeria-enterprise-it-hardware-price-index-q3-2026"  # matches file name
quarter: "Q3"
year: 2026
cover: "/images/reports/nigeria-enterprise-it-hardware-price-index-q3-2026.jpg"
coverAlt: "Describe the cover for someone who cannot see it"
summary: "One short paragraph teaser, shown on the reports hub and in search."
keyFindings:
  - "A short, standalone takeaway. These are PUBLIC and indexable."
  - "Write 3–6 of them. Each should make sense on its own."
  - "Do not put the full findings here — leave the detail for the PDF."
pdf: "/reports/nigeria-enterprise-it-hardware-price-index-q3-2026.pdf"
publishedAt: "2026-08-20"
archived: false        # set true on old reports so they move to the archive
seo:
  metaTitle: "..."
  metaDescription: "..."
  ogImage: "/images/reports/..."
---
```

### Step 3 — The body
Write the **ungated narrative preview** below the frontmatter — enough to be
genuinely useful and citable, ending with an invitation to download the full
report. Do not give away the entire dataset; the body is the shop window, the
PDF is the product.

**Archiving:** when a newer report comes out, set the old one's `archived: true`.
It stays online (good for SEO and links) but moves out of the "featured/latest"
slot into the archive grid.

---

## 5. Images and alt text (required)

- Save cover images under `public/images/insights/` or
  `public/images/reports/`, named to match the slug, ending `.jpg` (or `.webp`).
- **`coverAlt` is mandatory.** Write a plain description of what the image shows,
  for readers using a screen reader and for search engines. Describe the
  content, not the file ("A bank branch server room with a UPS and network
  rack"), not ("image1.jpg" or "cover photo").
- If the real image is not ready yet, still fill in `cover` and `coverAlt` with
  the intended path and description — the page will show a placeholder until the
  file is added. (Missing imagery is tracked in `docs/BLOCKERS.md`.)

---

## 6. SEO fields — what to put where

| Field | What it does | Good practice |
|-------|--------------|---------------|
| `title` | The article/report H1 + default tab title | Clear, specific, no clickbait |
| `excerpt` / `summary` | Card text + fallback description | 1–2 plain sentences |
| `seo.metaTitle` | Overrides the browser-tab/Google title | ~60 chars; add `| Digitplus` |
| `seo.metaDescription` | The grey text under the Google result | ~150–155 chars; describe the value |
| `seo.ogImage` | Image shown when shared on social | Usually the same as `cover` |
| `tags` | Topic grouping (not URLs) | 3–6 lowercase tags |

If you leave the `seo` block out, the page sensibly falls back to the `title`
and `excerpt`. Filling it in gives you control — use it for important pieces.

---

## 7. Draft workflow

- Set `draft: true` while you are still working. The article is **completely
  hidden** from the live site — no listing, no URL, no search.
- Set `draft: false` when it is ready to publish.
- To **revise** a published article, edit it and bump `updatedAt` to today's
  date. Leave `publishedAt` as the original publish date.

(Reports do not have a draft flag — keep an in-progress report's file out of
`content/reports/` until it is ready, or use `archived: true` if it should exist
but stay out of the spotlight.)

---

## 8. Quick checklist before you publish

- [ ] File is in the right folder (`content/insights/` or `content/reports/`)
- [ ] File name = slug, lowercase-with-hyphens, ends `.mdx`
- [ ] `slug` in frontmatter matches the file name
- [ ] Category label is **exactly** one from the fixed list (articles)
- [ ] `coverAlt` describes the image
- [ ] At least one internal link to a `/services` or `/industries` page (articles)
- [ ] It is **authority/strategy**, not a product buying guide
- [ ] `draft: false` (article) / PDF saved in `public/reports/` (report)
- [ ] `metaDescription` reads well as a search result
