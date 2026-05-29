# CMS Migration Path — Swapping MDX for Sanity or Payload

Today, content is **file-based MDX** in `/content`, parsed at build time. The
brief requires that a future move to a headless CMS (Sanity or Payload) be
possible **without rewriting pages**. This document is the contract that makes
that true, plus the concrete steps to execute the swap.

> **The golden rule:** pages import only from `@/lib/content`. They never read
> files, never know about MDX, and never talk to a CMS directly. As long as the
> functions in this document keep their **names, parameters, and return types**,
> the CMS swap is invisible above the seam.

---

## 1. The architecture — where the seam is

```
  Pages (insights-engine, reports-engine, home, etc.)
        │  import { getAllArticles, getArticleBySlug, MDXContent, ... }
        ▼
  ┌─────────────────────────────────────────────────────────┐
  │  src/lib/content/   ← PUBLIC API  (STABLE — the seam)     │
  │    index.ts     barrel — the only import path for pages   │
  │    types.ts     domain types + category taxonomy          │
  │    articles.ts  getAllArticles / getArticleBySlug / ...   │
  │    reports.ts   getAllReports / getReportBySlug / ...      │
  │    mdx.tsx      <MDXContent> renderer                      │
  │  ───────────────────────────────────────────────────────  │
  │    source.ts    ← SWAPPABLE INTERNALS (the data adapter)   │
  │      reads /content/*.mdx with fs + gray-matter            │
  └─────────────────────────────────────────────────────────┘
        │
        ▼
  /content/**.mdx  ←  TODAY's "CMS"        (becomes Sanity/Payload)
```

`source.ts` is the **only** module that knows content is MDX on disk.
`articles.ts` and `reports.ts` work against the parsed `RawEntry` shape it
returns. **To migrate, you reimplement `source.ts` (and the body renderer) — and
nothing above it changes.**

---

## 2. Functions whose signatures MUST NOT change

These are the public contract. A CMS migration must keep every one of them with
the same name, parameters, and return type. (Internals may change freely.)

### Articles — `src/lib/content/articles.ts`
| Function | Signature | Notes |
|----------|-----------|-------|
| `getAllArticles` | `() => ArticleMeta[]` | Published only, newest first |
| `getArticleBySlug` | `(slug: string) => Article \| null` | `null` for missing **or** draft; includes body + readingTime |
| `getArticlesByCategory` | `(categorySlug: string) => ArticleMeta[]` | By category **slug** |
| `getAllCategories` | `() => CategoryWithCount[]` | Only non-empty categories, with counts |
| `getFeaturedArticles` | `(n?: number = 3) => ArticleMeta[]` | Latest N |
| `getRelatedArticles` | `(slug: string, n?: number = 3) => ArticleMeta[]` | Same category, excludes self, backfills |

### Reports — `src/lib/content/reports.ts`
| Function | Signature | Notes |
|----------|-----------|-------|
| `getAllReports` | `() => ReportMeta[]` | Non-archived first, then newest |
| `getReportBySlug` | `(slug: string) => Report \| null` | Includes ungated body |
| `getFeaturedReport` | `() => ReportMeta \| null` | Latest non-archived |
| `getArchivedReports` | `() => ReportMeta[]` | Archived only, newest first |

### Types + taxonomy — `src/lib/content/types.ts`
`Article`, `ArticleMeta`, `Report`, `ReportMeta`, `Category`,
`CategoryWithCount`, `ReadingTime`, `SeoMeta`, plus `CATEGORIES`,
`getCategories`, `categoryFromLabel`, `categoryFromSlug`.

### Rendering — `src/lib/content/mdx.tsx`
`MDXContent({ source, components? })` — a server component that renders a body
string. See §6 for how this changes per CMS.

If a migration needs to **break** one of these signatures, that is a pages
change too — escalate it; do not do it silently.

---

## 3. Field mapping — frontmatter → CMS schema

The target schema must be able to produce the `Article`/`Report` shapes in
`types.ts`. Mapping:

