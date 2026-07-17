import { Link } from "next-view-transitions";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export interface LogoProps {
  className?: string;
}

/**
 * Logo, official Digitplus chain-link mark + DIGITPLUS wordmark.
 *
 * Uses the brand icon (Pishon Design Studio kit) from /public/brand.
 *
 * The `tone` prop and the white/inverse variant are both gone. The dark theme
 * hardcoded `inverse = true` because every surface was dark; on the Apple-light
 * canvas no dark surface survives (the footer is #f5f5f7), so the standard mark
 * is the correct treatment everywhere and an inverse variant would be dead code.
 * The white icon asset stays in /public/brand for the dark-raycast fallback.
 */
export function Logo({ className }: LogoProps) {
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
        src="/brand/digitplus-icon.png"
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
          // Ink, not `text-brand`: --brand is now the light #f5f5f7 surface
          // token, so text-brand would render near-white on white.
          "font-display text-[1.0625rem] font-bold uppercase tracking-[0.02em] leading-none",
          "text-text",
        )}
      >
        Digitplus
      </span>
    </Link>
  );
}

export default Logo;
