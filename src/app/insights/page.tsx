import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Section,
  SectionHeading,
  Grid,
  Badge,
  Eyebrow,
  Button,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
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
  title: "Insights",
  description:
    "Authority articles for IT decision-makers — strategy, procurement, infrastructure, cybersecurity, and managed services from Digitplus Technology.",
  alternates: { canonical: "/insights" },
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
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Insights"
            title="Practical thinking for IT decision-makers"
            lede="Strategy, procurement discipline, infrastructure, and managed services — top-of-funnel guidance written for enterprises, government, and institutions. No hype, no product pitch."
          />
        </Reveal>
      </Section>

      {/* Featured highlight */}
      {featured ? (
        <Section spacing="sm" tone="muted">
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              className="group grid items-center gap-8 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:grid-cols-2 lg:gap-12"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-hairline bg-background">
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
                <h2 className="text-h2 text-text transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
                  {featured.title}
                </h2>
                <p className="text-body-lg text-muted measure">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
                  <span>{featured.author}</span>
                  <span aria-hidden="true" className="text-muted/50">
                    &middot;
                  </span>
                  <time dateTime={isoDate(featured.publishedAt)}>
                    {formatDate(featured.publishedAt)}
                  </time>
                  <span aria-hidden="true" className="text-muted/50">
                    &middot;
                  </span>
                  <span>{featured.readingTime.text}</span>
                </div>
              </div>
            </Link>
          </Reveal>
        </Section>
      ) : null}

      {/* Category filter — server-rendered crawlable links, not client state */}
      {categories.length > 0 ? (
        <Section spacing="sm">
          <nav aria-label="Filter insights by category">
            <ul className="flex flex-wrap gap-2.5">
              <li>
                <Link
                  href="/insights"
                  aria-current="page"
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent-subtle px-3.5 py-1.5 text-small font-medium text-accent transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  All
                  <span className="text-caption text-accent/70">
                    {all.length}
                  </span>
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/insights/category/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-raised px-3.5 py-1.5 text-small font-medium text-muted transition-colors duration-[var(--dur-fast)] hover:border-neutral-300 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {c.label}
                    <span className="text-caption text-muted/60">
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
            <Reveal>
              <Grid columns={3} gap="lg">
                {pageItems.map((article, i) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    headingAs="h3"
                    priority={page === 1 && i < 3}
                  />
                ))}
              </Grid>
            </Reveal>
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
    </>
  );
}
