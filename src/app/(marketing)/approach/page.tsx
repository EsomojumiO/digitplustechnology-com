import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
import {
  Section,
  SectionHeading,
  Breadcrumbs,
  CTABand,
  Button,
  Eyebrow,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { processSteps } from "@/data/process";
import { ProcessTimeline } from "./_components/ProcessTimeline";

export const metadata: Metadata = {
  title: "Our Approach to IT Delivery",
  description:
    "How Digitplus delivers IT: a documented six-step process — discovery, design, procurement, deployment, testing and support — accountable at every step.",
  alternates: { canonical: "/approach" },
};

export default function ApproachPage() {
  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Approach" }]}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="How we work"
            title="One disciplined process, every time"
            lede="Good IT outcomes are not luck. They’re the result of a repeatable process. We run the same six steps on every engagement, with documentation and accountability throughout."
          />
        </FadeIn>
      </Section>

      {/* Signature: the six-step delivery process as a scroll-revealed timeline */}
      <Section spacing="md">
        <h2 className="sr-only">The six-step delivery process</h2>
        <ProcessTimeline steps={processSteps} />
      </Section>

      {/* Principle */}
      <Section tone="muted" spacing="lg">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-muted">The point of process</Eyebrow>
          <p className="text-h3 mt-6 font-medium tracking-tight text-text">
            Every step exists to remove a way projects usually go wrong. The
            result is fewer surprises, a clean paper trail, and technology that
            works on the day you need it to.
          </p>
        </FadeIn>
      </Section>

      <CTABand
        title="Start with discovery"
        description="The first step costs you nothing but a conversation. Book a discovery call and we’ll begin understanding what you actually need."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {ctaLabels.generic}
          </Button>
        }
      />
    </>
  );
}
