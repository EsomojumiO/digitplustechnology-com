import type { ReactNode } from "react";
import { ctaLabels } from "@/lib/cta";
import {
  Section,
  SectionHeading,
  Breadcrumbs,
  Button,
  CTABand,
} from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import type { ArticleMeta } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * ArchiveView, the shared body for filtered Insights listings.
 *
 * /insights/tag/[tag] and /insights/case-studies render the same thing with
 * different framing, so the markup lives here — the pretty case-studies URL
 * must not drift from the generic tag archive it is an alias for.
 *
 * Mirrors the category archive's structure deliberately: one array feeds both
 * the visible breadcrumb trail and the BreadcrumbList schema so they cannot
 * disagree.
 */
export interface ArchiveViewProps {
  /** Breadcrumb leaf + <h1>. */
  title: string;
  eyebrow: string;
  lede: string;
  articles: ArticleMeta[];
  /** Optional slot under the grid (e.g. cross-links to related archives). */
  footer?: ReactNode;
}

export function ArchiveView({
  title,
  eyebrow,
  lede,
  articles,
  footer,
}: ArchiveViewProps) {
  const trail = [
    { name: "Home", url: "/" },
    { name: "Insights", url: "/insights" },
    { name: title },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <Section spacing="sm">
        <Breadcrumbs
          items={trail.map(({ name, url }) => ({ label: name, href: url }))}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} lede={lede} />
        </FadeIn>
      </Section>

      <Section spacing="sm">
        <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <StaggerItem key={article.slug} className="h-full">
              <ArticleCard article={article} headingAs="h2" priority={i < 3} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 border-t border-hairline pt-6">
          <Button href="/insights" variant="secondary">
            <span aria-hidden="true">&larr;</span> All insights
          </Button>
        </div>

        {footer}
      </Section>

      <CTABand
        title="Planning something in this area?"
        description="Tell us what you’re working on. We’ll come back with practical next steps, no obligation."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {ctaLabels.insightsSoft}
          </Button>
        }
      />
    </>
  );
}
