import type { Metadata } from "next";
import { ctaLabels } from "@/lib/cta";
import Image from "next/image";
import {
  Section,
  SectionHeading,
  Grid,
  Card,
  Button,
  ServiceCard,
  StatGrid,
  Testimonial,
  CTABand,
  Eyebrow,
} from "@/components/ui";
import {
  FadeIn,
  Stagger,
  StaggerItem,
  CountUp,
  Magnetic,
  ScrollScrubImage,
} from "@/components/motion";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { StickyStory } from "@/components/home/StickyStory";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { WhyPillar } from "@/components/home/WhyPillar";
import { IndustriesFilter } from "@/components/home/IndustriesFilter";
import { InsightShelfCard } from "@/components/home/ContentShelf";
import { siteConfig, services, industries } from "@/lib/site";
import { whyUs, processSteps, stats, googleReviews, directTestimonials } from "@/data";
import { getFeaturedArticles, getFeaturedReport } from "@/lib/content";

export const metadata: Metadata = {
  title: "IT Solutions Company in Nigeria | Digitplus Technology",
  description:
    "Digitplus is a B2B IT solutions company in Nigeria — IT procurement, hardware supply, infrastructure and managed services for enterprise and government.",
};

/* Raycast-style two-beat leads for the four Why Digitplus pillars, mapped to
   the existing whyUs data (which carries the longer supporting copy). */
const whyBeats: { label: string; beat: string }[] = [
  { label: "Accountable", beat: "one partner, end to end." },
  { label: "Nationwide", beat: "Abuja, Lagos, Port Harcourt." },
  { label: "Experienced", beat: "government, banking, healthcare." },
  { label: "Disciplined", beat: "documented, audit-ready." },
];

/* Map the by-the-numbers stats to animated CountUp figures. "Abuja" stays plain
   text. Pattern: leading integer + suffix. */
