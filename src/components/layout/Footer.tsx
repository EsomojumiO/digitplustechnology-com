import Link from "next/link";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { siteConfig, footerNav } from "@/lib/site";
import { Logo } from "./Logo";

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("h-3.5 w-3.5", className)}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Footer — multi-column nav, NAP block, store cross-link, a minimal newsletter
 * slot (forms agent replaces with a richer component later), and a legal row.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-hairline bg-surface text-text"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      {/* Store cross-link band */}
      <Container className="border-b border-hairline py-6">
        <Link
          href={siteConfig.storeUrl}
          rel="noopener"
          className={cn(
            "group inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg",
            "text-small text-muted transition-colors duration-[var(--dur-fast)] hover:text-text",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          <span>Looking to purchase hardware?</span>
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            Visit our store
            <ArrowRight className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5" />
          </span>
        </Link>
      </Container>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand + NAP */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="measure-tight mt-4 text-small text-muted">
              {siteConfig.tagline} End-to-end IT for enterprises, government, and
              institutions across Nigeria.
            </p>

            <address className="mt-6 space-y-1.5 text-small not-italic text-muted">
              <p className="font-medium text-text">{siteConfig.name}</p>
              <p>{siteConfig.hq}</p>
              <p>
                <a
                  href={siteConfig.phoneHref}
                  className="transition-colors hover:text-text"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-text"
                >
                  {siteConfig.email}
                </a>
              </p>
            </address>

            <p className="mt-4 text-caption text-muted">
              Serving {siteConfig.coverage.join(" • ")}
            </p>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8"
          >
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="text-caption font-semibold uppercase tracking-wide text-muted">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-small text-muted transition-colors duration-[var(--dur-fast)] hover:text-text",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Newsletter slot — minimal accessible placeholder; forms agent enriches. */}
        <div className="mt-12 border-t border-hairline pt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-h4 text-text">Stay informed</h3>
              <p className="measure mt-1.5 text-small text-muted">
                Quarterly reports and practical IT strategy for decision-makers.
                No spam.
              </p>
            </div>
            <form
              action="/api/newsletter"
              method="post"
              className="flex w-full max-w-md flex-col gap-2 sm:flex-row md:ml-auto"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className={cn(
                  "h-11 w-full rounded-md border border-hairline bg-surface-raised px-3.5 text-body text-text",
                  "placeholder:text-muted",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                )}
              />
              <button
                type="submit"
                className={cn(
                  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md px-5 text-body font-medium",
                  "bg-accent text-accent-foreground shadow-[var(--shadow-sm)]",
                  "transition-colors duration-[var(--dur-fast)] hover:bg-accent-hover",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px",
                )}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 text-caption text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-text">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-text">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
