import { notFound } from "next/navigation";
import { officeCta } from "@/lib/cta";
import {
  Section,
  SectionHeading,
  Card,
  Button,
  Breadcrumbs,
  CTABand,
  Badge,
  FAQ,
} from "@/components/ui";
import { FeatureImage } from "@/components/ui/FeatureImage";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site";
import { getLocation } from "@/data/locations";
import { JsonLd } from "@/lib/seo/jsonld";
import {
  localBusinessSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/schema";

/**
 * Shared renderer for the three city pages. Each route file supplies its own
 * static `metadata` and calls <LocationPage slug=… />; the substance lives in
 * data/locations.ts so the pages stay thin and can't drift apart in structure.
 *
 * Only the HQ (Abuja) shows a "find us" map link — Lagos and Port Harcourt are
 * delivery hubs with no premises, so their contact card names the Abuja office.
 * The link is a plain Google Maps search (no iframe): a Maps embed would load
 * Google's cookies before the consent banner is answered, which would undo the
 * NDPA gating on the analytics loader. The precise embedded verified-listing
 * map lands once the street address + Google Business Profile URL exist
 * (tracked in docs/BLOCKERS.md).
 */
export function LocationPage({ slug }: { slug: string }) {
  const loc = getLocation(slug);
  if (!loc) notFound();

  const isHq = loc.role === "Headquarters";
  const mapsQuery = encodeURIComponent(`${siteConfig.name} ${loc.city}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <>
      <JsonLd data={localBusinessSchema(loc)} />
      <JsonLd data={faqSchema(loc.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Locations", url: "/locations" },
          { name: loc.city },
        ])}
      />

      <Section spacing="sm">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Locations", href: "/locations" },
            { label: loc.city },
          ]}
        />
      </Section>

      <Section spacing="sm">
        <Reveal className="flex flex-col gap-6">
          <Badge tone={isHq ? "accent" : "neutral"} className="self-start">
            {loc.role}
          </Badge>
          <SectionHeading
            as="h1"
            eyebrow="Location"
            title={`IT company in ${loc.city}`}
          />
          <div className="flex flex-col gap-5">
            {loc.intro.map((para, i) => (
              <p key={i} className="text-body-lg text-muted measure lede">
                {para}
              </p>
            ))}
          </div>
          <FeatureImage
            src={`/images/locations/${loc.slug}.jpg`}
            alt={`Digitplus Technology in ${loc.city}`}
            label={loc.city}
            aspect="aspect-[21/9]"
            sizes="(min-width: 1024px) 60rem, 100vw"
          />
        </Reveal>
      </Section>

      {/* Operator's-eye local story */}
      <Section spacing="sm">
        <Reveal className="flex flex-col gap-5">
          {loc.localBody.map((para, i) => (
            <p key={i} className="text-body text-muted measure">
              {para}
            </p>
          ))}
        </Reveal>
      </Section>

      {/* Areas we cover */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="Coverage"
            title={`Areas we cover in ${loc.city}`}
          />
        </Reveal>
        <Reveal>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {loc.areasServed.map((area) => (
              <li
                key={area}
                className="rounded-full border border-hairline bg-surface-raised px-4 py-2 text-small text-text"
              >
                {area}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* How delivery works here */}
      <Section spacing="sm">
        <Reveal>
          <SectionHeading
            eyebrow="On the ground"
            title={`How delivery works in ${loc.city}`}
          />
        </Reveal>
        <Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {loc.logistics.map((item) => (
              <Card key={item.title} padding="md" className="flex flex-col gap-2">
                <h3 className="text-body font-semibold text-text">
                  {item.title}
                </h3>
                <p className="text-small text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Sectors we serve here */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow="Who we work with"
            title={`Sectors we serve in ${loc.city}`}
          />
        </Reveal>
        <Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {loc.sectorsServed.map((item) => (
              <Card key={item.title} padding="md" className="flex flex-col gap-2">
                <h3 className="text-body font-semibold text-text">
                  {item.title}
                </h3>
                <p className="text-small text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Contact / find us */}
      <Section spacing="sm">
        <Reveal>
          <Card padding="lg" className="flex flex-col gap-3">
            <span className="text-caption font-semibold uppercase tracking-[0.12em] text-muted">
              {isHq ? "Find us · Abuja" : "Head office · Abuja"}
            </span>
            <p className="text-body text-text">
              {siteConfig.hq} ·{" "}
              <a
                className="text-accent-green underline underline-offset-2"
                href={siteConfig.phoneHref}
              >
                {siteConfig.phone}
              </a>{" "}
              ·{" "}
              <a
                className="text-accent-green underline underline-offset-2"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </p>
            {isHq ? (
              <a
                className="mt-1 self-start text-small font-medium text-accent-green underline underline-offset-2"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps →
              </a>
            ) : null}
          </Card>
        </Reveal>
      </Section>

      {/* Local FAQ */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title={`Working with us in ${loc.city}`}
              className="lg:sticky lg:top-28"
            />
          </Reveal>
          <Reveal>
            <FAQ
              items={loc.faqs.map((f) => ({ question: f.q, answer: f.a }))}
            />
          </Reveal>
        </div>
      </Section>

      <CTABand
        title={`Planning IT work in ${loc.city}?`}
        description="Tell us what you’re planning and we’ll come back with practical next steps."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {officeCta(loc.city, isHq)}
          </Button>
        }
      />
    </>
  );
}

export default LocationPage;
