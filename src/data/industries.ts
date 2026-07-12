/**
 * data/industries.ts, Full marketing copy for the eight industries served.
 *
 * Keyed by the authoritative slugs in `src/lib/site.ts`. The SEO agent reads
 * `faqs`, `metaTitle`, and `metaDescription` for schema and metadata.
 */
import type { IndustryContent, IndustrySlug } from "./types";

export const industriesContent: Record<IndustrySlug, IndustryContent> = {
  government: {
    slug: "government",
    title: "Government",
    intro: [
      "Documented, audit-ready IT procurement and delivery built for public-sector accountability and LPO workflows.",
    ],
    concerns: [
      {
        title: "Documented procurement",
        desc: "Quotations, proforma invoices, and delivery notes captured at every step, giving you a complete and traceable record for each purchase.",
      },
      {
        title: "LPO-aligned purchasing",
        desc: "Procurement that fits formal public-sector workflows and approval chains, with fulfilment that matches your LPO terms exactly.",
      },
      {
        title: "Audit & compliance readiness",
        desc: "Records organised so internal and external audits are straightforward, with genuine, authorised-channel equipment behind every line item.",
      },
      {
        title: "Multi-location delivery",
        desc: "Coordinated supply and deployment across offices and states, with consistent documentation for the whole programme.",
      },
    ],
    relevantServices: [
      "it-procurement",
      "infrastructure-solutions",
      "deployment-implementation",
      "technology-advisory",
    ],
    faqs: [
      {
        q: "Can you work within government IT procurement and LPO processes?",
        a: "Yes. We are set up for formal public-sector purchasing, quotations, proforma invoices, LPO fulfilment, and complete delivery documentation that aligns with your approval chain.",
      },
      {
        q: "How do you support audit requirements?",
        a: "Every transaction is documented and the equipment is sourced through authorised channels. The result is a clean, traceable file that stands up to audit scrutiny.",
      },
    ],
    metaTitle: "IT Solutions for Government & Public Sector",
    metaDescription:
      "Documented, audit-ready IT procurement, infrastructure, and deployment for Nigerian government agencies. LPO-aligned purchasing and traceable delivery.",
  },

  "banking-financial-services": {
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    intro: [
      "Bank branch infrastructure, resilient networks and managed services with the documentation regulated environments demand.",
    ],
    concerns: [
      {
        title: "Branch infrastructure",
        desc: "Consistent cabling, network, and power builds across branches, delivered to one standard so support and expansion stay simple.",
      },
      {
        title: "Uptime & resilience",
        desc: "Monitoring, SLAs, and power protection that keep customer-facing and core systems available when they are needed most.",
      },
      {
        title: "Compliance-aligned delivery",
        desc: "Genuine equipment, documented work, and clear records that support your regulatory and audit obligations.",
      },
      {
        title: "Vendor accountability",
        desc: "A single accountable partner across procurement, build, and support, fewer hand-offs, clearer ownership when something needs fixing.",
      },
    ],
    relevantServices: [
      "infrastructure-solutions",
      "managed-services",
      "it-procurement",
      "hardware-supply",
    ],
    faqs: [
      {
        q: "Can you roll out IT infrastructure across many bank branches in Nigeria?",
        a: "Yes. We deliver standardised branch builds and coordinate multi-site rollouts so every location reaches the same documented standard.",
      },
      {
        q: "How do you support uptime requirements?",
        a: "Through proactive monitoring, defined SLAs, and power protection, designed to keep core and customer-facing systems available.",
      },
    ],
    metaTitle: "IT Solutions for Banking & Financial Services",
    metaDescription:
      "Branch infrastructure, resilient networks, and managed services for banks, microfinance, and fintech in Nigeria, with vendor accountability and compliance-aligned delivery.",
  },

  enterprise: {
    slug: "enterprise",
    title: "Enterprise",
    intro: [
      "One accountable IT partner across every site — consistent standards, clear ownership and measured SLAs.",
    ],
    concerns: [
      {
        title: "Multi-site consistency",
        desc: "One set of standards for hardware, infrastructure, and configuration across every office, so support and expansion stay predictable.",
      },
      {
        title: "Single point of accountability",
        desc: "Procurement, deployment, and support under one partner, clear ownership instead of vendors pointing at each other.",
      },
      {
        title: "Service-level agreements",
        desc: "Defined response and resolution targets with regular reporting, so IT performance is measured rather than assumed.",
      },
      {
        title: "Scalable foundations",
        desc: "Infrastructure and standards designed with headroom, so adding sites, users, or capacity does not mean starting over.",
      },
    ],
    relevantServices: [
      "managed-services",
      "infrastructure-solutions",
      "it-procurement",
      "technology-advisory",
    ],
    faqs: [
      {
        q: "Can you act as our single IT partner across sites?",
        a: "Yes. Consolidating procurement, deployment, and support under one accountable partner is exactly the problem we solve for enterprises.",
      },
      {
        q: "Will you work alongside our in-house IT team?",
        a: "Yes. We frequently extend in-house teams, covering monitoring, specialist work, or additional locations, rather than replacing them.",
      },
    ],
    metaTitle: "Enterprise IT Solutions & Managed Services",
    metaDescription:
      "Multi-site infrastructure, SLAs, and a single accountable IT partner for enterprises in Nigeria. Consistent standards, clear ownership, and scalable foundations.",
  },

  sme: {
    slug: "sme",
    title: "SME",
    intro: [
      "Right-sized equipment and dependable support in plain language — priced to fit and built to grow.",
    ],
    concerns: [
      {
        title: "Practical, plain-spoken advice",
        desc: "Recommendations in language you can act on, focused on what your business actually needs, not the biggest possible spend.",
      },
      {
        title: "Right-sized investment",
        desc: "Equipment and services scaled to your size and stage, so you are not paying for capacity you will not use for years.",
      },
      {
        title: "Dependable support",
        desc: "Responsive help when something breaks, without the cost or complexity of running an in-house IT team.",
      },
      {
        title: "Room to grow",
        desc: "Choices that scale as you add staff and locations, avoiding expensive rip-and-replace later on.",
      },
    ],
    relevantServices: [
      "managed-services",
      "hardware-supply",
      "technology-advisory",
      "deployment-implementation",
    ],
    faqs: [
      {
        q: "We do not have an IT team, can you handle everything?",
        a: "Yes. Many SME clients rely on us as their whole IT function, from advice and procurement to support, so they can focus on the business.",
      },
      {
        q: "Will the solution grow with us?",
        a: "We deliberately right-size and choose options that scale, so adding staff or locations later does not mean replacing what you already bought.",
      },
    ],
    metaTitle: "IT Solutions & Support for SMEs in Nigeria",
    metaDescription:
      "Practical, plain-spoken IT for growing businesses, right-sized equipment, dependable support, and guidance without the jargon. SME IT solutions across Nigeria.",
  },

  healthcare: {
    slug: "healthcare",
    title: "Healthcare",
    intro: [
      "High-uptime infrastructure and power protection that keep clinical systems available around the clock.",
    ],
    concerns: [
      {
        title: "Reliability & uptime",
        desc: "Resilient networks, monitoring, and SLAs that keep clinical and administrative systems available around the clock.",
      },
      {
        title: "Power protection",
        desc: "UPS and clean-power planning so critical systems ride through the unstable supply many facilities face.",
      },
      {
        title: "Dependable infrastructure",
        desc: "Well-built, documented cabling and networks that support records systems and connected equipment without intermittent faults.",
      },
      {
        title: "Responsive support",
        desc: "Fast remote and on-site support, because in a care setting a slow fix has real consequences.",
      },
    ],
    relevantServices: [
      "infrastructure-solutions",
      "managed-services",
      "hardware-supply",
      "deployment-implementation",
    ],
    faqs: [
      {
        q: "How do you protect against power problems?",
        a: "We design UPS and power protection into the infrastructure so critical systems keep running through outages and unstable supply.",
      },
      {
        q: "Can you provide fast support when systems go down?",
        a: "Yes. We offer responsive remote support backed by on-site engineers, under SLAs suited to environments where downtime affects care.",
      },
    ],
    metaTitle: "Reliable IT Solutions for Healthcare & Hospitals",
    metaDescription:
      "High-uptime infrastructure, power protection, and responsive support for hospitals and clinics in Nigeria. Dependable healthcare IT that keeps systems available.",
  },

  education: {
    slug: "education",
    title: "Education",
    intro: [
      "Durable, budget-conscious IT for labs, campuses and classrooms that keeps learning running.",
    ],
    concerns: [
      {
        title: "Budget-conscious choices",
        desc: "Right-sized, durable equipment and infrastructure that respect tight budgets while still being built to last.",
      },
      {
        title: "Computer labs & classrooms",
        desc: "Standardised workstation fleets and lab builds that are easy to image, support, and refresh as cohorts change.",
      },
      {
        title: "Campus connectivity",
        desc: "Reliable networks across buildings and sites, so administration, teaching, and access systems stay connected.",
      },
      {
        title: "Dependable support",
        desc: "Support that keeps labs and offices running during term, with sensible response targets for an institutional setting.",
      },
    ],
    relevantServices: [
      "hardware-supply",
      "infrastructure-solutions",
      "deployment-implementation",
      "managed-services",
    ],
    faqs: [
      {
        q: "Can you help us equip a computer lab on a fixed budget?",
        a: "Yes. We right-size durable, standardised equipment to your budget and build labs that are easy to support and refresh over time.",
      },
      {
        q: "Do you support connectivity across a whole campus?",
        a: "We design and build reliable networks across buildings and sites so administration and teaching stay connected.",
      },
    ],
    metaTitle: "Budget-Conscious IT Solutions for Education",
    metaDescription:
      "Durable, budget-conscious IT for schools, colleges, and universities in Nigeria, computer labs, campus connectivity, and dependable support that keeps learning running.",
  },

  "oil-gas-energy": {
    slug: "oil-gas-energy",
    title: "Oil, Gas & Energy",
    intro: [
      "Resilient infrastructure and hardware built to survive demanding, remote energy-sector sites.",
    ],
    concerns: [
      {
        title: "Resilient infrastructure",
        desc: "Networks and power designed for reliability and continuity in demanding, sometimes remote, operating environments.",
      },
      {
        title: "Hardened hardware",
        desc: "Equipment specified for the conditions it will run in, sourced genuine and warrantied through authorised channels.",
      },
      {
        title: "Remote-site support",
        desc: "Monitoring and support models that work for sites away from major centres, with clear SLAs for response.",
      },
      {
        title: "Continuity & uptime",
        desc: "Power protection and proactive monitoring to keep operations-critical systems running with minimal interruption.",
      },
    ],
    relevantServices: [
      "infrastructure-solutions",
      "managed-services",
      "hardware-supply",
      "it-procurement",
    ],
    faqs: [
      {
        q: "Can you support remote or off-grid sites?",
        a: "Yes. We design for resilience and offer monitoring and support models suited to sites away from major centres, with clear response commitments.",
      },
      {
        q: "Is your hardware suited to demanding environments?",
        a: "We specify equipment for the conditions it will operate in and source it genuine and warrantied through authorised channels.",
      },
    ],
    metaTitle: "IT Solutions for Oil, Gas & Energy",
    metaDescription:
      "Resilient infrastructure, hardened hardware, and managed services for oil, gas, and energy operations in Nigeria, built for demanding and remote environments.",
  },

  "logistics-manufacturing": {
    slug: "logistics-manufacturing",
    title: "Logistics & Manufacturing",
    intro: [
      "Connected-site networks and responsive support that keep warehouses and plants moving.",
    ],
    concerns: [
      {
        title: "Connected sites",
        desc: "Reliable networks across warehouses, plants, and offices so operational systems stay linked and data keeps flowing.",
      },
      {
        title: "Operational hardware",
        desc: "Workstations, networking, and peripherals supplied genuine and standardised for easier support across busy sites.",
      },
      {
        title: "Uptime that protects throughput",
        desc: "Monitoring, power protection, and SLAs aimed at keeping the systems that move goods and production available.",
      },
      {
        title: "Multi-site coordination",
        desc: "One partner across all your locations, with consistent standards and documentation for the whole operation.",
      },
    ],
    relevantServices: [
      "infrastructure-solutions",
      "hardware-supply",
      "managed-services",
      "deployment-implementation",
    ],
    faqs: [
      {
        q: "Can you connect multiple warehouses and plants?",
        a: "Yes. We build reliable networks across sites and coordinate the rollout so every location meets the same standard.",
      },
      {
        q: "How do you help protect operational uptime?",
        a: "Through proactive monitoring, power protection, and SLAs focused on the systems that keep goods and production moving.",
      },
    ],
    metaTitle: "IT Solutions for Logistics & Manufacturing",
    metaDescription:
      "Connected-site infrastructure, dependable hardware, and responsive support for logistics and manufacturing in Nigeria, keeping warehouses and plants moving.",
  },
};

export function getIndustryContent(slug: string): IndustryContent | undefined {
  return industriesContent[slug as IndustrySlug];
}

export const allIndustriesContent = Object.values(industriesContent);
