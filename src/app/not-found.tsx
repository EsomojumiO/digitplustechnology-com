import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
import { Section, Container, Button, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Branded 404. Sentence-case, on-voice, with clear ways back into the site.
 * Rendered inside the root layout, so the header/footer nav is already present.
 */
export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container width="narrow" className="flex flex-col items-start gap-6">
        <Eyebrow>Error · 404</Eyebrow>
        <h1 className="text-h1 text-balance text-text">
          This page has moved, or never existed
        </h1>
        <p className="text-body-lg measure lede text-muted">
          The link may be out of date. Here is the way back — head home, browse
          what we do, or tell us what you were looking for.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/services" size="lg" variant="secondary">
            Our services
          </Button>
          <Button href="/contact" variant="ghost">
            {ctaLabels.generic}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
