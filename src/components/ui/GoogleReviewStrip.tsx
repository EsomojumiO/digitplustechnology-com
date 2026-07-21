import { FadeIn } from "@/components/motion";
import { Section } from "./Section";
import { googleReviews } from "@/data/testimonials";
import { siteConfig } from "@/lib/site";

/**
 * GoogleReviewStrip — public, verbatim Google reviews as a supporting strip.
 *
 * WHERE THIS BELONGS. These are retail/hardware-shop reviews: "Great store for
 * high-end computing systems", "very good at sourcing components and building
 * your computer very quickly". They are real, published by their authors, and
 * quotable — but they are proof of the SUPPLY line, not of enterprise managed
 * services. On the homepage they were the only social proof under a thesis
 * about SLAs, audit trails and multi-site delivery, which invited a buyer to
 * reclassify the company as a computer shop. They now run only on the service
 * pages where "sourcing components quickly" is exactly the claim being made.
 *
 * Deliberately a strip and never the main testimonial cards: overselling these
 * as enterprise proof is the kind of thing a reader spots immediately.
 */
export function GoogleReviewStrip() {
  if (googleReviews.length === 0) return null;

  return (
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
  );
}

export default GoogleReviewStrip;
