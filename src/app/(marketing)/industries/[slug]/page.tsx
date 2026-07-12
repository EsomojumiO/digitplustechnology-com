import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Grid,
  Card,
  Button,
  Breadcrumbs,
  ServiceCard,
  FAQ,
  CTABand,
  Eyebrow,
} from "@/components/ui";
import { FeatureImage } from "@/components/ui/FeatureImage";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { industries, services } from "@/lib/site";
import { getIndustryContent } from "@/data/industries";
import { JsonLd } from "@/lib/seo/jsonld";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getIndustryContent(slug);
  if (!content) return { title: "Industry" };
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: `/industries/${content.slug}` },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getIndustryContent(slug);
  if (!content) notFound();

  const relatedServices = content.relevantServices
    .map((s) => services.find((sv) => sv.slug === s))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: content.title },
        ])}
      />
      {content.faqs && content.faqs.length > 0 ? (
        <JsonLd data={faqSchema(content.faqs)} />
      ) : null}
      <Section spacing="sm">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: content.title },
          ]}
        />
      </Section>

      {/* Intro */}
      <Section spacing="md">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center lg:gap-14">
        <Stagger className="flex flex-col gap-6">
          <StaggerItem>
            <Eyebrow>Industry</Eyebrow>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-display text-text text-balance">
              {content.title}
            </h1>
          </StaggerItem>
          <StaggerItem className="flex flex-col gap-5">
            {content.intro.map((para, i) => (
              <p key={i} className="text-body-lg text-muted measure">
                {para}
              </p>
            ))}
          </StaggerItem>
          <StaggerItem className="mt-2 flex flex-wrap gap-3">
            <Button href="/contact" size="lg">
              Get a quote
            </Button>
            <Button href="/industries" size="lg" variant="secondary">
              All industries
            </Button>
          </StaggerItem>
        </Stagger>
          <FadeIn>
            <FeatureImage
              src={`/images/industries/${slug}.jpg`}
              alt={`IT solutions for ${content.title} — Digitplus Technology`}
              label={content.title}
              aspect="aspect-[4/3]"
              priority
            />
          </FadeIn>
        </div>
      </Section>

      {/* Concerns we address */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="What we address"
            title={`What ${content.title.toLowerCase()} demands`}
            lede="The concerns we hear most in this sector, and how we meet them."
          />
        </FadeIn>
        <Grid as={Stagger} columns={2} gap="md" className="mt-12">
          {content.concerns.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <Card padding="lg" className="h-full">
                <h3 className="text-h4 text-text">{item.title}</h3>
                <p className="text-body text-muted measure mt-3">{item.desc}</p>
              </Card>
            </StaggerItem>
          ))}
        </Grid>
      </Section>

      {/* Relevant services */}
      {relatedServices.length > 0 ? (
        <Section>
          <FadeIn>
            <SectionHeading
              eyebrow="How we help"
              title="Relevant services"
              lede="The service lines we most often bring to this sector."
            />
          </FadeIn>
          <Grid as={Stagger} columns={2} gap="md" className="mt-12">
            {relatedServices.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard
                  href={`/services/${s.slug}`}
                  title={s.title}
                  blurb={s.short}
                  className="h-full"
                />
              </StaggerItem>
            ))}
          </Grid>
        </Section>
      ) : null}

      {/* FAQ */}
      {content.faqs && content.faqs.length > 0 ? (
        <Section tone="muted">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
            <FadeIn>
              <SectionHeading
                eyebrow="FAQ"
                title="Questions, answered"
                className="lg:sticky lg:top-28"
              />
            </FadeIn>
            <FadeIn>
              <FAQ
                items={content.faqs.map((f) => ({
                  question: f.q,
                  answer: f.a,
                }))}
              />
            </FadeIn>
          </div>
        </Section>
      ) : null}

      <FadeIn>
        <CTABand
          title={`IT for ${content.title.toLowerCase()}, done right`}
          description="Tell us about your environment and what you’re planning. We’ll explain exactly how we’d approach it, no obligation."
          actions={
            <Button href="/contact" size="lg" variant="secondary">
              Get a quote
            </Button>
          }
        />
      </FadeIn>
    </>
  );
}
