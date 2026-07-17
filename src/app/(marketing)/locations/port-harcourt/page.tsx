import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Section,
  SectionHeading,
  Card,
  Button,
  Breadcrumbs,
  CTABand,
  Badge,
} from "@/components/ui";
import { FeatureImage } from "@/components/ui/FeatureImage";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";
import { getLocation } from "@/data/locations";
import { JsonLd } from "@/lib/seo/jsonld";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/seo/schema";

const location = getLocation("port-harcourt")!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: { canonical: "/locations/port-harcourt" },
};

export default function PortHarcourtPage() {
  const loc = getLocation("port-harcourt");
  if (!loc) notFound();

  return (
    <>
      <JsonLd data={localBusinessSchema(loc)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Locations", url: "/locations" },
          { name: loc.city },
        ])}
      />
      <Section spacing="sm">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Locations", href: "/locations" },
            { label: loc.city },
          ]}
        />
      </Section>

      <Section spacing="sm">
        <Reveal className="flex flex-col gap-6">
          <Badge
            tone={loc.role === "Headquarters" ? "accent" : "neutral"}
            className="self-start"
          >
            {loc.role}
          </Badge>
          <SectionHeading
            as="h1"
            eyebrow="Location"
            title={`IT solutions in ${loc.city}`}
          />
          <div className="flex flex-col gap-5">
            {loc.intro.map((para, i) => (
              <p key={i} className="text-body-lg text-muted measure">
                {para}
              </p>
            ))}
          </div>
          <FeatureImage
            src={`/images/locations/${loc.slug}.jpg`}
            alt={`Digitplus Technology in ${loc.city}`}
            label={loc.city}
            aspect="aspect-[21/9]"
            sizes="(min-width: 1024px) 60rem, 100vw"
          />
        </Reveal>
      </Section>

      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="On the ground"
            title={`How we serve ${loc.city}`}
          />
        </Reveal>
        <Reveal>
          <div className="mt-10 grid gap-4">
            {loc.highlights.map((h) => (
              <Card key={h} padding="md">
                <p className="text-body text-text">{h}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section spacing="sm">
        <Reveal>
          <Card padding="lg" className="flex flex-col gap-2">
            <span className="text-caption font-semibold uppercase tracking-[0.12em] text-muted">
              Get in touch
            </span>
            <p className="text-body text-text">
              {siteConfig.hq} ·{" "}
              <a className="text-accent-green underline underline-offset-2" href={siteConfig.phoneHref}>
                {siteConfig.phone}
              </a>{" "}
              ·{" "}
              <a className="text-accent-green underline underline-offset-2" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
          </Card>
        </Reveal>
      </Section>

      <CTABand
        title={`Planning IT work in ${loc.city}?`}
        description="Tell us what you’re planning and we’ll come back with practical next steps."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Get a quote
          </Button>
        }
      />
    </>
  );
}
