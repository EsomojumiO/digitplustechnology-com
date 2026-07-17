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
      "Our HQ in the FCT — documented, audit-ready IT procurement and delivery for federal agencies and enterprises across Abuja.",
    ],
    highlights: [
      "Documented, audit-ready procurement for federal agencies",
      "Infrastructure builds and server-room fit-outs across the FCT",
      "On-site managed support with rapid response in and around Abuja",
    ],
    metaTitle: "IT Solutions in Abuja, Our HQ",
    metaDescription:
      "Digitplus is headquartered in Abuja, delivering documented IT procurement, infrastructure and managed services to government and enterprises across the FCT.",
  },
  {
    slug: "lagos",
    city: "Lagos",
    role: "Delivery hub",
    intro: [
      "Delivery across Nigeria’s commercial capital — branch infrastructure, multi-site rollouts and managed support at Lagos pace.",
    ],
    highlights: [
      "Branch and office infrastructure for banking and financial services",
      "Multi-site procurement and deployment across Lagos",
      "Remote and on-site managed support under clear SLAs",
    ],
    metaTitle: "IT Solutions in Lagos",
    metaDescription:
      "Digitplus delivers IT procurement, infrastructure, deployment and managed services across Lagos — for banks, enterprises and SMEs with accountable delivery.",
  },
  {
    slug: "port-harcourt",
    city: "Port Harcourt",
    role: "Delivery hub",
    intro: [
      "Delivery across the South-South energy corridor — resilient infrastructure and support for demanding, remote sites.",
    ],
    highlights: [
      "Resilient infrastructure for oil, gas, and energy operations",
      "Hardware supply and deployment across the South-South",
      "Managed support models suited to demanding, sometimes remote, sites",
    ],
    metaTitle: "IT Solutions in Port Harcourt",
    metaDescription:
      "Digitplus delivers resilient IT infrastructure, hardware supply and managed services across Port Harcourt and the South-South, built for demanding environments.",
  },
];

export function getLocation(slug: string): LocationContent | undefined {
  return locations.find((l) => l.slug === slug);
}
