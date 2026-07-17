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
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "HP", src: "/logos/hp.svg" },
  { name: "HPE", src: "/logos/hpe.svg" },
  { name: "Dell", src: "/logos/dell.svg" },
  { name: "Lenovo", src: "/logos/lenovo.svg" },
  { name: "Cisco", src: "/logos/cisco.svg" },
  { name: "Juniper Networks", src: "/logos/juniper.svg" },
  { name: "Aruba", src: "/logos/aruba.svg" },
  { name: "Fortinet", src: "/logos/fortinet.svg" },
  { name: "Sophos", src: "/logos/sophos.svg" },
  { name: "Kaspersky", src: "/logos/kaspersky.svg" },
  { name: "VMware", src: "/logos/vmware.svg" },
  { name: "Veeam", src: "/logos/veeam.svg" },
  { name: "Schneider Electric", src: "/logos/schneider.svg" },
  { name: "Eaton", src: "/logos/eaton.svg" },
  { name: "IBM", src: "/logos/ibm.svg" },
  { name: "Oracle", src: "/logos/oracle.svg" },
];

/**
 * TrustStrip, monochrome partner logo row. Real brand marks are knocked to a
 * uniform dark ink (`brightness(0)`) and muted via opacity so the row reads as
 * one consistent set on the white canvas; falls back to a text wordmark when a
 * logo has no `src`.
 *
 * Monochrome is a stopgap, not the design: real full-colour marks are the
 * intended treatment and are blocked on assets + reseller authorisation. See
 * PLACEHOLDERS.md §5.
 */
export function TrustStrip({
  label,
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
                // brightness(0) alone — knock every mark to a single dark ink.
                // The dark theme added invert(1) to make them white, which on a
                // white canvas renders all 17 partner logos invisible. Real
                // full-colour marks are the better end state and are logged as
                // an asset-collection task in PLACEHOLDERS.md.
                className="h-6 w-auto opacity-60 [filter:brightness(0)] transition-opacity duration-[var(--dur-base)] hover:opacity-100"
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