### Article
| Domain field (`types.ts`) | MDX frontmatter | Sanity field (`document: post`) | Payload field (collection `articles`) |
|---------------------------|-----------------|---------------------------------|----------------------------------------|
| `title` | `title` | `title` (string) | `title` (text) |
| `slug` | `slug` / filename | `slug.current` (slug) | `slug` (text, unique) |
| `excerpt` | `excerpt` | `excerpt` (text) | `excerpt` (textarea) |
| `category` (resolved) | `category` (label) | `category` (reference → `category`) | `category` (relationship) |
| `tags[]` | `tags` | `tags[]` (array of string / refs) | `tags` (array / relationship) |
| `author` | `author` | `author` (reference → `author`) | `author` (relationship) |
| `publishedAt` | `publishedAt` | `publishedAt` (datetime) | `publishedAt` (date) |
| `updatedAt` | `updatedAt` | `_updatedAt` (auto) | `updatedAt` (auto) |
| `cover` | `cover` | `cover` (image asset) | `cover` (upload → media) |
| `coverAlt` | `coverAlt` | `cover.alt` (string on image) | `cover.alt` |
| `draft` | `draft` | published vs draft perspective | `_status` (draft/published) |
| `readingTime` | *computed* | computed on read OR stored field | computed on read OR `afterRead` hook |
| `seo.metaTitle` | `seo.metaTitle` | `seo.metaTitle` (object) | `meta.title` (group) |
| `seo.metaDescription` | `seo.metaDescription` | `seo.metaDescription` | `meta.description` |
| `seo.ogImage` | `seo.ogImage` | `seo.ogImage` (image) | `meta.image` (upload) |
| `body` | MDX body | `body` (Portable Text / rich text) | `body` (richText / Lexical) |

### Report
| Domain field | MDX frontmatter | Sanity (`document: report`) | Payload (`reports`) |
|--------------|-----------------|-----------------------------|----------------------|
| `title` | `title` | `title` | `title` |
| `slug` | `slug` | `slug.current` | `slug` |
| `quarter` | `quarter` | `quarter` (string) | `quarter` |
| `year` | `year` | `year` (number) | `year` (number) |
| `cover` / `coverAlt` | `cover` / `coverAlt` | `cover` image (+ `alt`) | `cover` upload (+ alt) |
| `summary` | `summary` | `summary` (text) | `summary` (textarea) |
| `keyFindings[]` | `keyFindings` | `keyFindings[]` (array of string) | `keyFindings` (array of text) |
| `pdf` | `pdf` | `pdf` (file asset) | `pdf` (upload → media, PDF) |
| `publishedAt` | `publishedAt` | `publishedAt` (datetime) | `publishedAt` (date) |
| `archived` | `archived` | `archived` (boolean) | `archived` (checkbox) |
| `seo.*` | `seo.*` | `seo` object | `meta` group |
| `body` | MDX body | `body` (Portable Text) | `body` (richText) |

**Category note:** today categories are a fixed code list (`CATEGORIES` in
`types.ts`) and frontmatter stores the *label*. In a CMS, model categories as
their own documents/collection with `slug` + `label` + `description`, seeded
from `CATEGORIES`. Keep `categoryFromSlug` working by reading those documents.
Do not let editors free-type category names — use a reference/relationship.

---

## 4. The migration steps (per CMS)

1. **Model the schema** above in the CMS. Seed the category list from
   `CATEGORIES`.
