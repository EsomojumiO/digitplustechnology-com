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
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { services } from "@/lib/site";
import { ctaLabels } from "@/lib/cta";

export const metadata: Metadata = {
  title: "IT Services in Nigeria, Procurement & Managed IT",
  description:
    "Six IT service lines for organisations across Nigeria: procurement, hardware supply, infrastructure, managed IT, technology advisory and deployment.",
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
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="IT solutions in Nigeria, delivered with accountability"
            lede="From the first plan to long-term support, our six service lines cover the full lifecycle of your technology. Engage one or several; the standard of delivery is the same."
          />
        </FadeIn>
      </Section>

      <Section spacing="md">
        <h2 className="sr-only">Our service lines</h2>
        <Grid as={Stagger} columns={3} gap="md">
          {services.map((s) => (
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

      <FadeIn>
        <CTABand
          title="Not sure where to start?"
          description="Tell us what you’re trying to achieve. We’ll point you to the right service, or design a plan that combines several."
          actions={
            <Button href="/contact" size="lg" variant="secondary">
              {ctaLabels.generic}
            </Button>
          }
        />
      </FadeIn>
    </>
  );
}
