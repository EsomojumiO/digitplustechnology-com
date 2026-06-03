import * as React from "react";
import { Marquee } from "@/components/motion";

const PARTNERS: { name: string; src: string }[] = [
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "HP", src: "/logos/hp.svg" },
  { name: "Dell", src: "/logos/dell.svg" },
  { name: "Cisco", src: "/logos/cisco.svg" },
  { name: "Lenovo", src: "/logos/lenovo.svg" },
  { name: "Fortinet", src: "/logos/fortinet.svg" },
];

export interface TrustMarqueeProps {
  label?: string;
}

/**
 * TrustMarquee, partner trust strip rendered as a slow, seamless monochrome
 * logo scroll. Real brand marks forced to uniform white via CSS filter and
 * muted with opacity for a consistent set on the dark theme. Reduced-motion
 * safe via the Marquee primitive (content stays static and fully readable).
 * Accessible label kept above the strip.
 */
export function TrustMarquee({
  label = "Authorised technology partners",
}: TrustMarqueeProps) {
  return (
    <div className="flex flex-col items-center gap-7">
      <p className="font-mono text-caption font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <Marquee speed={42} pauseOnHover className="w-full">
        <ul className="flex items-center gap-12 pr-12" aria-label="Technology partners">
          {PARTNERS.map((partner) => (
            <li key={partner.name} className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.src}
                alt={partner.name}
                className="h-6 w-auto opacity-65 [filter:brightness(0)_invert(1)] transition-opacity duration-[var(--dur-base)] hover:opacity-100"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </Marquee>
    </div>
  );
}

export default TrustMarquee;
