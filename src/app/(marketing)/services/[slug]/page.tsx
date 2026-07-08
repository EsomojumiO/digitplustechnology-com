import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Grid,
  Card,
  Button,
  Breadcrumbs,
  ProcessStep,
  Testimonial,
  FAQ,
  CTABand,
  Eyebrow,
} from "@/components/ui";
import Link from "next/link";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { services, industries } from "@/lib/site";
import { getSpokeArticles } from "@/lib/content";
import { getServiceContent } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { JsonLd } from "@/lib/seo/jsonld";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getServiceContent(slug);
  if (!content) return { title: "Service" };
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: `/services/${content.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getServiceContent(slug);
  if (!content) notFound();

  const relatedIndustries = content.relevantIndustries
    .map((s) => industries.find((i) => i.slug === s))
    .filter((i): i is (typeof industries)[number] => Boolean(i));

  // Hub-and-spoke: articles that link up to this service pillar.
  const spokes = getSpokeArticles("service", slug, 5);

  // Pick an illustrative testimonial deterministically per service.
  const serviceIndex = services.findIndex((s) => s.slug === slug);
  const testimonial = testimonials[serviceIndex % testimonials.length];

  return (
    <>
      <JsonLd data={serviceSchema(content)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: content.title },
        ])}
      />
      {content.faqs.length > 0 ? (
        <JsonLd data={faqSchema(content.faqs)} />
      ) : null}
      <Section spacing="sm">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: content.title },
          ]}
        />
      </Section>

      {/* Intro */}
      <Section spacing="md">
        <Stagger className="flex max-w-3xl flex-col gap-6">
          <StaggerItem>
            <Eyebrow>Service</Eyebrow>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-display text-text text-balance">
              {content.title}
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-body-lg text-accent measure">{content.tagline}</p>
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
            <Button href="/services" size="lg" variant="secondary">
              All services
            </Button>
          </StaggerItem>
        </Stagger>
      </Section>

      {/* What's included */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="What's included"
            title={`Inside our ${content.title.toLowerCase()}`}
          />
        </FadeIn>
        <Grid as={Stagger} columns={2} gap="md" className="mt-12">
          {content.whatsIncluded.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <Card padding="lg" className="h-full">
                <h3 className="text-h4 text-text">{item.title}</h3>
                <p className="text-body text-muted measure mt-3">{item.desc}</p>
              </Card>
            </StaggerItem>
          ))}
        </Grid>
      </Section>

      {/* How it works */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <FadeIn>
            <SectionHeading
              eyebrow="How it works"
              title="A clear, repeatable process"
              className="lg:sticky lg:top-28"
            />
          </FadeIn>
          <FadeIn>
            <ol className="flex flex-col gap-8">
              {content.howItWorks.map((stepText, i) => (
                <li key={i}>
                  <ProcessStep step={i + 1} title={stepText} />
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </Section>

      {/* Relevant industries */}
      {relatedIndustries.length > 0 ? (
        <Section tone="muted">
          <FadeIn>
            <SectionHeading
              eyebrow="Where it applies"
              title="Relevant industries"
              lede="This service is especially relevant to the sectors below. See how we tailor it to each."
            />
          </FadeIn>
          <Stagger className="mt-10 flex flex-wrap gap-3">
            {relatedIndustries.map((i) => (
              <StaggerItem key={i.slug}>
                <Button href={`/industries/${i.slug}`} variant="secondary">
                  {i.title}
                </Button>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ) : null}

      {/* Testimonial */}
      {testimonial ? (
        <Section>
          <FadeIn className="mx-auto max-w-3xl">
            <Testimonial
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              organization={testimonial.organization}
            />
          </FadeIn>
        </Section>
      ) : null}

      {/* FAQ */}
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

      {/* Further reading — hub-and-spoke: articles linking up to this pillar */}
      {spokes.length > 0 ? (
        <Section>
          <FadeIn>
            <SectionHeading eyebrow="Further reading" title="Related insights" />
          </FadeIn>
          <Stagger className="mt-10 divide-y divide-hairline border-y border-hairline">
            {spokes.map((a) => (
              <StaggerItem key={a.slug}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:bg-surface/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                >
                  <span className="text-body-lg text-text transition-colors group-hover:text-accent-green">
                    {a.title}
                  </span>
                  <span className="shrink-0 font-mono text-caption uppercase tracking-[0.1em] text-muted">
                    {a.readingTime.text}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ) : null}

      <FadeIn>
        <CTABand
          title={`Ready to talk about ${content.title.toLowerCase()}?`}
          description="Tell us what you’re planning. We’ll come back with practical next steps and a clear, line-itemised proposal, no obligation."
          actions={
            <Button href="/contact" size="lg" variant="secondary">
              {`Get a quote for ${content.title}`}
            </Button>
          }
        />
      </FadeIn>
    </>
  );
}
