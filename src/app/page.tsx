import type { Metadata } from "next";
import Image from "next/image";
import {
  Hero,
  Section,
  SectionHeading,
  Grid,
  Card,
  Button,
  ServiceCard,
  IndustryCard,
  TrustStrip,
  StatGrid,
  Testimonial,
  ProcessStep,
  CTABand,
  Eyebrow,
  Badge,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig, services, industries } from "@/lib/site";
import {
  whyUs,
  processSteps,
  stats,
  testimonials,
} from "@/data";
import { getFeaturedArticles, getFeaturedReport } from "@/lib/content";

export const metadata: Metadata = {
  title:
    "Digitplus Technology — Plan. Procure. Deploy. Manage. | B2B IT Partner in Nigeria",
  description:
    "Digitplus Technology Limited is an end-to-end B2B IT partner for enterprises, government, and institutions across Nigeria — procurement, hardware supply, infrastructure, deployment, and managed services. Abuja HQ; Lagos and Port Harcourt delivery.",
};

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(3);
  const featuredReport = getFeaturedReport();

  return (
    <>
      {/* Hero */}
      <Hero
        aurora
        eyebrow="End-to-end IT solutions"
        title={siteConfig.tagline}
        subhead="One accountable partner for the full lifecycle of your IT — from planning and procurement to deployment and ongoing management. Built for organisations that need their technology to simply work."
        actions={
          <>
            <Button href="/contact" size="lg">
              Request a Free IT Assessment
            </Button>
            <Button href="/approach" size="lg" variant="secondary">
              See How We Work
            </Button>
          </>
        }
        coverage={`Abuja • Lagos • Port Harcourt`}
      />

      {/* Trust strip */}
      <Section tone="muted" spacing="sm">
        <Reveal>
          <TrustStrip label="Authorised technology partners" />
        </Reveal>
      </Section>

      {/* Services snapshot */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Six service lines, one accountable partner"
            lede="Each capability stands on its own — and works better together. Most clients start with one and grow into the rest."
          />
        </Reveal>
        <Reveal>
          <Grid columns={3} gap="md" className="mt-12">
            {services.map((s) => (
              <ServiceCard
                key={s.slug}
                href={`/services/${s.slug}`}
                title={s.title}
                blurb={s.short}
              />
            ))}
          </Grid>
        </Reveal>
        <Reveal className="mt-10">
          <Button href="/services" variant="ghost">
            View all services →
          </Button>
        </Reveal>
      </Section>

      {/* Why Digitplus */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="Why Digitplus"
            title="The difference is accountability"
            lede="Plenty of companies will sell you equipment. Fewer will own the outcome from end to end — and stand behind it afterwards."
          />
        </Reveal>
        <Reveal>
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
        </Reveal>
      </Section>

      {/* Philosophy quote */}
      <Section tone="inverse" spacing="lg">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-neutral-400">Our standard</Eyebrow>
          <p className="text-h2 mt-6 font-medium tracking-tight text-neutral-50">
            “Most IT projects don’t fail on the equipment. They fail in the gaps
            — between vendors, between purchase and deployment, between handover
            and support. We exist to close those gaps.”
          </p>
        </Reveal>
      </Section>

      {/* Process preview */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="A clear, documented process"
              lede="Six steps, the same discipline every time — from first conversation to long-term support."
              className="lg:sticky lg:top-28"
            />
            <div className="mt-8 lg:sticky lg:top-64">
              <Button href="/approach" variant="secondary">
                Explore our approach
              </Button>
            </div>
          </Reveal>
          <Reveal>
            <ol className="flex flex-col gap-8">
              {processSteps.map((s) => (
                <li key={s.step}>
                  <ProcessStep
                    step={s.step}
                    title={s.title}
                    description={s.description}
                  />
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      {/* Industries */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="Who we serve"
            title="Built around how your sector works"
            lede="Government procurement, branch uptime, clinical reliability, campus budgets — every sector has its own demands. We deliver to each."
          />
        </Reveal>
        <Reveal>
          <Grid columns={2} gap="md" className="mt-12">
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

      {/* Testimonials */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="In their words"
            title="What partnership looks like"
          />
        </Reveal>
        <Reveal>
          <Grid columns={3} gap="lg" className="mt-12">
            {testimonials.map((t, i) => (
              <Testimonial
                key={i}
                quote={t.quote}
                author={t.author}
                role={t.role}
                organization={t.organization}
                className="[&_blockquote]:text-body-lg"
              />
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* By the numbers */}
      <Section tone="raised">
        <Reveal>
          <SectionHeading eyebrow="By the numbers" title="Track record" />
        </Reveal>
        <Reveal>
          <StatGrid items={stats} className="mt-12" />
        </Reveal>
      </Section>

      {/* Featured insights */}
      {featuredArticles.length > 0 ? (
        <Section>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Insights"
                title="Thinking for IT decision-makers"
              />
              <Button href="/insights" variant="ghost">
                All insights →
              </Button>
            </div>
          </Reveal>
          <Reveal>
            <Grid columns={3} gap="md" className="mt-12">
              {featuredArticles.map((a) => (
                <a
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface-raised transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
                    <Image
                      src={a.cover}
                      alt={a.coverAlt}
                      fill
                      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-center gap-3 text-caption text-muted">
                      <Badge tone="accent">{a.category.label}</Badge>
                      <span>{a.readingTime.text}</span>
                    </div>
                    <h3 className="text-h4 text-text">{a.title}</h3>
                    <p className="text-small text-muted measure">{a.excerpt}</p>
                  </div>
                </a>
              ))}
            </Grid>
          </Reveal>
        </Section>
      ) : null}

      {/* Featured report */}
      {featuredReport ? (
        <Section tone="muted">
          <Reveal>
            <Card padding="lg" className="overflow-hidden">
              <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-center lg:gap-16">
                <div className="flex flex-col gap-5">
                  <Eyebrow>
                    Featured report · {featuredReport.quarter} {featuredReport.year}
                  </Eyebrow>
                  <h2 className="text-h2 text-text">{featuredReport.title}</h2>
                  <p className="text-body-lg text-muted measure">
                    {featuredReport.summary}
                  </p>
                  <div className="mt-2">
                    <Button href={`/reports/${featuredReport.slug}`} size="lg">
                      Read the report
                    </Button>
                  </div>
                </div>
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[18rem] overflow-hidden rounded-lg border border-hairline bg-surface">
                  <Image
                    src={featuredReport.cover}
                    alt={featuredReport.coverAlt}
                    fill
                    sizes="(min-width: 1024px) 20rem, 60vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          </Reveal>
        </Section>
      ) : null}

      {/* Closing CTA */}
      <CTABand
        title="Tell us what you’re planning"
        description="A short conversation is the fastest way to find out how we can help. Request a free IT assessment and we’ll come back with practical next steps — no obligation."
        actions={
          <>
            <Button href="/contact" size="lg" variant="secondary">
              Request a Free IT Assessment
            </Button>
            <Button
              href={siteConfig.whatsapp}
              size="lg"
              variant="ghost"
              className="text-neutral-50 hover:bg-white/10"
            >
              Chat on WhatsApp
            </Button>
          </>
        }
      />
    </>
  );
}
