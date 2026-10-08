import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { ctaLabels } from "@/lib/cta";
import {
  Section,
  SectionHeading,
  Breadcrumbs,
  CTABand,
  Button,
  Card,
  Eyebrow,
  ProcessStep,
} from "@/components/ui";
import { ArrowRight, Check } from "@/components/ui/icons";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";
import { siteConfig, services, industries } from "@/lib/site";
import { getAllArticles, type ArticleMeta } from "@/lib/content";
import { portfolioProjects, processSteps, type PortfolioProject } from "@/data";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo/schema";

/**
 * Portfolio, /portfolio
 *
 * The work itself: one entry per real project, each resolved against its
 * published case-study write-up(s). Project facts live in src/data/portfolio.ts
 * and come only from those articles.
 *
 * NO PHOTOGRAPHS, deliberately. The case-study covers are interim Unsplash
 * stock (BLOCKERS #8, #11). Under an article they read as illustration; on a
 * portfolio a photo reads as "this is the job", which would be a false claim
 * about a hospital corridor and a computer room we did not build. The spec
 * panel carries the visual weight instead. Add an image field to the data
 * only when it is a photograph of the actual site.
 */

const PATH = "/portfolio";
const DESCRIPTION =
  "Real Digitplus projects: workstations and printing for a hospital in Abuja, managed devices for a law practice, and a solar-powered school lab in Ondo State.";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio: Projects We Have Delivered",
  description: DESCRIPTION,
  path: PATH,
});

const NUMBER_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

const serviceTitle = (slug: string) =>
  services.find((s) => s.slug === slug)?.title ?? slug;
const industryTitle = (slug: string) =>
  industries.find((i) => i.slug === slug)?.title ?? slug;

/* Static per-count classes: Tailwind cannot see an interpolated class name. */
const FIGURE_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/* Green ink link with a 44px target below sm:. Same treatment as the ecosystem
   page's outbound links. */
const inkLink = cn(
  "inline-flex min-h-11 items-center gap-1.5 font-medium text-accent-green sm:min-h-0",
  "underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:underline",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
);

type ResolvedProject = PortfolioProject & { articles: ArticleMeta[] };

