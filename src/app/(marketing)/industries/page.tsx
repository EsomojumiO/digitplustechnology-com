import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
import {
  Section,
  SectionHeading,
  Grid,
  IndustryCard,
  Breadcrumbs,
  CTABand,
  Button,
} from "@/components/ui";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries We Serve Across Nigeria",
  description:
    "Sector-specific IT solutions for government, banking, enterprise, SME, healthcare, education, oil & gas and logistics across Nigeria — shaped by each sector.",
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
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Industries"
            title="Industry IT solutions, built around your sector"
            lede="Documentation for government, uptime for banking, reliability for healthcare, budgets for education, every sector in Nigeria has its own demands. We deliver to each."
          />
        </FadeIn>
      </Section>

      <Section spacing="md">
        <Grid as={Stagger} columns={2} gap="md">
          {industries.map((i) => (
            <StaggerItem key={i.slug} className="h-full">
              <IndustryCard
                href={`/industries/${i.slug}`}
                title={i.title}
                blurb={i.short}
                className="h-full"
              />
            </StaggerItem>
          ))}
        </Grid>
      </Section>

      <FadeIn>
        <CTABand
          title="Don’t see your sector?"
          description="We work across many industries. Tell us about your environment and we’ll explain exactly how we’d approach it."
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
