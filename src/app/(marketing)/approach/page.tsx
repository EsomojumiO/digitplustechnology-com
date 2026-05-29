import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Breadcrumbs,
  ProcessStep,
  CTABand,
  Button,
  Eyebrow,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { processSteps } from "@/data/process";

export const metadata: Metadata = {
  title: "Our Approach — A Clear, Documented IT Delivery Process | Digitplus",
  description:
    "How Digitplus delivers IT: a six-step process from discovery and design through procurement, deployment, testing, and ongoing support — documented and accountable at every step.",
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
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="How we work"
            title="One disciplined process, every time"
            lede="Good IT outcomes are not luck — they’re the result of a repeatable process. We run the same six steps on every engagement, with documentation and accountability throughout."
          />
        </Reveal>
      </Section>

      {/* Vertical stepper */}
      <Section spacing="md">
        <Reveal>
          <ol className="relative flex flex-col gap-12 border-l border-hairline pl-0 sm:pl-2">
            {processSteps.map((step) => (
              <li key={step.step} className="relative">
                <ProcessStep
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  className="pl-6"
                />
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* Principle */}
      <Section tone="inverse" spacing="lg">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-neutral-400">The point of process</Eyebrow>
          <p className="text-h3 mt-6 font-medium tracking-tight text-neutral-50">
            Every step exists to remove a way projects usually go wrong. The
            result is fewer surprises, a clean paper trail, and technology that
            works on the day you need it to.
          </p>
        </Reveal>
      </Section>

      <CTABand
        title="Start with discovery"
        description="The first step costs you nothing but a conversation. Request a free IT assessment and we’ll begin understanding what you actually need."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Request a Free IT Assessment
          </Button>
        }
      />
    </>
  );
}
