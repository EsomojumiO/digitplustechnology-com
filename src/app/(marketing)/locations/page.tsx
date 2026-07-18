import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
import {
  Section,
  SectionHeading,
  Grid,
  Button,
  Breadcrumbs,
  CTABand,
  Badge,
  Card,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";
import { locations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Our Locations, Abuja, Lagos & Port Harcourt",
  description:
    "Digitplus Technology Limited is headquartered in Abuja with delivery hubs in Lagos and Port Harcourt, and nationwide coverage on request across Nigeria.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Locations" }]}
        />
      </Section>

      <Section spacing="sm">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Locations"
            title="Headquartered in Abuja, delivering nationwide"
            lede={`From our ${siteConfig.hq} headquarters, with delivery hubs in Lagos and Port Harcourt, we coordinate IT programmes to a single standard wherever your operations are, and reach further across Nigeria on request.`}
          />
        </Reveal>
      </Section>

      <Section spacing="md">
        <Reveal>
          <Grid columns={3} gap="md">
            {locations.map((loc) => (
              <Card
                key={loc.slug}
                as="a"
                interactive
                padding="lg"
                href={`/locations/${loc.slug}`}
                className="group flex flex-col gap-3"
              >
                <Badge
                  tone={loc.role === "Headquarters" ? "accent" : "neutral"}
                  className="self-start"
                >
                  {loc.role}
                </Badge>
                <h2 className="text-h3 text-text">{loc.city}</h2>
                <p className="text-body text-muted measure">{loc.intro[0]}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-small font-medium text-accent-green">
                  About {loc.city} →
                </span>
              </Card>
            ))}
          </Grid>
        </Reveal>
      </Section>

      <CTABand
        title="Working across multiple cities?"
        description="We coordinate multi-site programmes from a single point of accountability. Tell us where you operate and we’ll plan around it."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {ctaLabels.generic}
          </Button>
        }
      />
    </>
  );
}
