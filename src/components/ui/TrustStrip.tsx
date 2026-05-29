import * as React from "react";
import { cn } from "@/lib/utils";

export interface TrustLogo {
  /** Brand / partner name (also used as accessible label). */
  name: string;
  /** Optional logo image src; falls back to a text-based monochrome wordmark. */
  src?: string;
}

export interface TrustStripProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Intro label shown above the logo row. */
  label?: React.ReactNode;
  /** Logo items. Defaults to the brief's partner set. */
  logos?: TrustLogo[];
}

const DEFAULT_LOGOS: TrustLogo[] = [
  { name: "Microsoft" },
  { name: "HP" },
  { name: "Dell" },
  { name: "Cisco" },
  { name: "Lenovo" },
  { name: "Fortinet" },
];

/**
 * TrustStrip — monochrome partner logo row. Renders text wordmark placeholders
 * when no image src is supplied. TODO: replace placeholders with real logos.
 */
export function TrustStrip({
  label = "Trusted technology partners",
  logos = DEFAULT_LOGOS,
  className,
  ...props
}: TrustStripProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)} {...props}>
      {label ? (
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-muted">
          {label}
        </p>
      ) : null}
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {logos.map((logo) => (
          <li key={logo.name} className="flex items-center">
            {logo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.src}
                alt={logo.name}
                className="h-6 w-auto opacity-60 grayscale transition-opacity duration-[var(--dur-base)] hover:opacity-100"
                loading="lazy"
              />
            ) : (
              <span
                className="text-lg font-semibold tracking-tight text-muted opacity-70 transition-opacity duration-[var(--dur-base)] hover:opacity-100"
                aria-label={logo.name}
              >
                {logo.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrustStrip;
