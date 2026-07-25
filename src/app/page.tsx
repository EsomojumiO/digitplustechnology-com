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
  Testimonial,
  CTABand,
  Eyebrow,
} from "@/components/ui";
import {
  FadeIn,
  Stagger,
  StaggerItem,
  Magnetic,
  ScrollScrubImage,
} from "@/components/motion";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { StickyStory } from "@/components/home/StickyStory";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { WhyPillar } from "@/components/home/WhyPillar";
import { IndustriesFilter } from "@/components/home/IndustriesFilter";
import { services, industries } from "@/lib/site";
import { whyUs, directTestimonials } from "@/data";
import { getFeaturedReport } from "@/lib/content";

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

export default function HomePage() {
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
            // Carries "Nigeria" into an H2 above the fold. The home H1 is the
            // hero carousel line ("IT that answers the phone"), which is the
            // best copy on the site and not worth trading for a keyword — but
            // without this the primary query appeared nowhere before the footer.
            title="Six services, one accountable partner, across Nigeria"
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
        {/* Same secondary style as "Explore our approach" — one section-CTA
            style sitewide. The manual arrow goes with it: the detail pages'
            "All services" / "All industries" buttons never had one. */}
        <FadeIn className="mt-10 flex justify-center">
          <Button href="/services" variant="secondary">
            All services
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
        <FadeIn className="mt-10 flex justify-center">
          <Button href="/industries" variant="secondary">
            All industries
          </Button>
        </FadeIn>
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

      {/* The Google-review strip used to sit here. It moved to the service
          pages it actually vouches for (hardware supply, IT procurement):
          they are retail/hardware-shop reviews, and as the ONLY social proof
          on a homepage arguing SLAs and audit trails they invited a buyer to
          reclassify us as a computer shop. See GoogleReviewStrip.
          Home's testimonial slot above stays dark until the three direct
          testimonials come back approved — an empty section beats borrowed
          proof. */}

      {/* REMOVED at the client's request (preview review):
          - the "By the numbers / Track record" stats band
          - the "Thinking for IT decision-makers" insights teaser
          Insights stay fully reachable from the header nav (with three featured
          articles in the dropdown) and from the footer, so removing the teaser
          costs home three contextual links but no route. Reversible: both blocks
          are in git at 72535a4, and DECISIONS.md records how to restore them if
          the internal-linking loss shows up in Search Console.
          The stats were NOT moved to /about — that page already carries the same
          four figures in its own "Track record" band, so there was nothing to
          move and no natural second slot to force them into. */}

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
                  <p className="text-body-lg text-muted measure lede">
                    {featuredReport.summary}
                  </p>
                  <div className="mt-2">
                    <Button href={`/reports/${featuredReport.slug}`} size="lg">
                      {/* Not "Download the … report": there is no download.
                          The gate and the PDF promise were removed when the
                          only file behind them was a 771-byte stub. */}
                      Read the {featuredReport.quarter} report
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
      <div className="relative isolate overflow-hidden bg-surface">
        <CTABand
          className="relative z-content bg-transparent"
          title="Tell us what you’re planning"
          description="A short conversation is the fastest way to see how we can help. No obligation."
          // One action per closing band. WhatsApp was a competing contact
          // channel sitting beside the primary CTA at the decision point;
          // it stays in the header dropdown, the footer and /contact.
          actions={
            <Magnetic strength={6}>
              <Button href="/contact" size="lg" variant="secondary">
                {ctaLabels.generic}
              </Button>
            </Magnetic>
          }
        />
      </div>
    </>
  );
}
