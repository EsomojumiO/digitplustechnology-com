/**
 * data/locations.ts, Lightweight local copy for the three coverage cities.
 *
 * NAP stays canonical in site.ts; these are local-flavoured descriptions only.
 * LocalBusiness JSON-LD is added later by the SEO agent.
 */
export interface LocationContent {
  slug: "abuja" | "lagos" | "port-harcourt";
  city: string;
  /** "Headquarters" | "Delivery hub", role of this location. */
  role: string;
  intro: string[];
  /** Local highlights / sectors served. */
  highlights: string[];
  metaTitle: string;
  metaDescription: string;
}

export const locations: LocationContent[] = [
  {
    slug: "abuja",
    city: "Abuja",
    role: "Headquarters",
    intro: [
      "Abuja is home base for Digitplus Technology Limited. From the Federal Capital Territory we serve federal ministries, departments, and agencies, alongside enterprises and institutions across the city.",
      "Being headquartered in Abuja matters for public-sector work: we understand the documentation, LPO workflows, and audit expectations that come with government procurement, and we deliver to them as standard.",
    ],
    highlights: [
      "Documented, audit-ready procurement for federal agencies",
      "Infrastructure builds and server-room fit-outs across the FCT",
      "On-site managed support with rapid response in and around Abuja",
    ],
    metaTitle: "IT Solutions in Abuja, Digitplus Technology HQ",
    metaDescription:
      "Digitplus Technology Limited is headquartered in Abuja, delivering documented IT procurement, infrastructure, and managed services to government and enterprises across the FCT.",
  },
  {
    slug: "lagos",
    city: "Lagos",
    role: "Delivery hub",
    intro: [
      "Lagos is Nigeria’s commercial engine, and we deliver across the city and its mainland and island business districts. From branch infrastructure to multi-site rollouts, we support the pace Lagos operates at.",
      "Banks, fintechs, enterprises, and growing SMEs rely on us for procurement, deployment, and managed support, with the same documentation and accountability we apply everywhere.",
    ],
    highlights: [
      "Branch and office infrastructure for banking and financial services",
      "Multi-site procurement and deployment across Lagos",
      "Remote and on-site managed support under clear SLAs",
    ],
    metaTitle: "IT Solutions in Lagos, Digitplus Technology",
    metaDescription:
      "Digitplus delivers IT procurement, infrastructure, deployment, and managed services across Lagos, supporting banks, enterprises, and SMEs with accountable delivery.",
  },
  {
    slug: "port-harcourt",
    city: "Port Harcourt",
    role: "Delivery hub",
    intro: [
      "Port Harcourt anchors our delivery in the South-South and the energy corridor. We support operations that demand resilience, including oil, gas, and energy clients with remote and demanding sites.",
      "From robust infrastructure to dependable managed support, we help organisations in Rivers State and the wider region keep operations-critical systems running.",
    ],
    highlights: [
      "Resilient infrastructure for oil, gas, and energy operations",
      "Hardware supply and deployment across the South-South",
      "Managed support models suited to demanding, sometimes remote, sites",
    ],
    metaTitle: "IT Solutions in Port Harcourt, Digitplus Technology",
    metaDescription:
      "Digitplus delivers resilient IT infrastructure, hardware supply, and managed services across Port Harcourt and the South-South, built for demanding environments.",
  },
];

export function getLocation(slug: string): LocationContent | undefined {
  return locations.find((l) => l.slug === slug);
}
