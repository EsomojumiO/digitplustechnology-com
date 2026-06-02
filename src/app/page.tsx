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
  StatGrid,
  Testimonial,
  ProcessStep,
  CTABand,
  Eyebrow,
} from "@/components/ui";
import {
  FadeIn,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
} from "@/components/motion";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { WhyPillar } from "@/components/home/WhyPillar";
import { IndustriesFilter } from "@/components/home/IndustriesFilter";
import { InsightShelfCard } from "@/components/home/ContentShelf";
import { siteConfig, services, industries } from "@/lib/site";
import { whyUs, processSteps, stats, testimonials } from "@/data";
import { getFeaturedArticles, getFeaturedReport } from "@/lib/content";

export const metadata: Metadata = {
  title:
    "Digitplus Technology — Plan. Procure. Deploy. Manage. | B2B IT Partner in Nigeria",
  description:
    "Digitplus Technology Limited is an end-to-end B2B IT partner for enterprises, government, and institutions across Nigeria — procurement, hardware supply, infrastructure, deployment, and managed services. Abuja HQ; Lagos and Port Harcourt delivery.",
};

/* Raycast-style two-beat leads for the four Why Digitplus pillars, mapped to
   the existing whyUs data (which carries the longer supporting copy). */
const whyBeats: { label: string; beat: string }[] = [
  { label: "Accountable", beat: "one partner, end to end." },
  { label: "Nationwide", beat: "Abuja, Lagos, Port Harcourt." },
  { label: "Trusted", beat: "8+ years, 50+ clients." },
  { label: "Disciplined", beat: "documented, audit-ready." },
];

/* Map the by-the-numbers stats to animated CountUp figures. "Abuja" stays plain
   text. Pattern: leading integer + suffix. */
