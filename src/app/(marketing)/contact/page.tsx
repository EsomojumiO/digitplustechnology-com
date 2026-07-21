import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Card,
  Breadcrumbs,
  Eyebrow,
  Button,
} from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { ContactForm } from "@/components/forms";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  // "get a quote" is the retired CTA label. The conformance gate only reads
  // rendered CTA text, so it survived here in the tab title and the SERP snippet.
  title: "Contact Digitplus — tell us what you're planning",
  description:
    "Talk to Digitplus about your IT project by email, phone or WhatsApp — Abuja HQ, delivery across Lagos and Port Harcourt. We'll come back with next steps.",
  alternates: { canonical: "/contact" },
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-hairline py-4 last:border-0">
      <span className="text-caption font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <span className="text-body text-text">{children}</span>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Tell us what you’re planning"
            lede="Share a little about your project, timeline, and the locations involved. We’ll respond with practical next steps, and there’s no obligation."
          />
        </FadeIn>
      </Section>

      <Section spacing="md">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Form */}
          <FadeIn>
            <ContactForm />
          </FadeIn>

          {/* Direct details */}
          <FadeIn delay={0.08}>
            <Card
              padding="lg"
              className="flex flex-col gap-6 lg:sticky lg:top-28"
            >
              <div>
                <Eyebrow>Reach us directly</Eyebrow>
                <p className="text-body text-muted measure mt-3">
                  Prefer to talk first? Use any of the channels below, we read
                  everything that comes in.
                </p>
              </div>

              <div className="flex flex-col">
                <DetailRow label="Email">
                  <a
                    className="font-medium text-accent-green underline decoration-from-font underline-offset-2 hover:text-accent-green"
                    href={`mailto:${siteConfig.email}`}
                  >
                    {siteConfig.email}
                  </a>
                </DetailRow>
                <DetailRow label="Phone">
                  <a
                    className="font-medium text-accent-green underline decoration-from-font underline-offset-2 hover:text-accent-green"
                    href={siteConfig.phoneHref}
                  >
                    {siteConfig.phone}
                  </a>
                </DetailRow>
                <DetailRow label="WhatsApp">
                  <a
                    className="font-medium text-accent-green underline decoration-from-font underline-offset-2 hover:text-accent-green"
                    href={siteConfig.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </DetailRow>
                <DetailRow label="Headquarters">{siteConfig.hq}</DetailRow>
                <DetailRow label="Coverage">
                  {siteConfig.coverage.join(" • ")}, and nationwide on request
                </DetailRow>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  href={siteConfig.whatsapp}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Chat on WhatsApp
                </Button>
                <Button
                  href={siteConfig.phoneHref}
                  variant="ghost"
                  className="w-full sm:w-auto"
                >
                  Call us
                </Button>
              </div>

              <p className="text-caption text-muted">
                Your details are used only to respond to your enquiry. We never
                sell or share them with third parties.
              </p>
            </Card>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
