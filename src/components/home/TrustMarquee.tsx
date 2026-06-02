import * as React from "react";
import { Marquee } from "@/components/motion";

const PARTNERS = ["Microsoft", "HP", "Dell", "Cisco", "Lenovo", "Fortinet"];

export interface TrustMarqueeProps {
  label?: string;
}

/**
 * TrustMarquee — partner trust strip rendered as a slow, seamless monochrome
 * logo scroll. Placeholder wordmarks (real partner logo files are a launch
 * blocker). Reduced-motion safe via the Marquee primitive (content stays static
 * and fully readable). Accessible label kept above the strip.
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
          {PARTNERS.map((name) => (
            <li key={name} className="flex items-center">
              <span className="text-lg font-semibold tracking-tight text-muted opacity-65 transition-opacity duration-[var(--dur-base)] hover:opacity-100">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </Marquee>
    </div>
  );
}

export default TrustMarquee;