export default function PortfolioPage() {
  // Resolve write-ups through the content layer. A slug that is not published
  // (a follow-on still in draft) is dropped rather than linked to a 404.
  const bySlug = new Map(getAllArticles().map((a) => [a.slug, a]));
  const projects: ResolvedProject[] = portfolioProjects.map((p) => ({
    ...p,
    articles: p.writeUps
      .map((slug) => bySlug.get(slug))
      .filter((a): a is ArticleMeta => Boolean(a)),
  }));

  const writeUps = projects.flatMap((p) => p.articles);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Portfolio" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${absoluteUrl(PATH)}#webpage`,
          url: absoluteUrl(PATH),
          name: "Portfolio",
          description: DESCRIPTION,
          isPartOf: { "@id": `${siteConfig.url}/#website` },
          publisher: { "@id": `${siteConfig.url}/#organization` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: writeUps.length,
            itemListElement: writeUps.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/insights/${a.slug}`),
              name: a.title,
            })),
          },
        }}
      />

      <Section spacing="sm">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
        />
      </Section>

      <Section spacing="sm">
        <FadeIn>
          <SectionHeading
            as="h1"
            eyebrow="Portfolio"
            title="What we have built"
            lede={`${countWord(projects.length)} projects, each written up in full: what we delivered and the decision that mattered. Client names are withheld. The engineering is not.`}
          />
        </FadeIn>
      </Section>

      {/* The projects. One considered entry each, separated by hairlines, on
          the grey band so the white spec panels lift without a shadow. */}
      <Section tone="muted" spacing="md">
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <ProjectEntry key={project.id} project={project} index={i + 1} />
          ))}
        </div>

        {/* Room for more, said plainly. No placeholder cards. */}
        <p className="measure mt-12 border-t border-hairline pt-8 text-body text-muted sm:mt-16">
          {countWord(projects.length)} projects so far. More write-ups follow as
          work closes, and they appear in our{" "}
          <Link href="/insights/case-studies" className={cn(inkLink, "min-h-0")}>
            case studies
          </Link>{" "}
          as they are published.
        </p>
      </Section>

      {/* How we build. Reuses the approach data rather than restating it. */}
      <Section spacing="md">
        <FadeIn>
          <SectionHeading
            align="left"
            eyebrow="How we work"
            title="The same six steps under every project"
            lede="Each step exists to remove one way IT projects usually go wrong. The approach page walks through them in detail."
          />
        </FadeIn>
        <FadeIn>
          <ol className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <li key={step.step} className="border-t border-hairline pt-6">
                <ProcessStep
                  step={step.step}
                  title={step.title}
                  description={step.description}
                />
              </li>
            ))}
          </ol>
        </FadeIn>
        <div className="mt-12">
          <Button href="/approach" variant="ghost">
            See the full delivery process
            <ArrowRight size={16} />
          </Button>
        </div>
      </Section>

      <CTABand
        title="Have a project like these?"
        description="Tell us the site and what the system has to do there. Discovery comes first, and it costs you nothing but a conversation."
        actions={
          <Button href="/contact" size="lg" variant="secondary">
            {ctaLabels.generic}
          </Button>
        }
      />
    </>
  );
}

function ProjectEntry({
  project,
  index,
}: {
  project: ResolvedProject;
  index: number;
}) {
  const headingId = `${project.id}-title`;
  return (
    <article
      id={project.id}
      aria-labelledby={headingId}
      className={cn(
        "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16",
        // Hairline between entries, not above the first.
        index > 1 && "mt-16 border-t border-hairline pt-16 sm:mt-24 sm:pt-24",
      )}
    >
      {/* Left rail: what and where. Sticky on wide screens so the facts stay
          beside the detail as it scrolls. Sticky, not fixed: no layer needed. */}
      <FadeIn className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="text-small font-semibold tabular-nums text-muted"
          >
            {String(index).padStart(2, "0")}
          </span>
          <Eyebrow>{project.sector}</Eyebrow>
        </div>

        <h2 id={headingId} className="mt-6 text-h2 text-text">
          {project.title}
        </h2>
        <p className="measure mt-4 text-body-lg text-muted">
          {project.summary}
        </p>

        <dl className="mt-8 flex flex-col border-t border-hairline text-small">
          <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-hairline py-3">
            <dt className="text-muted">Location</dt>
            <dd className="text-text">{project.location}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-hairline py-3 sm:items-start">
            <dt className="text-muted">Industry</dt>
            <dd>
              <Link href={`/industries/${project.industry}`} className={inkLink}>
                {industryTitle(project.industry)}
              </Link>
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-hairline py-3">
            <dt className="pt-3 text-muted sm:pt-0">Services</dt>
            <dd>
              <ul className="flex flex-col sm:gap-1">
                {project.services.map((slug) => (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className={inkLink}>
                      {serviceTitle(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        {project.articles.length > 0 ? (
          <div className="mt-8">
            <p className="text-small font-semibold text-text">
              {project.articles.length > 1
                ? "Read the write-ups"
                : "Read the write-up"}
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {project.articles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/insights/${a.slug}`}
                    className={cn(inkLink, "items-start text-body")}
                  >
                    <span>{a.title}</span>
                    <ArrowRight size={16} className="mt-1 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </FadeIn>

      {/* Right: the spec. */}
      <FadeIn className="flex flex-col gap-12 lg:col-span-7">
        <Card padding="lg">
          <dl
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-8",
              FIGURE_COLS[project.figures.length],
            )}
          >
            {project.figures.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-2">
                <dt className="text-small text-muted">{f.label}</dt>
                <dd className="text-h2 tabular-nums text-text">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div>
          <h3 className="text-h4 text-text">What we delivered</h3>
          <ul className="mt-4 flex flex-col">
            {project.delivered.map((line) => (
              <li
                key={line}
                className="flex gap-3 border-t border-hairline py-3 text-body text-text"
              >
                <Check
                  size={16}
                  className="mt-1 shrink-0 text-accent-green"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
          <div>
            <h3 className="text-h4 text-text">The constraint</h3>
            <p className="mt-3 text-body text-muted">{project.constraint}</p>
          </div>
          <div>
            <p className="text-small font-semibold text-accent-green">
              The decision that mattered
            </p>
            <h3 className="mt-1 text-h4 text-text">{project.decision.title}</h3>
            <p className="mt-3 text-body text-muted">{project.decision.body}</p>
          </div>
        </div>
      </FadeIn>
    </article>
  );
}
