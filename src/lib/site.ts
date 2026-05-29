/**
 * site.ts — Canonical site configuration + NAP (Name, Address, Phone).
 *
 * SINGLE SOURCE OF TRUTH for: brand identity, contact facts, the service &
 * industry slug lists, and the header/footer navigation structure.
 *
 * Labels and blurbs here are intentionally SHORT. Long marketing copy lives in
 * `src/data/*` (owned by pages-builder). Slug lists here are authoritative —
 * other agents derive routes/static params from them.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  url: string;
  description: string;
  tagline: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  hq: string;
  coverage: readonly string[];
  storeUrl: string;
}

export const siteConfig = {
  name: "Digitplus Technology Limited",
  shortName: "Digitplus",
  url: "https://digitplustechnology.com",
  description:
    "Digitplus Technology Limited is a Nigerian B2B IT solutions partner — end-to-end IT procurement, hardware supply, infrastructure, and managed services for enterprises, government, and institutions. Abuja HQ, nationwide delivery.",
  tagline: "Plan. Procure. Deploy. Manage.",
  email: "hello@digitplustechnology.com",
  phone: "+234 803 786 8120",
  phoneHref: "tel:+2348037868120",
  whatsapp: "https://wa.me/2348037868120",
  hq: "Abuja, Nigeria",
  coverage: ["Abuja", "Lagos", "Port Harcourt"],
  storeUrl: "https://thedigitplus.com",
} as const satisfies SiteConfig;

/* ---------------------------------------------------------------------------
   Services — authoritative slug list (6). Titles + short blurbs only.
   --------------------------------------------------------------------------- */
export interface ServiceSummary {
  slug: string;
  title: string;
  short: string;
}

export const services = [
  {
    slug: "it-procurement",
    title: "IT Procurement",
    short:
      "Documented, accountable sourcing of hardware and software — LPO support across multiple sites.",
  },
  {
    slug: "hardware-supply",
    title: "Hardware Supply",
    short:
      "Servers, workstations, networking, and peripherals from authorized channels, with warranties.",
  },
  {
    slug: "infrastructure-solutions",
    title: "Infrastructure Solutions",
    short:
      "Structured cabling, LAN/WAN, server rooms, and UPS/power — built to last.",
  },
  {
    slug: "managed-services",
    title: "Managed Services",
    short:
      "Remote and on-site support, monitoring, and SLAs that keep operations running.",
  },
  {
    slug: "technology-advisory",
    title: "Technology Advisory",
    short:
      "IT strategy, budgeting, vendor selection, and multi-year roadmaps for decision-makers.",
  },
  {
    slug: "deployment-implementation",
    title: "Deployment & Implementation",
    short:
      "Installation, configuration, testing, and training — handover done right.",
  },
] as const satisfies readonly ServiceSummary[];

export type ServiceSlug = (typeof services)[number]["slug"];

/* ---------------------------------------------------------------------------
   Industries — authoritative slug list (8). Titles + short blurbs only.
   --------------------------------------------------------------------------- */
export interface IndustrySummary {
  slug: string;
  title: string;
  short: string;
}

export const industries = [
  {
    slug: "government",
    title: "Government",
    short:
      "Documented procurement, LPO support, and audit-ready compliance for the public sector.",
  },
  {
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    short:
      "Branch infrastructure, vendor accountability, and compliance-aligned delivery.",
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    short:
      "Multi-site infrastructure, SLAs, and a single accountable IT partner.",
  },
  {
    slug: "sme",
    title: "SME",
    short:
      "Practical guidance and dependable IT for growing businesses — no jargon.",
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    short:
      "Reliable, high-uptime infrastructure for hospitals and clinics.",
  },
  {
    slug: "education",
    title: "Education",
    short:
      "Budget-conscious, dependable IT for schools and institutions.",
  },
  {
    slug: "oil-gas-energy",
    title: "Oil, Gas & Energy",
    short:
      "Resilient infrastructure and managed services for demanding environments.",
  },
  {
    slug: "logistics-manufacturing",
    title: "Logistics & Manufacturing",
    short:
      "Connected sites, hardware supply, and support that keeps operations moving.",
  },
] as const satisfies readonly IndustrySummary[];

export type IndustrySlug = (typeof industries)[number]["slug"];

/* ---------------------------------------------------------------------------
   Navigation
   --------------------------------------------------------------------------- */
export interface NavItem {
  label: string;
  href: string;
  /** Optional short blurb shown in dropdown/mega-menu rows. */
  description?: string;
  /** Child links — presence signals a dropdown/mega-menu. */
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
      description: s.short,
    })),
  },
  {
    label: "Industries",
    href: "/industries",
    children: industries.map((i) => ({
      label: i.title,
      href: `/industries/${i.slug}`,
      description: i.short,
    })),
  },
  { label: "Approach", href: "/approach" },
  { label: "Insights", href: "/insights" },
  { label: "Reports", href: "/reports" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerNav: FooterColumn[] = [
  {
    title: "Services",
    links: services.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    })),
  },
  {
    title: "Industries",
    links: industries.map((i) => ({
      label: i.title,
      href: `/industries/${i.slug}`,
    })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Approach", href: "/approach" },
      { label: "Insights", href: "/insights" },
      { label: "Reports", href: "/reports" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