function StatValue({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  if (!match) return <>{value}</>;
  return <CountUp value={Number(match[1])} suffix={match[2]} />;
}

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(3);
  const featuredReport = getFeaturedReport();

  return (
    <>
      {/* Hero — signature motif + aurora; magnetic primary CTA */}
      <Hero
        aurora
        motif
        eyebrow="End-to-end IT solutions"
        title={siteConfig.tagline}
        subhead="One accountable partner for the full lifecycle of your IT — from planning and procurement to deployment and ongoing management. Built for organisations that need their technology to simply work."
        actions={
          <>
            <Magnetic strength={6}>
              <Button href="/contact" size="lg">
                Request a Free IT Assessment
              </Button>
            </Magnetic>
            <Button href="/approach" size="lg" variant="secondary">
              See How We Work
            </Button>
          </>
        }
        coverage={`Abuja • Lagos • Port Harcourt`}
      />

      {/* Trust strip — partner logos on a slow seamless marquee */}
      <Section tone="muted" spacing="sm">
        <FadeIn>
          <TrustMarquee label="Authorised technology partners" />
        </FadeIn>
      </Section>

      {/* Services snapshot */}
      <Section>
        <FadeIn>
          <SectionHeading
            eyebrow="What we do"
            title="Six service lines, one accountable partner"
            lede="Each capability stands on its own — and works better together. Most clients start with one and grow into the rest."
          />
        </FadeIn>
        <Stagger>
          <Grid columns={3} gap="md" className="mt-12">
            {services.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <ServiceCard
                  href={`/services/${s.slug}`}
                  title={s.title}
                  blurb={s.short}
                  className="h-full"
                />
              </StaggerItem>
            ))}
          </Grid>
        </Stagger>
        <FadeIn className="mt-10">
          <Button href="/services" variant="ghost">
            View all services →
          </Button>
        </FadeIn>
      </Section>

      {/* Why Digitplus — two-beat pillars */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="Why Digitplus"
            title="The difference is accountability"
            lede="Plenty of companies will sell you equipment. Fewer will own the outcome from end to end — and stand behind it afterwards."
          />
        </FadeIn>
        <Stagger>
          <Grid columns={2} gap="lg" className="mt-12">
            {whyUs.map((pillar, i) => (
              <StaggerItem key={pillar.title} className="h-full">
                <WhyPillar
                  label={whyBeats[i]?.label ?? pillar.title}
                  beat={whyBeats[i]?.beat ?? ""}
                  description={pillar.description}
                />
              </StaggerItem>
            ))}
          </Grid>
        </Stagger>
      </Section>

      {/* Philosophy quote */}
      <Section tone="inverse" spacing="lg">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-neutral-400">Our standard</Eyebrow>
          <p className="text-h2 mt-6 font-medium tracking-tight text-neutral-50">
            “Most IT projects don’t fail on the equipment. They fail in the gaps
            — between vendors, between purchase and deployment, between handover
            and support. We exist to close those gaps.”
          </p>
        </FadeIn>
      </Section>

      {/* Process preview */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <FadeIn>
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
          </FadeIn>
          <Stagger role="list" className="flex flex-col gap-8">
            {processSteps.map((s) => (
              <StaggerItem key={s.step} role="listitem">
                <ProcessStep
                  step={s.step}
                  title={s.title}
                  description={s.description}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Industries — filterable grid */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="Who we serve"
            title="Built around how your sector works"
            lede="Government procurement, branch uptime, clinical reliability, campus budgets — every sector has its own demands. We deliver to each."
          />
        </FadeIn>
        <IndustriesFilter
          industries={industries.map((i) => ({
            slug: i.slug,
            title: i.title,
            short: i.short,
          }))}
        />
      </Section>

      {/* Testimonials */}
      <Section>
        <FadeIn>
          <SectionHeading
            eyebrow="In their words"
            title="What partnership looks like"
          />
        </FadeIn>
        <Stagger>
          <Grid columns={3} gap="lg" className="mt-12">
            {testimonials.map((t, i) => (
              <StaggerItem key={i} className="h-full">
                <Testimonial
                  quote={t.quote}
                  author={t.author}
                  role={t.role}
                  organization={t.organization}
                  className="h-full [&_blockquote]:text-body-lg"
                />
              </StaggerItem>
            ))}
          </Grid>
        </Stagger>
      </Section>

      {/* By the numbers — animated count-up */}
      <Section tone="raised">
        <FadeIn>
          <SectionHeading eyebrow="By the numbers" title="Track record" />
        </FadeIn>
        <FadeIn>
          <StatGrid
            className="mt-12"
            items={stats.map((s) => ({
              ...s,
              value: <StatValue value={s.value} />,
            }))}
          />
        </FadeIn>
      </Section>

      {/* Featured insights — glass-framed content shelf */}
      {featuredArticles.length > 0 ? (
        <Section>
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Insights"
                title="Thinking for IT decision-makers"
              />
              <Button href="/insights" variant="ghost">
                All insights →
              </Button>
            </div>
          </FadeIn>
          <Stagger>
            <Grid columns={3} gap="md" className="mt-12">
              {featuredArticles.map((a) => (
                <StaggerItem key={a.slug} className="h-full">
                  <InsightShelfCard
                    href={`/insights/${a.slug}`}
                    cover={a.cover}
                    coverAlt={a.coverAlt}
                    categoryLabel={a.category.label}
                    readingTime={a.readingTime.text}
                    title={a.title}
                    excerpt={a.excerpt}
                  />
                </StaggerItem>
              ))}
            </Grid>
          </Stagger>
        </Section>
      ) : null}

      {/* Featured report — frosted glass shelf */}
      {featuredReport ? (
        <Section tone="muted">
          <FadeIn>
            <Card
              padding="lg"
              className="overflow-hidden border-hairline bg-surface-raised/70 backdrop-blur-md"
            >
              <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-center lg:gap-16">
                <div className="flex flex-col gap-5">
                  <Eyebrow>
                    Featured report · {featuredReport.quarter}{" "}
                    {featuredReport.year}
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
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[18rem] overflow-hidden rounded-lg border border-hairline bg-surface shadow-[var(--shadow-lg)]">
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
          </FadeIn>
        </Section>
      ) : null}

      {/* Closing CTA band over an aurora glow */}
      <div className="relative overflow-hidden bg-brand">
        <div className="aurora" aria-hidden="true" />
        <CTABand
          className="relative z-10 bg-transparent"
          tone="inverse"
          title="Tell us what you’re planning"
          description="A short conversation is the fastest way to find out how we can help. Request a free IT assessment and we’ll come back with practical next steps — no obligation."
          actions={
            <>
              <Magnetic strength={6}>
                <Button href="/contact" size="lg" variant="secondary">
                  Request a Free IT Assessment
                </Button>
              </Magnetic>
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
      </div>
    </>
  );
}
