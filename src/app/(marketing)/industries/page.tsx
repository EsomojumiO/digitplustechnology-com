import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Grid,
  IndustryCard,
  Breadcrumbs,
  CTABand,
  Button,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries We Serve — Government, Banking, Healthcare & More | Digitplus",
  description:
    "Sector-specific IT solutions for government, banking, enterprise, SME, healthcare, education, oil & gas, and logistics across Nigeria. Built around how each sector works.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesOverviewPage() {
  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        />
      </Section>

      <Section spacing="sm">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Industries"
            title="Built around how your sector works"
            lede="Documentation for government, uptime for banking, reliability for healthcare, budgets for education — every sector has its own demands. We deliver to each."
          />
        </Reveal>
      </Section>

      <Section spacing="md">
        <Reveal>
          <Grid columns={2} gap="md">
            {industries.map((i) => (
              <IndustryCard
                key={i.slug}
                href={`/industries/${i.slug}`}
                title={i.title}
                blurb={i.short}
              />
            ))}
          </Grid>
        </Reveal>
      </Section>

      <CTABand
        title="Don’t see your sector?"
        description="We work across many industries. Tell us about your environment and we’ll explain exactly how we’d approach it."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Talk to us
          </Button>
        }
      />
    </>
  );
}
