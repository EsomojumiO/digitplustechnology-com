import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import {
  Section,
  Container,
  Badge,
  Prose,
  Breadcrumbs,
  SectionHeading,
  CTABand,
  Button,
} from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  getPillarForArticle,
  MDXContent,
  tagSlug,
  CASE_STUDY_TAG_SLUG,
  type Category,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { JsonLd } from "@/lib/seo/jsonld";
import { clampDescription } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { ArticleCard } from "../_components/ArticleCard";
import { ShareBar } from "../_components/ShareBar";
import { AuthorBio } from "../_components/AuthorBio";
import { formatDate, isoDate } from "../_components/format";
import { getAuthor } from "@/data";
import {
  draftPreviewEnabled,
  getDraftSlugsForPreview,
} from "@/lib/content/articles";

/**
 * Article template, /insights/[slug]
 *
 * SSG: one static page per published article. ISR: revalidate hourly so editors
 * can publish/update without a redeploy once a CMS is wired in.
 * dynamicParams=false ⇒ unknown slugs are 404, not on-demand.
 *
 * In development the draft slugs are added so a draft can be reviewed at its
 * real URL. getDraftSlugsForPreview() returns [] in production, so there the
 * set is unchanged and every draft still 404s via dynamicParams=false. Drafts
 * never enter getAllArticles(), so they stay out of the hub, the archives, the
 * sitemap and the RSS feed in every environment.
 */
export function generateStaticParams() {
  const published = getAllArticles().map((a) => ({ slug: a.slug }));
  const drafts = getDraftSlugsForPreview().map((slug) => ({ slug }));
  return [...published, ...drafts];
}

export const dynamicParams = false;
export const revalidate = 3600;

/**
 * Topic clustering: map each category to the most relevant /services or
 * /industries hub so every article links into the commercial graph.
 */
const RELATED_HUB: Record<string, { href: string; label: string }> = {
  "it-strategy-advisory": {
    href: "/services/technology-advisory",
    label: "Technology Advisory",
  },
  infrastructure: {
    href: "/services/infrastructure-solutions",
    label: "Infrastructure Solutions",
  },
  procurement: { href: "/services/it-procurement", label: "IT Procurement" },
  cybersecurity: {
    href: "/services/managed-services",
    label: "Managed Services",
  },
  "managed-services": {
    href: "/services/managed-services",
    label: "Managed Services",
  },
  "industry-policy": { href: "/industries/government", label: "Government" },
  guides: { href: "/services", label: "our services" },
};

