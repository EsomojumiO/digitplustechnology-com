import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import {
  Section,
  SectionHeading,
  Badge,
  Eyebrow,
  Button,
  CTABand,
} from "@/components/ui";
import { ctaLabels } from "@/lib/cta";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import {
  getAllArticles,
  getFeaturedArticles,
  getAllCategories,
} from "@/lib/content";
import { ArticleCard } from "./_components/ArticleCard";
import { InsightsSearch } from "./_components/InsightsSearch";
import { formatDate, isoDate } from "./_components/format";

const PER_PAGE = 9;

export const metadata: Metadata = {
  title: "IT Insights for Nigerian Business Leaders",
  description:
    "Practical articles for IT decision-makers in Nigeria, IT strategy, procurement, infrastructure, cybersecurity, and managed services from Digitplus Technology.",
  alternates: {
    canonical: "/insights",
    types: {
      "application/rss+xml": [
        { url: "/insights/rss.xml", title: "Digitplus Technology — Insights" },
      ],
    },
  },
};

/**
 * Insights hub.
 *
 * Rendering model (crawlable-first + progressive enhancement):
 *  - The featured highlight, category filter, and the PAGINATED article grid
 *    are all server-rendered static HTML. Pagination is real (?page=N, server
 *    slice) with crawlable Prev/Next links + rel prev/next hints, so every
 *    article is reachable without JS.
 *  - The search box is a thin client island that receives the FULL article list
 *    as props. While a query is active it hides the server grid and renders a
 *    filtered grid; cleared, it defers back to the server-rendered paginated
 *    view. No JS ⇒ full paginated grid stays visible and functional.
 */
export default async function InsightsHubPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const all = getAllArticles();
  const categories = getAllCategories();
  const featured = getFeaturedArticles(1)[0] ?? all[0];

  // The grid excludes the featured highlight to avoid duplication.
  const rest = featured ? all.filter((a) => a.slug !== featured.slug) : all;

  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const requested = Number.parseInt(pageParam ?? "1", 10);
  const page =
    Number.isFinite(requested) && requested >= 1 ? requested : 1;

  // Out-of-range page numbers are a 404 (clean, no soft-404 thin pages).
  if (pageParam && (page > totalPages || `${page}` !== pageParam.trim())) {
    notFound();
  }

  const start = (page - 1) * PER_PAGE;
  const pageItems = rest.slice(start, start + PER_PAGE);

  const prevHref =
    page > 2 ? `/insights?page=${page - 1}` : page === 2 ? "/insights" : null;
  const nextHref = page < totalPages ? `/insights?page=${page + 1}` : null;

  return (
    <>
      {/* rel prev/next hints for crawlers (head links via <link>). */}
      {prevHref ? <link rel="prev" href={prevHref} /> : null}
      {nextHref ? <link rel="next" href={nextHref} /> : null}

      {/* Intro */}
      <Section spacing="md">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Insights"
            title="Practical thinking for IT decision-makers"
            lede="Strategy, procurement discipline, infrastructure, and managed services, top-of-funnel guidance written for enterprises, government, and institutions. No hype, no product pitch."
          />
        </FadeIn>
      </Section>

      {/* Featured highlight */}
      {featured ? (
        <Section spacing="sm" tone="muted">
          <FadeIn>
            <Link
              href={`/insights/${featured.slug}`}
              className="group grid items-center gap-8 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-green lg:grid-cols-2 lg:gap-12"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-background cover">
                <Image
                  src={featured.cover}
                  alt={featured.coverAlt || featured.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Eyebrow as="span">Featured</Eyebrow>
                  <Badge tone="accent">{featured.category.label}</Badge>
                </div>
                <h2 className="text-h2 text-text transition-colors duration-[var(--dur-fast)] group-hover:text-accent-green">
                  {featured.title}
                </h2>
                <p className="text-body-lg text-muted measure lede">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
                  <span>{featured.author}</span>
                  <span aria-hidden="true" className="text-muted">
                    &middot;
                  </span>
                  <time dateTime={isoDate(featured.publishedAt)}>
                    {formatDate(featured.publishedAt)}
                  </time>
                  <span aria-hidden="true" className="text-muted">
                    &middot;
                  </span>
                  <span>{featured.readingTime.text}</span>
                </div>
              </div>
            </Link>
          </FadeIn>
        </Section>
      ) : null}

      {/* Category filter, server-rendered crawlable links, not client state */}
      {categories.length > 0 ? (
        <Section spacing="sm">
          <nav aria-label="Filter insights by category">
            <ul className="flex flex-wrap gap-2.5">
              <li>
                <Link
                  href="/insights"
                  aria-current="page"
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent-green/40 bg-brand-subtle px-3.5 py-1.5 text-small font-medium text-accent-green transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                >
                  All
                  {/* Green, not muted: #6e6e73 on this green-tinted #eef2f0
                      chip computes to 4.49:1 — 0.01 under the bar. The count
                      de-emphasises by size, which doesn't spend contrast. */}
                  <span className="text-caption text-accent-green">
                    {all.length}
                  </span>
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/insights/category/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-raised px-3.5 py-1.5 text-small font-medium text-muted transition-colors duration-[var(--dur-fast)] hover:border-hairline-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                  >
                    {c.label}
                    <span className="text-caption text-muted">
                      {c.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Section>
      ) : null}

      {/* Search island + server-rendered paginated grid */}
      <Section spacing="sm">
        <InsightsSearch articles={all} controlsId="insights-grid" />

        <div id="insights-grid" className="mt-2">
          {pageItems.length > 0 ? (
            <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((article, i) => (
                <StaggerItem key={article.slug} className="h-full">
                  <ArticleCard
                    article={article}
                    headingAs="h3"
                    priority={page === 1 && i < 3}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="text-body text-muted">
              No insights published yet. Check back soon.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 ? (
            <nav
              aria-label="Pagination"
              className="mt-12 flex items-center justify-between border-t border-hairline pt-6"
            >
              {prevHref ? (
                <Button href={prevHref} variant="secondary" rel="prev">
                  <span aria-hidden="true">&larr;</span> Previous
                </Button>
              ) : (
                <span aria-hidden="true" />
              )}

              <p className="text-small text-muted">
                Page {page} of {totalPages}
              </p>

              {nextHref ? (
                <Button href={nextHref} variant="secondary" rel="next">
                  Next <span aria-hidden="true">&rarr;</span>
                </Button>
              ) : (
                <span aria-hidden="true" />
              )}
            </nav>
          ) : null}
        </div>
      </Section>

      {/* Continue the journey — the hub used to dead-end on pagination. A reader
          who reaches the end of a page now has a way to branch by topic
          (crawl path continues) and a reason to act (reader journey continues). */}
      {categories.length > 0 ? (
        <Section spacing="sm" tone="muted">
          <FadeIn>
            <SectionHeading eyebrow="Browse by topic" title="Explore by category" />
          </FadeIn>
          <FadeIn>
            <nav aria-label="Browse insights by category" className="mt-8">
              <ul className="flex flex-wrap gap-2.5">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/insights/category/${c.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-raised px-3.5 py-1.5 text-small font-medium text-muted transition-colors duration-[var(--dur-fast)] hover:border-hairline-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                    >
                      {c.label}
                      <span className="text-caption text-muted">{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </FadeIn>
        </Section>
      ) : null}

      <CTABand
        title="Planning something you've read about here?"
        description="Tell us about your environment and what you’re weighing up. We’ll explain how we’d approach it, no obligation."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {ctaLabels.insightsSoft}
          </Button>
        }
      />
    </>
  );
}
