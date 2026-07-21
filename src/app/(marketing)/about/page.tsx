import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
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
import { FeatureImage } from "@/components/ui/FeatureImage";
import { FadeIn, CountUp } from "@/components/motion";
import { siteConfig } from "@/lib/site";
import { whyUs } from "@/data";
import { JsonLd } from "@/lib/seo/jsonld";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About Digitplus, a Nigerian IT Partner",
  description:
    "Digitplus Technology Limited is a CAC-registered, Abuja-based B2B IT solutions company operating since 2022, serving enterprise and government across Nigeria.",
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
            lede="Digitplus Technology Limited exists to make enterprise IT in Nigeria predictable: one accountable partner from plan to support, genuine authorised-channel hardware, and delivery documentation your auditors will accept."
          />
        </FadeIn>
      </Section>

      {/* Story */}
      {/* Strict two-tone alternation: white hero -> #f5f5f7 band. This section
          previously repeated the hero's white, stacking padding into a 439px
          hole. The team image band lands here, where the hole was. */}
      <Section tone="muted" spacing="md">
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
        {/*
          NO TEAM PHOTO until the client supplies one (BLOCKERS #8).
          This slot held /images/about/team.jpg — Unsplash stock showing about
          fifteen identifiable people in a visibly American boardroom — under
          the caption "Our team" and the alt "The Digitplus Technology team".
          That is not a placeholder, it is a false claim about real, identifiable
          people who do not work here, on the page a buyer reads to find out who
          they would be working with. It also failed the imagery policy the
          insight covers were audited against (Nigerian/Black subjects where
          people appear). A gap in the layout is the honest state; restore this
          block with a real photograph of the real team.
        */}
      </Section>

      {/* Credentials */}
      <Section>
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
                Delivering IT to enterprises, government, and institutions across
                Nigeria since 2022, and supporting it long-term.
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
              // NOT a client count. "50+ enterprise clients" is unverifiable —
              // the site names no clients and shows no case studies, so a
              // procurement lead who asks "which fifty?" gets nothing. It was
              // removed from stats.ts during the copy audit but survived here,
              // hard-coded, on the one page the register claimed was fixed.
              // Replaced with the same verifiable figure home already uses.
              {
                value: <CountUp value={8} />,
                label: "Industries served",
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
      <Section tone="muted" spacing="lg">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-muted">Our commitment</Eyebrow>
          <p className="text-h3 mt-6 font-medium tracking-tight text-text">
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
            {ctaLabels.generic}
          </Button>
        }
      />
    </>
  );
}
