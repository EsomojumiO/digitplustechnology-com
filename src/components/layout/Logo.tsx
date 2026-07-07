import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export interface LogoProps {
  className?: string;
  /** Tone of the wordmark, "inverse" for use on the forest-green brand surfaces. */
  tone?: "default" | "inverse";
}

/**
 * Logo, official Digitplus chain-link mark + DIGITPLUS wordmark.
 *
 * Uses the brand icon (Pishon Design Studio kit) from /public/brand. The wordmark
 * is set in Montserrat to match the brand headline face. On forest-green surfaces
 * pass tone="inverse" to swap to the white mark + cream wordmark.
 */
export function Logo({ className, tone = "default" }: LogoProps) {
  // Dark-only theme: every surface is dark, so the white mark + cream wordmark
  // is the legible treatment everywhere (the `tone` prop is kept for API stability).
  void tone;
  const inverse = true;
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.shortName}, home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green",
        className,
      )}
    >
      <Image
        src={inverse ? "/brand/digitplus-icon-white.png" : "/brand/digitplus-icon.png"}
        alt=""
        aria-hidden="true"
        width={45}
        height={32}
        priority
        className={cn(
          "h-7 w-auto",
          "transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]",
          "group-hover:scale-[1.04]",
        )}
      />
      <span
        className={cn(
          "font-display text-[1.0625rem] font-bold uppercase tracking-[0.02em] leading-none",
          inverse ? "text-[var(--cream)]" : "text-brand",
        )}
      >
        Digitplus
      </span>
    </Link>
  );
}

export default Logo;
