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
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";
import { getLocation } from "@/data/locations";

const location = getLocation("abuja")!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
};

export default function AbujaPage() {
  const loc = getLocation("abuja");
  if (!loc) notFound();

  return (
    <>
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
          <Badge tone="accent" className="self-start">
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
              <a className="text-accent underline underline-offset-2" href={siteConfig.phoneHref}>
                {siteConfig.phone}
              </a>{" "}
              ·{" "}
              <a className="text-accent underline underline-offset-2" href={`mailto:${siteConfig.email}`}>
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
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