2. **Migrate existing content.** Write a one-off importer that reads the current
   `/content/**.mdx`, parses with gray-matter, and pushes each entry into the
   CMS (uploading cover images + PDFs as assets, converting MDX body to the
   CMS's rich-text format).
3. **Reimplement the adapter.** Replace the internals of `source.ts` (or add a
   new `source.cms.ts` and switch the import) so `readCollection` /
   `readEntry` fetch from the CMS API and return the same `RawEntry[]` shape —
   OR rewrite `articles.ts`/`reports.ts` mapping functions to consume the CMS
   client directly. Either way, the **public functions in §2 keep their
   signatures.**
4. **Swap the body renderer** (see §6).
5. **Verify** every page still type-checks and renders against the new source.
   Because pages only touch `@/lib/content`, no page edits should be required.

---

## 5. Roles (brief §12) and how they map

| Role | Can do | Sanity | Payload |
|------|--------|--------|---------|
| **Admin** | Everything: schema, users, settings, publish, delete | Administrator role | `admin` access / full access control |
| **Editor** | Create/edit/**publish** articles & reports, upload images + PDFs (alt enforced), set per-item SEO, schedule/draft, manage categories & tags. No code. | Editor role + publish action | Collection-level `create/read/update/publish`, no `delete` of others' |
| **Author** | Create/edit **own** drafts; submit for review; cannot publish | Contributor / no publish | `update`/`create` own docs, no `_status: published` write |

- **Alt-text enforcement:** make the image `alt` field **required** in the
  schema. (MDX relies on editor discipline + the checklist in EDITORIAL.md; a
  CMS can hard-enforce it.)
- **Category management:** Editors manage the category documents/collection;
  free-typing is disabled.

---

## 6. Body rendering after the swap

Today `MDXContent({ source })` compiles an MDX **string** via
`next-mdx-remote/rsc`. After migration the body is no longer an MDX string:

- **Sanity** → body is **Portable Text**. Replace `MDXContent` internals with
  `@portabletext/react`'s `<PortableText>`, mapping blocks/marks onto the same
  `components` map shape pages already pass. Keep the `MDXContent` export name
  (or rename to `<RichText>` and update the barrel — a one-line, pages-agnostic
  change since pages import from the barrel).
- **Payload** → body is **Lexical/Slate** JSON. Render with Payload's rich-text
  renderer (`@payloadcms/richtext-lexical`'s React converter), again driving the
  same `components` map.

In **all** cases the page-facing contract is unchanged: pass the report/article
`body` plus an optional `components` map to one component that returns rendered
React. Keep that contract; only its insides change.

---

## 7. Drafts, preview, and publishing

| Concern | MDX (today) | Sanity | Payload |
|---------|-------------|--------|---------|
| Draft hiding | `draft: true` excluded by `getArticleBySlug`/`getAllArticles` | Draft perspective / `_status` filtered in query | `_status: 'draft'` filtered in query |
| Preview before publish | Set `draft:false` on a branch / local | Sanity **Presentation** / draft perspective + Next draft mode | Payload **Live Preview** + Next draft mode |
| Scheduling | Manual (set `publishedAt`, flip draft) | Scheduled publishing add-on | `publishedAt` + scheduled job / hook |
| Revalidation | Build-time (SSG) / ISR | Webhook → Next `revalidatePath`/tag on publish | `afterChange` hook → `revalidatePath`/tag |

**Keep the draft contract:** whatever the source, `getArticleBySlug` must keep
returning `null` for unpublished content on the public site, and the listing
functions must keep excluding it. Preview/draft viewing should go through
Next.js **draft mode**, calling a draft-aware variant of the loader — added
*alongside* the public functions, never by weakening them.

---

## 8. Summary checklist for the migration engineer

- [ ] Schema models every field in §3; categories are a referenced list seeded
      from `CATEGORIES`.
- [ ] Alt text is a required field.
- [ ] Importer migrated all existing `/content/**.mdx` + assets.
- [ ] `source.ts` (or the mapping in articles/reports) now reads the CMS;
      **public function signatures in §2 unchanged.**
- [ ] Body renderer swapped to the CMS's rich-text format, same `components`
      contract.
- [ ] Draft/preview goes through Next draft mode; public queries still exclude
      drafts.
- [ ] Revalidation wired to CMS publish webhooks.
- [ ] Roles configured (Admin/Editor/Author) per §5.
- [ ] `npm run build` + `npx tsc --noEmit` clean with **zero page edits.**