function relatedHub(category: Category) {
  return (
    RELATED_HUB[category.slug] ?? { href: "/services", label: "our services" }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Insight" };

  const title = article.seo.metaTitle ?? article.title;
  const description = clampDescription(
    article.seo.metaDescription ?? article.excerpt,
  );
  const ogImage = article.seo.ogImage ?? article.cover;
  const url = `${siteConfig.url}/insights/${article.slug}`;

  return {
    // Absolute: article titles are long and descriptive; appending the brand
    // suffix pushes them past the ~60-char SERP cutoff. The title stands alone.
    title: { absolute: article.draft ? `[DRAFT] ${title}` : title },
    description,
    alternates: { canonical: `/insights/${article.slug}` },
    // A draft is only reachable in development, but mark it noindex anyway:
    // this is the backstop if the environment gate is ever wrong.
    ...(article.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage, alt: article.coverAlt }] : undefined,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 3);
  const author = getAuthor(article.author);
  // Precise per-article pillar (hub-and-spoke); fall back to the category hub.
  const pillar = getPillarForArticle(article.slug);
  const hub = pillar
    ? { href: pillar.href, label: pillar.title }
    : relatedHub(article.category);
  const url = `${siteConfig.url}/insights/${article.slug}`;
  const updated = article.updatedAt && article.updatedAt !== article.publishedAt;

  return (
    <>
      {/* No Article schema for a draft — structured data for unpublished copy
          is exactly what should not exist, even on a local machine. */}
      {!article.draft && <JsonLd data={articleSchema(article, url)} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
          { name: article.title },
        ])}
      />
      {article.draft && draftPreviewEnabled() && (
        <div
          role="status"
          className="sticky top-0 z-50 border-b-2 border-amber-500 bg-amber-100 px-4 py-2.5 text-center text-sm font-semibold tracking-wide text-amber-950 dark:bg-amber-950 dark:text-amber-100"
        >
          DRAFT — not published. Visible only in development; excluded from the
          sitemap, the RSS feed and every archive, and served noindex.
        </div>
      )}

      <Section spacing="sm">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights" },
            { label: article.title },
          ]}
        />
      </Section>

      {/* Article header */}
      <Section spacing="sm" contained={false}>
        <Container width="narrow">
          <FadeIn className="flex flex-col gap-5">
            <div>
              <Link
                href={`/insights/category/${article.category.slug}`}
                className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
              >
                <Badge tone="accent">{article.category.label}</Badge>
              </Link>
            </div>

            <h1 className="text-h1 text-text text-balance">{article.title}</h1>

            <p className="text-body-lg text-muted measure lede">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
              <span className="font-medium text-text">{author.name}</span>
              <span aria-hidden="true" className="text-muted">
                &middot;
              </span>
              <time dateTime={isoDate(article.publishedAt)}>
                {formatDate(article.publishedAt)}
              </time>
              <span aria-hidden="true" className="text-muted">
                &middot;
              </span>
              <span>{article.readingTime.text}</span>
              {updated ? (
                <>
                  <span aria-hidden="true" className="text-muted">
                    &middot;
                  </span>
                  <span>
                    Updated{" "}
                    <time dateTime={isoDate(article.updatedAt)}>
                      {formatDate(article.updatedAt)}
                    </time>
                  </span>
                </>
              ) : null}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Featured image, fixed frame, neutral fallback for layout stability */}
      <Section spacing="sm" contained={false}>
        <Container width="wide">
          <FadeIn>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface cover">
              <Image
                src={article.cover}
                alt={article.coverAlt || article.title}
                fill
                priority
                sizes="(min-width: 1360px) 1360px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Body */}
      <Section spacing="sm" contained={false}>
        <Container width="narrow">
          <FadeIn>
            <Prose as="article">
              {/* Prose styles MDX elements incl. blockquotes (pull-quote treatment). */}
              <MDXContent source={article.body} />
            </Prose>
          </FadeIn>

          {/* Tags + share */}
          <div className="mt-12 flex flex-col gap-6 border-t border-hairline pt-8">
            {article.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {article.tags.map((tag) => {
                  const slug = tagSlug(tag);
                  // The case-study tag lives at its own canonical URL; linking
                  // straight there avoids a redirect hop for readers.
                  const href =
                    slug === CASE_STUDY_TAG_SLUG
                      ? "/insights/case-studies"
                      : `/insights/tag/${slug}`;
                  return (
                    <li key={tag}>
                      <Link
                        href={href}
                        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                      >
                        <Badge tone="outline">{tag}</Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <ShareBar url={url} title={article.title} />
          </div>

          {/* Topic-cluster internal link */}
          <p className="mt-8 text-body text-muted measure">
            Related to this:{" "}
            <Link
              href={hub.href}
              className="font-medium text-accent-green underline decoration-from-font underline-offset-2 hover:text-accent-green"
            >
              {hub.label}
            </Link>
            .
          </p>

          {/* Author / E-E-A-T */}
          <AuthorBio author={author} />
        </Container>
      </Section>

      {/* Related articles */}
      {related.length > 0 ? (
        <Section tone="muted">
          <FadeIn>
            <SectionHeading
              eyebrow="Keep reading"
              title="Related insights"
            />
          </FadeIn>
          <Stagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <StaggerItem key={r.slug} className="h-full">
                <ArticleCard article={r} headingAs="h3" />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ) : null}

      <CTABand
        title="Have a project that needs this thinking?"
        description="Tell us what you’re planning. We’ll come back with practical next steps and a clear, line-itemised proposal, no obligation."
        // One action per closing band, same rule as home. The hub link is
        // already reachable from the breadcrumb, the nav and the footer, so it
        // was costing the contact CTA attention without adding a route.
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {ctaLabels.insightsSoft}
          </Button>
        }
      />
    </>
  );
}