function StatValue({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  if (!match) return <>{value}</>;
  const n = Number(match[1]);
  // Don't animate a calendar year — a ticking "2022" reads as a counter, not a date.
  if (match[2] === "" && n >= 1900) return <>{value}</>;
  return <CountUp value={n} suffix={match[2]} />;
}

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(3);
  const featuredReport = getFeaturedReport();

  return (
    <>
      {/* Hero — full-bleed overlay carousel. The headline sits ON the image now
          (the split text/carousel hero is gone). The h1 lives on slide one; the
          other slides' headlines are styled paragraphs so the page keeps exactly
          one h1. */}
      <HeroCarousel />

      {/* Trust strip, partner logos on a slow seamless marquee */}
      <Section tone="muted" spacing="sm">
        <FadeIn>
          <TrustMarquee />
        </FadeIn>
      </Section>

      {/* Services snapshot */}
      <Section>
        <FadeIn>
          <SectionHeading
            eyebrow="What we do"
            title="Six services, one accountable partner"
            lede="Procurement, infrastructure, deployment, support. Start with one; we grow into the rest as you need us."
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
            All services →
          </Button>
        </FadeIn>
      </Section>

      {/* Why Digitplus, two-beat pillars */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="Why Digitplus"
            title="The difference is accountability"
            lede="Anyone can sell equipment; few will own the outcome end to end."
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
      <Section tone="muted" spacing="lg">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-muted">Our standard</Eyebrow>
          <p className="text-h2 mt-6 font-medium tracking-tight text-text">
            “Most IT projects fail in the gaps, between vendors, between purchase
            and deployment, between handover and support. We close them.”
          </p>
        </FadeIn>
      </Section>

      {/* Full-bleed image band — edge to edge, scrubbed against scroll. The one
          place on home where a photograph gets the whole width. */}
      <ScrollScrubImage
        src="/images/hero/hero-datacenter.jpg"
        alt="Data-centre hardware supply"
        aspect="aspect-[3/2] sm:aspect-[21/9]"
        sizes="100vw"
      />

      {/* Process — now the sticky-storytelling moment (client-confirmed: home).
          Same eyebrow, headline, lede, six steps and CTA as before; the pinned
          visual is the only thing that's new. Copy unchanged. */}
      <Section spacing="lg">
        <FadeIn>
          <SectionHeading
            eyebrow="How we work"
            title="A clear, documented process"
            lede="Discovery to handover, six steps, the same documentation and sign-off every time."
          />
        </FadeIn>
        <div className="mt-16">
          <StickyStory />
        </div>
        <FadeIn className="mt-12 flex justify-center">
          <Button href="/approach" variant="secondary">
            Explore our approach
          </Button>
        </FadeIn>
      </Section>

      {/* Industries, filterable grid */}
      <Section tone="muted">
        <FadeIn>
          <SectionHeading
            eyebrow="Who we serve"
            title="Built around how your sector works"
            lede="A hospital can't absorb the downtime a warehouse can. We size, document and support the work to each sector's constraints."
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

      {/* Testimonials — main cards are APPROVED direct testimonials only. The
          section renders nothing at all while approvals are outstanding: an
          "In their words" heading over an empty grid is worse than no section,
          and the alternative (publishing unapproved drafts) isn't an option. */}
      {directTestimonials.length > 0 ? (
        <Section>
          <FadeIn>
            <SectionHeading
              eyebrow="In their words"
              title="What partnership looks like"
            />
          </FadeIn>
          <Stagger>
            <Grid columns={3} gap="lg" className="mt-12">
              {directTestimonials.map((t) => (
                <StaggerItem key={t.name} className="h-full">
                  <Testimonial
                    quote={t.quote}
                    author={t.name}
                    role={t.title}
                    organization={t.company}
                    className="h-full"
                  />
                </StaggerItem>
              ))}
            </Grid>
          </Stagger>
        </Section>
      ) : null}

      {/* Google reviews — public, verbatim, supporting strip. Deliberately a
          strip and not the main cards: these are retail/hardware-store reviews,
          so they vouch for the supply line honestly but say nothing about
          enterprise managed services. Overselling them as enterprise proof is
          the kind of thing a reader spots immediately. */}
      {googleReviews.length > 0 ? (
        <Section tone="muted" spacing="sm">
          <FadeIn className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-caption font-semibold text-accent-green">
                <span aria-hidden="true">★★★★★</span>
                <span className="sr-only">Five star rating</span>
              </p>
              <a
                href={siteConfig.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                // Named for screen readers: "From our Google reviews" alone
                // doesn't say it leaves the site or where it lands.
                aria-label="From our Google reviews — read them on our Google Business profile (opens in a new tab)"
                className="text-small font-medium text-text underline decoration-from-font underline-offset-2 transition-colors duration-[var(--dur-fast)] hover:text-accent-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
              >
                From our Google reviews
              </a>
            </div>
            <ul className="grid w-full grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {googleReviews.map((r) => (
                <li key={r.name} className="flex flex-col gap-1.5">
                  <p className="text-body text-text">&ldquo;{r.quote}&rdquo;</p>
                  <p className="text-caption text-muted">
                    {r.name} <span aria-hidden="true">·</span> Google review
                  </p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </Section>
      ) : null}

      {/* By the numbers, animated count-up */}
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

      {/* Featured insights, glass-framed content shelf */}
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

      {/* Featured report, frosted glass shelf */}
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
                      Download the {featuredReport.quarter} report
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

      {/* Closing CTA band — separation by background alternation, not by glow */}
      <div className="relative overflow-hidden bg-surface">
        <CTABand
          className="relative z-10 bg-transparent"
          title="Tell us what you’re planning"
          description="A short conversation is the fastest way to see how we can help. No obligation."
          actions={
            <>
              <Magnetic strength={6}>
                <Button href="/contact" size="lg" variant="secondary">
                  {ctaLabels.generic}
                </Button>
              </Magnetic>
              <Button
                href={siteConfig.whatsapp}
                size="lg"
                variant="ghost"
                className="text-text hover:bg-surface"
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
