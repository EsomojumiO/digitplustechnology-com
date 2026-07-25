/**
 * site.ts, Canonical site configuration + NAP (Name, Address, Phone).
 *
 * SINGLE SOURCE OF TRUTH for: brand identity, contact facts, the service &
 * industry slug lists, and the header/footer navigation structure.
 *
 * Labels and blurbs here are intentionally SHORT. Long marketing copy lives in
 * `src/data/*` (owned by pages-builder). Slug lists here are authoritative, 
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
  /** Public Google Business profile — the review strip links here. */
  googleReviewsUrl: string;
}

export const siteConfig = {
  name: "Digitplus Technology Limited",
  shortName: "Digitplus",
  url: "https://digitplustechnology.com",
  description:
    "Digitplus Technology Limited is a B2B IT solutions company in Nigeria — procurement, infrastructure and managed services for enterprise and government.",
  tagline: "Plan. Procure. Deploy. Manage.",
  email: "hello@digitplustechnology.com",
  phone: "+234 803 786 8120",
  phoneHref: "tel:+2348037868120",
  whatsapp: "https://wa.me/2348037868120",
  hq: "Abuja, Nigeria",
  coverage: ["Abuja", "Lagos", "Port Harcourt"],
  storeUrl: "https://thedigitplus.com",
  // Verified 2026-07-17: 302 -> google.com/maps/place/Digitplus+Technologies
  // at 9.0626, 7.4713 (Abuja). Right business, right city.
  googleReviewsUrl: "https://maps.app.goo.gl/5RnHHpYhWGDz9ygt9",
} as const satisfies SiteConfig;

/* ---------------------------------------------------------------------------
   Services, authoritative slug list (6). Titles + short blurbs only.
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
      "Documented IT procurement in Nigeria, hardware and software sourcing with LPO support across multiple sites.",
  },
  {
    slug: "hardware-supply",
    title: "Hardware Supply",
    short:
      "Genuine servers, workstations, and networking from authorised channels, hardware supply with valid warranties.",
  },
  {
    slug: "infrastructure-solutions",
    title: "Infrastructure Solutions",
    short:
      "Structured cabling, network installation, server room setup, and UPS/power, built to last.",
  },
  {
    slug: "managed-services",
    title: "Managed Services",
    short:
      "Managed IT services in Nigeria, remote and on-site support, monitoring, and SLAs that keep operations running.",
  },
  {
    slug: "technology-advisory",
    title: "Technology Advisory",
    short:
      "IT strategy, budgeting, vendor selection, and multi-year roadmaps for decision-makers and procurement teams.",
  },
  {
    slug: "deployment-implementation",
    title: "Deployment & Implementation",
    short:
      "Installation, configuration, testing, and staff training, IT deployment and handover done right.",
  },
] as const satisfies readonly ServiceSummary[];

export type ServiceSlug = (typeof services)[number]["slug"];

/* ---------------------------------------------------------------------------
   Industries, authoritative slug list (8). Titles + short blurbs only.
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
      "Government IT procurement, documented sourcing, LPO support, and audit-ready records for the public sector.",
  },
  {
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    short:
      "Bank branch IT infrastructure, vendor accountability, and compliance-aligned delivery.",
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    short:
      "Multi-site IT infrastructure, SLAs, and enterprise IT support from one accountable partner.",
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
      "Reliable, high-uptime IT infrastructure and support for hospitals and clinics.",
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
  /** Child links, presence signals a dropdown/mega-menu. */
  children?: NavItem[];
  /** External destination, opens in a new tab. */
  external?: boolean;
  /**
   * Small pill rendered beside the label, e.g. "Coming soon". The link stays
   * clickable — a product that isn't live yet is still worth showing, and
   * disabling the row would hide the destination entirely.
   */
  badge?: string;
}

export const mainNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    // Industries now live under Services rather than as a top-level item.
    children: [
      ...services.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
        description: s.short,
      })),
      {
        label: "Industries",
        href: "/industries",
        description:
          "Sector-specific delivery: government, banking, healthcare, education, oil & gas, SME and more.",
      },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    // Insights + Reports merged into one menu.
    children: [
      {
        label: "Articles",
        href: "/insights",
        description: "Strategy and guidance for IT decision-makers.",
      },
      {
        label: "Reports",
        href: "/reports",
        description: "Practitioner briefings and quarterly benchmarks.",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    // Approach now lives under About.
    children: [
      {
        label: "Overview",
        href: "/about",
        description: "Who we are, our coverage, and how we deliver.",
      },
      {
        label: "Approach",
        href: "/approach",
        description: "Our delivery method, from plan to procure to manage.",
      },
    ],
  },
  {
    label: "Ecosystem",
    href: "/ecosystem",
    // Sister Digitplus products (separate properties).
    children: [
      {
        label: "Digitplus Store",
        href: "https://thedigitplus.com",
        // Live — see the note in ecosystem/page.tsx.
        description: "Our e-commerce store for IT hardware.",
        external: true,
      },
      {
        label: "Digitplus Retail",
        href: "https://digitplusretail.com",
        // "Coming soon" moved out of the prose and into a badge so the status
        // reads at a glance. Store carries no badge — it is live.
        description: "POS and inventory platform for retail.",
        external: true,
        badge: "Coming soon",
      },
    ],
  },
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
      { label: "Locations", href: "/locations" },
      { label: "Ecosystem", href: "/ecosystem" },
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
