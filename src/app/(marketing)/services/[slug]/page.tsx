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
import { Reveal } from "@/components/motion/Reveal";
import { services, industries } from "@/lib/site";
import { getServiceContent } from "@/data/services";
import { testimonials } from "@/data/testimonials";

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

  // Pick an illustrative testimonial deterministically per service.
  const serviceIndex = services.findIndex((s) => s.slug === slug);
  const testimonial = testimonials[serviceIndex % testimonials.length];

  return (
    <>
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
      <Section spacing="sm">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow>Service</Eyebrow>
          <h1 className="text-h1 text-text">{content.title}</h1>
          <p className="text-body-lg text-accent measure">{content.tagline}</p>
          <div className="flex flex-col gap-5">
            {content.intro.map((para, i) => (
              <p key={i} className="text-body-lg text-muted measure">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button href="/contact" size="lg">
              Request a Free IT Assessment
            </Button>
            <Button href="/services" size="lg" variant="secondary">
              All services
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* What's included */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="What's included"
            title={`Inside our ${content.title.toLowerCase()}`}
          />
        </Reveal>
        <Reveal>
          <Grid columns={2} gap="md" className="mt-12">
            {content.whatsIncluded.map((item) => (
              <Card key={item.title} padding="lg">
                <h3 className="text-h4 text-text">{item.title}</h3>
                <p className="text-body text-muted measure mt-3">{item.desc}</p>
              </Card>
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* How it works */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="A clear, repeatable process"
              className="lg:sticky lg:top-28"
            />
          </Reveal>
          <Reveal>
            <ol className="flex flex-col gap-8">
              {content.howItWorks.map((stepText, i) => (
                <li key={i}>
                  <ProcessStep step={i + 1} title={stepText} />
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      {/* Relevant industries */}
      {relatedIndustries.length > 0 ? (
        <Section tone="muted">
          <Reveal>
            <SectionHeading
              eyebrow="Where it applies"
              title="Relevant industries"
              lede="This service is especially relevant to the sectors below. See how we tailor it to each."
            />
          </Reveal>
          <Reveal>
            <div className="mt-10 flex flex-wrap gap-3">
              {relatedIndustries.map((i) => (
                <Button
                  key={i.slug}
                  href={`/industries/${i.slug}`}
                  variant="secondary"
                >
                  {i.title}
                </Button>
              ))}
            </div>
          </Reveal>
        </Section>
      ) : null}

      {/* Testimonial */}
      {testimonial ? (
        <Section>
          <Reveal className="mx-auto max-w-3xl">
            <Testimonial
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              organization={testimonial.organization}
            />
          </Reveal>
        </Section>
      ) : null}

      {/* FAQ */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Questions, answered"
              className="lg:sticky lg:top-28"
            />
          </Reveal>
          <Reveal>
            <FAQ
              items={content.faqs.map((f) => ({
                question: f.q,
                answer: f.a,
              }))}
            />
          </Reveal>
        </div>
      </Section>

      <CTABand
        title={`Ready to talk about ${content.title.toLowerCase()}?`}
        description="Tell us what you’re planning. We’ll come back with practical next steps and a clear, line-itemised proposal — no obligation."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
