import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Grid,
  Button,
  Breadcrumbs,
  CTABand,
  Badge,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";
import { locations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Our Locations — Abuja, Lagos & Port Harcourt | Digitplus Technology",
  description:
    "Digitplus Technology Limited is headquartered in Abuja with delivery hubs in Lagos and Port Harcourt, and nationwide coverage on request across Nigeria.",
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
            lede={`From our ${siteConfig.hq} headquarters, with delivery hubs in Lagos and Port Harcourt, we coordinate IT programmes to a single standard wherever your operations are — and reach further across Nigeria on request.`}
          />
        </Reveal>
      </Section>

      <Section spacing="md">
        <Reveal>
          <Grid columns={3} gap="md">
            {locations.map((loc) => (
              <a
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group flex flex-col gap-3 rounded-lg border border-hairline bg-surface-raised p-8 transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Badge
                  tone={loc.role === "Headquarters" ? "accent" : "neutral"}
                  className="self-start"
                >
                  {loc.role}
                </Badge>
                <h2 className="text-h3 text-text">{loc.city}</h2>
                <p className="text-body text-muted measure">{loc.intro[0]}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-small font-medium text-accent">
                  About {loc.city} →
                </span>
              </a>
            ))}
          </Grid>
        </Reveal>
      </Section>

      <CTABand
        title="Working across multiple cities?"
        description="We coordinate multi-site programmes from a single point of accountability. Tell us where you operate and we’ll plan around it."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
