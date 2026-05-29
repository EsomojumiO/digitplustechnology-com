import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Grid,
  ServiceCard,
  Breadcrumbs,
  CTABand,
  Button,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "IT Services — Procurement, Infrastructure & Managed Services | Digitplus",
  description:
    "Six end-to-end IT service lines for organisations across Nigeria: procurement, hardware supply, infrastructure, managed services, technology advisory, and deployment.",
  alternates: { canonical: "/services" },
};

export default function ServicesOverviewPage() {
  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Services" }]}
        />
      </Section>

      <Section spacing="sm">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="End-to-end IT, delivered with accountability"
            lede="From the first plan to long-term support, our six service lines cover the full lifecycle of your technology. Engage one or several — the standard of delivery is the same."
          />
        </Reveal>
      </Section>

      <Section spacing="md">
        <Reveal>
          <Grid columns={3} gap="md">
            {services.map((s) => (
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

      <CTABand
        title="Not sure where to start?"
        description="Tell us what you’re trying to achieve. We’ll point you to the right service — or design a plan that combines several."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
