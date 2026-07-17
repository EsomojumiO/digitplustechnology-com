import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

/**
 * Article template, /insights/[slug]
 *
 * SSG: one static page per published article. ISR: revalidate hourly so editors
 * can publish/update without a redeploy once a CMS is wired in.
 * dynamicParams=false ⇒ unknown slugs (incl. drafts) are 404, not on-demand.
 */
export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
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
    title: { absolute: title },
    description,
    alternates: { canonical: `/insights/${article.slug}` },
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
      <JsonLd data={articleSchema(article, url)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
          { name: article.title },
        ])}
      />
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

            <p className="text-body-lg text-muted measure">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
              <span className="font-medium text-text">{author.name}</span>
              <span aria-hidden="true" className="text-muted/50">
                &middot;
              </span>
              <time dateTime={isoDate(article.publishedAt)}>
                {formatDate(article.publishedAt)}
              </time>
              <span aria-hidden="true" className="text-muted/50">
                &middot;
              </span>
              <span>{article.readingTime.text}</span>
              {updated ? (
                <>
                  <span aria-hidden="true" className="text-muted/50">
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
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="outline">{tag}</Badge>
                  </li>
                ))}
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
        actions={
          <>
            <Button href="/contact" size="lg" variant="secondary">
              Get a quote
            </Button>
            <Button href={hub.href} size="lg" variant="ghost">
              Read our insights
            </Button>
          </>
        }
      />
    </>
  );
}
