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
import { Reveal } from "@/components/motion/Reveal";
import { industries, services } from "@/lib/site";
import { getIndustryContent } from "@/data/industries";

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
      <Section spacing="sm">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow>Industry</Eyebrow>
          <h1 className="text-h1 text-text">{content.title}</h1>
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
            <Button href="/industries" size="lg" variant="secondary">
              All industries
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* Concerns we address */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="What we address"
            title={`What ${content.title.toLowerCase()} demands`}
            lede="The concerns we hear most in this sector — and how we meet them."
          />
        </Reveal>
        <Reveal>
          <Grid columns={2} gap="md" className="mt-12">
            {content.concerns.map((item) => (
              <Card key={item.title} padding="lg">
                <h3 className="text-h4 text-text">{item.title}</h3>
                <p className="text-body text-muted measure mt-3">{item.desc}</p>
              </Card>
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* Relevant services */}
      {relatedServices.length > 0 ? (
        <Section>
          <Reveal>
            <SectionHeading
              eyebrow="How we help"
              title="Relevant services"
              lede="The service lines we most often bring to this sector."
            />
          </Reveal>
          <Reveal>
            <Grid columns={2} gap="md" className="mt-12">
              {relatedServices.map((s) => (
                <ServiceCard
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  title={s.title}
                  blurb={s.short}
                />
              ))}
            </Grid>
          </Reveal>
        </Section>
      ) : null}

      {/* FAQ */}
      {content.faqs && content.faqs.length > 0 ? (
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
      ) : null}

      <CTABand
        title={`IT for ${content.title.toLowerCase()}, done right`}
        description="Tell us about your environment and what you’re planning. We’ll explain exactly how we’d approach it — no obligation."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
