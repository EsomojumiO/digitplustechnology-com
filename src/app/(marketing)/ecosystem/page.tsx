import type { Metadata } from "next";
import Link from "next/link";
import {
  Section,
  SectionHeading,
  Breadcrumbs,
  CTABand,
  Button,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Digitplus Ecosystem",
  description:
    "Beyond corporate IT solutions, the Digitplus ecosystem includes a hardware e-commerce store and a retail POS & inventory platform. Both launching soon.",
  alternates: { canonical: "/ecosystem" },
};

interface EcosystemProject {
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  status: "live" | "coming-soon";
}

const projects: EcosystemProject[] = [
  {
    name: "Digitplus Store",
    domain: "thedigitplus.com",
    url: "https://thedigitplus.com",
    tagline: "E-commerce for IT hardware",
    description:
      "An online store for genuine servers, workstations, networking, and peripherals from authorised channels, with transparent pricing and delivery across Nigeria.",
    status: "coming-soon",
  },
  {
    name: "Digitplus Retail",
    domain: "digitplusretail.com",
    url: "https://digitplusretail.com",
    tagline: "POS & inventory platform",
    description:
      "A point-of-sale and inventory management platform for retail businesses, built for Nigerian operations, from single shops to multi-branch chains.",
    status: "coming-soon",
  },
];

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={cn("h-3.5 w-3.5", className)}>
      <path
        d="M6 3h7v7M13 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EcosystemPage() {
  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Ecosystem" }]}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="The Digitplus ecosystem"
            title="One group, three ways we serve you"
            lede="This site is our corporate IT solutions arm. Alongside it, we are building two sister products, so whether you are buying hardware online or running a retail floor, there is a Digitplus platform built for it."
          />
        </FadeIn>
      </Section>

      <Section spacing="md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <FadeIn key={p.domain}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-2xl border border-hairline bg-surface-raised p-8",
                  "transition-colors duration-[var(--dur-base)] hover:border-neutral-300",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-caption font-medium uppercase tracking-[0.12em] text-muted">
                    {p.tagline}
                  </span>
                  {p.status === "coming-soon" && (
                    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-caption font-medium text-accent">
                      Coming soon
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-h3 font-semibold tracking-tight text-text">
                  {p.name}
                </h2>
                <p className="measure mt-3 flex-1 text-body text-muted">
                  {p.description}
                </p>

                <Link
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(
                    "mt-6 inline-flex items-center gap-1.5 text-small font-medium text-text",
                    "transition-colors duration-[var(--dur-fast)] hover:text-accent",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  )}
                >
                  {p.domain}
                  <ExternalIcon />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTABand
        title="Need enterprise IT, not a product?"
        description="That is what this arm of Digitplus does, procurement, infrastructure, and managed services for organisations. Let's talk about what you need."
      >
        <Button href="/contact" size="lg">
          Request an assessment
        </Button>
      </CTABand>
    </>
  );
}
