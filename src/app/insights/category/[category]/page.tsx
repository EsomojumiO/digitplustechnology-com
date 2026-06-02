import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Section,
  SectionHeading,
  Breadcrumbs,
  Button,
  CTABand,
} from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import {
  getAllCategories,
  getArticlesByCategory,
  categoryFromSlug,
} from "@/lib/content";
import { ArticleCard } from "../../_components/ArticleCard";

/**
 * Category archive — /insights/category/[category]
 *
 * ROUTING NOTE: the brief specified /insights/[category], but Next.js forbids
 * two differently-named dynamic segments at one level (we already use
 * /insights/[slug] for articles). The standard, SEO-fine resolution is to nest
 * archives under /insights/category/[category]. Recorded in docs/DECISIONS.md.
 *
 * Only categories that actually contain published articles are pre-rendered
 * (getAllCategories filters to count > 0). dynamicParams=false ⇒ any other
 * segment is a 404, and notFound() guards invalid/empty categories defensively.
 */
export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return { title: "Insights" };
  return {
    title: `${category.label} Insights`,
    description: category.description,
    alternates: { canonical: `/insights/category/${category.slug}` },
  };
}

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);
  if (articles.length === 0) notFound();

  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights" },
            { label: category.label },
          ]}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Category"
            title={category.label}
            lede={category.description}
          />
        </FadeIn>
      </Section>

      <Section spacing="sm">
        <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <StaggerItem key={article.slug} className="h-full">
              <ArticleCard
                article={article}
                headingAs="h2"
                priority={i < 3}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 border-t border-hairline pt-6">
          <Button href="/insights" variant="secondary">
            <span aria-hidden="true">&larr;</span> All insights
          </Button>
        </div>
      </Section>

      <CTABand
        title="Planning something in this area?"
        description="Tell us what you’re working on. We’ll come back with practical next steps — no obligation."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
