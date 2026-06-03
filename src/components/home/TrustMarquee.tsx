import * as React from "react";
import { Marquee } from "@/components/motion";

const PARTNERS: { name: string; src: string }[] = [
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

export type TrustMarqueeProps = Record<string, never>;

/**
 * TrustMarquee, partner trust strip rendered as a slow, seamless monochrome
 * logo scroll. Real brand marks forced to uniform white via CSS filter and
 * muted with opacity for a consistent set on the dark theme. Reduced-motion
 * safe via the Marquee primitive (content stays static and fully readable).
 * Logos only, no heading.
 */
export function TrustMarquee() {
  return (
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
  );
}

export default TrustMarquee;
