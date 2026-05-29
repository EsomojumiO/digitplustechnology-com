import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export interface LogoProps {
  className?: string;
  /** Tone of the wordmark text — defaults to current text color. */
  tone?: "default" | "inverse";
}

/**
 * Logo — wordmark for Digitplus.
 *
 * NOTE: brand logo assets (logo-full.png / logo-full-white.png) are not yet in
 * /public (logged in docs/BLOCKERS.md). We render a crafted text wordmark with a
 * small geometric mark so the brand reads cleanly until the real asset lands.
 * When the asset arrives, swap the mark+text for a <next/image>.
 */
export function Logo({ className, tone = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.shortName} — home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[0.625rem] bg-accent text-accent-foreground",
          "text-[0.95rem] font-bold leading-none shadow-[var(--shadow-sm)]",
          "transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]",
          "group-hover:scale-[1.04]",
        )}
      >
        D
      </span>
      <span
        className={cn(
          "text-[1.0625rem] font-semibold tracking-[-0.015em]",
          tone === "inverse" ? "text-neutral-50" : "text-text",
        )}
      >
        Digitplus
      </span>
    </Link>
  );
}

export default Logo;
