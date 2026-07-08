import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Grid,
  Card,
  Button,
  Breadcrumbs,
  StatGrid,
  CTABand,
  Eyebrow,
  Prose,
} from "@/components/ui";
import { FadeIn, CountUp } from "@/components/motion";
import { siteConfig } from "@/lib/site";
import { whyUs } from "@/data";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About Us, A Disciplined, Accountable Nigerian IT Partner",
  description:
    "Digitplus Technology Limited is a CAC-registered, Abuja-based B2B IT solutions company operating since 2022, with 50+ enterprise clients. End-to-end IT built on operational discipline.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About" },
        ])}
      />
      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="About us"
            title="A disciplined IT partner, not just a supplier"
            lede="Digitplus Technology Limited exists to take the uncertainty out of IT for Nigerian organisations, by owning the whole journey from plan to support, and doing it with the discipline that serious operations require."
          />
        </FadeIn>
      </Section>

      {/* Story */}
      <Section spacing="md">
        <FadeIn>
          <Prose>
            <h2>Why we exist</h2>
            <p>
              Across government, banking, healthcare, and enterprise, we kept
              seeing the same pattern: capable organisations let down not by bad
              equipment, but by the gaps around it. Procurement that couldn’t
              survive an audit. Hardware bought from one place, installed by
              another, supported by no one. Projects where everyone was involved
              and no one was accountable.
            </p>
            <p>
              Digitplus was built to close those gaps. We bring procurement,
              hardware supply, infrastructure, deployment, advisory, and managed
              services under one accountable roof, so there is a single partner
              responsible for the outcome, with the documentation to prove how it
              was delivered.
            </p>
            <h2>Operational discipline</h2>
            <p>
              Discipline is the thread through everything we do. We source only
              through authorised channels. We document every step of a purchase.
              We test against agreed criteria before we sign off. We put our
              service commitments in writing. None of this is glamorous, it is
              simply what it takes to be a partner serious organisations can
              depend on, year after year.
            </p>
          </Prose>
        </FadeIn>
      </Section>

      {/* Credentials */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="Credentials"
            title="The foundations behind the work"
          />
        </FadeIn>
        <FadeIn>
          <Grid columns={3} gap="md" className="mt-12">
            <Card padding="lg">
              <h3 className="text-h4 text-text">CAC-registered</h3>
              <p className="text-body text-muted measure mt-3">
                A registered Nigerian limited company, operating formally and
                accountably as Digitplus Technology Limited.
              </p>
            </Card>
            <Card padding="lg">
              <h3 className="text-h4 text-text">Operating since 2022</h3>
              <p className="text-body text-muted measure mt-3">
                Nearly a decade delivering IT to enterprises, government, and
                institutions across Nigeria, and supporting it long-term.
              </p>
            </Card>
            <Card padding="lg">
              <h3 className="text-h4 text-text">Authorised channels</h3>
              <p className="text-body text-muted measure mt-3">
                We supply through authorised reseller and distribution channels,
                so equipment is genuine and warranties are valid.
              </p>
            </Card>
          </Grid>
        </FadeIn>
      </Section>

      {/* By the numbers */}
      <Section tone="raised">
        <FadeIn>
          <SectionHeading eyebrow="By the numbers" title="Track record" />
        </FadeIn>
        <FadeIn>
          <StatGrid
            className="mt-12"
            items={[
              // Real founding year — not a computed "X+ years" (which inflates).
              { value: "2022", label: "Operating since" },
              {
                value: <CountUp value={50} suffix="+" />,
                label: "Enterprise clients",
              },
              {
                value: <CountUp value={6} />,
                label: "Service lines",
              },
              { value: "Abuja", label: "Headquarters" },
            ]}
          />
        </FadeIn>
      </Section>

      {/* What sets us apart */}
      <Section>
        <FadeIn>
          <SectionHeading
            eyebrow="What sets us apart"
            title="Four commitments we hold to"
          />
        </FadeIn>
        <FadeIn>
          <Grid columns={2} gap="lg" className="mt-12">
            {whyUs.map((pillar) => (
              <Card key={pillar.title} padding="lg">
                <h3 className="text-h4 text-text">{pillar.title}</h3>
                <p className="text-body text-muted measure mt-3">
                  {pillar.description}
                </p>
              </Card>
            ))}
          </Grid>
        </FadeIn>
      </Section>

      {/* Trust / compliance statement */}
      <Section tone="inverse" spacing="lg">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-neutral-400">Our commitment</Eyebrow>
          <p className="text-h3 mt-6 font-medium tracking-tight text-neutral-50">
            We treat your procurement, your data, and your operations with the
            same care we would expect for our own, genuine equipment,
            transparent records, and a privacy-first stance on the information
            you share with us.
          </p>
        </FadeIn>
      </Section>

      <CTABand
        title="Let’s build something dependable"
        description={`Reach us at ${siteConfig.email} or start a conversation. We’ll respond with practical next steps.`}
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            Partner with Digitplus
          </Button>
        }
      />
    </>
  );
}
