/**
 * data/industries.ts — Full marketing copy for the eight industries served.
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
      "Public-sector IT lives and dies by documentation. Procurement must be traceable, spending must withstand audit, and delivery must match what was specified and approved. Digitplus is built for exactly this kind of accountability.",
      "We support ministries, departments, agencies, and parastatals with documented procurement, LPO-aligned purchasing, and delivery that leaves a clean paper trail from requisition to handover — so your technology programmes are defensible at every level.",
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
        q: "Can you work within government procurement processes?",
        a: "Yes. We are set up for formal public-sector purchasing — quotations, proforma invoices, LPO fulfilment, and complete delivery documentation that aligns with your approval chain.",
      },
      {
        q: "How do you support audit requirements?",
        a: "Every transaction is documented and the equipment is sourced through authorised channels. The result is a clean, traceable file that stands up to audit scrutiny.",
      },
    ],
    metaTitle: "IT Solutions for Government & Public Sector | Digitplus Technology",
    metaDescription:
      "Documented, audit-ready IT procurement, infrastructure, and deployment for Nigerian government agencies. LPO-aligned purchasing and traceable delivery.",
  },

  "banking-financial-services": {
    slug: "banking-financial-services",
    title: "Banking & Financial Services",
    intro: [
      "In financial services, downtime and compliance gaps carry direct cost and risk. Branch networks, data centres, and back-office systems have to stay available, secure, and well-documented — across many locations at once.",
      "Digitplus delivers branch infrastructure, resilient networks, and accountable managed services for banks, microfinance institutions, and fintechs, with the vendor accountability and documentation that regulated environments demand.",
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
        desc: "A single accountable partner across procurement, build, and support — fewer hand-offs, clearer ownership when something needs fixing.",
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
        q: "Can you roll out infrastructure across many branches?",
        a: "Yes. We deliver standardised branch builds and coordinate multi-site rollouts so every location reaches the same documented standard.",
      },
      {
        q: "How do you support uptime requirements?",
        a: "Through proactive monitoring, defined SLAs, and power protection — designed to keep core and customer-facing systems available.",
      },
    ],
    metaTitle: "IT Solutions for Banking & Financial Services | Digitplus",
    metaDescription:
      "Branch infrastructure, resilient networks, and managed services for banks, microfinance, and fintech in Nigeria — with vendor accountability and compliance-aligned delivery.",
  },

  enterprise: {
    slug: "enterprise",
    title: "Enterprise",
    intro: [
      "Large organisations rarely struggle for vendors — they struggle for accountability. Multiple sites, mixed equipment, and a patchwork of suppliers make it hard to know who owns a problem. Digitplus consolidates that into a single, accountable IT partner.",
      "From multi-site infrastructure to managed support under clear SLAs, we give enterprises consistent standards, one point of ownership, and the documentation to manage IT as a discipline rather than a series of fire-fights.",
    ],
    concerns: [
      {
        title: "Multi-site consistency",
        desc: "One set of standards for hardware, infrastructure, and configuration across every office, so support and expansion stay predictable.",
      },
      {
        title: "Single point of accountability",
        desc: "Procurement, deployment, and support under one partner — clear ownership instead of vendors pointing at each other.",
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
        a: "Yes. We frequently extend in-house teams — covering monitoring, specialist work, or additional locations — rather than replacing them.",
      },
    ],
    metaTitle: "Enterprise IT Solutions & Managed Services | Digitplus Technology",
    metaDescription:
      "Multi-site infrastructure, SLAs, and a single accountable IT partner for enterprises in Nigeria. Consistent standards, clear ownership, and scalable foundations.",
  },

  sme: {
    slug: "sme",
    title: "SME",
    intro: [
      "Growing businesses need IT that works without needing a department to run it. What they usually get instead is jargon, oversized proposals, and support that disappears after the invoice is paid. Digitplus takes a different approach.",
      "We give small and medium enterprises practical guidance, right-sized equipment, and dependable support — explained in plain language, priced to fit, and built to grow with you rather than lock you in.",
    ],
    concerns: [
      {
        title: "Practical, plain-spoken advice",
        desc: "Recommendations in language you can act on, focused on what your business actually needs — not the biggest possible spend.",
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
        q: "We do not have an IT team — can you handle everything?",
        a: "Yes. Many SME clients rely on us as their whole IT function, from advice and procurement to support, so they can focus on the business.",
      },
      {
        q: "Will the solution grow with us?",
        a: "We deliberately right-size and choose options that scale, so adding staff or locations later does not mean replacing what you already bought.",
      },
    ],
    metaTitle: "IT Solutions & Support for SMEs in Nigeria | Digitplus Technology",
    metaDescription:
      "Practical, plain-spoken IT for growing businesses — right-sized equipment, dependable support, and guidance without the jargon. SME IT solutions across Nigeria.",
  },

  healthcare: {
    slug: "healthcare",
    title: "Healthcare",
    intro: [
      "In hospitals and clinics, IT failure is not an inconvenience — it interrupts care. Records systems, networks, and the equipment that depends on them must stay available, and the power behind them must hold even when the grid does not.",
      "Digitplus delivers reliable, high-uptime infrastructure and responsive support for healthcare providers, with the resilience and documentation that clinical environments require.",
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
    metaTitle: "Reliable IT Solutions for Healthcare & Hospitals | Digitplus",
    metaDescription:
      "High-uptime infrastructure, power protection, and responsive support for hospitals and clinics in Nigeria. Dependable healthcare IT that keeps systems available.",
  },

  education: {
    slug: "education",
    title: "Education",
    intro: [
      "Schools, colleges, and universities have to make limited budgets stretch across labs, offices, classrooms, and growing student numbers. The pressure is to spend carefully and avoid replacing things twice.",
      "Digitplus delivers budget-conscious, dependable IT for the education sector — durable equipment, sensible infrastructure, and support that keeps learning environments running without overspending.",
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
    metaTitle: "Budget-Conscious IT Solutions for Education | Digitplus Technology",
    metaDescription:
      "Durable, budget-conscious IT for schools, colleges, and universities in Nigeria — computer labs, campus connectivity, and dependable support that keeps learning running.",
  },

  "oil-gas-energy": {
    slug: "oil-gas-energy",
    title: "Oil, Gas & Energy",
    intro: [
      "Energy-sector operations are demanding by nature: remote sites, harsh conditions, and a low tolerance for downtime. IT here has to be resilient, well-documented, and supportable far from the nearest city.",
      "Digitplus delivers robust infrastructure, dependable hardware, and managed services for oil, gas, and energy operations — built for resilience and backed by support that reaches your sites.",
    ],
    concerns: [
      {
        title: "Resilient infrastructure",
        desc: "Networks and power designed for reliability and continuity in demanding, sometimes remote, operating environments.",
      },
      {
        title: "Robust hardware",
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
    metaTitle: "IT Solutions for Oil, Gas & Energy | Digitplus Technology",
    metaDescription:
      "Resilient infrastructure, robust hardware, and managed services for oil, gas, and energy operations in Nigeria — built for demanding and remote environments.",
  },

  "logistics-manufacturing": {
    slug: "logistics-manufacturing",
    title: "Logistics & Manufacturing",
    intro: [
      "In logistics and manufacturing, IT keeps physical operations moving: connected warehouses, plant-floor networks, and the systems that track goods and production. When connectivity drops, throughput drops with it.",
      "Digitplus delivers connected-site infrastructure, dependable hardware, and responsive support that keep warehouses, plants, and distribution running across every location.",
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
    metaTitle: "IT Solutions for Logistics & Manufacturing | Digitplus Technology",
    metaDescription:
      "Connected-site infrastructure, dependable hardware, and responsive support for logistics and manufacturing in Nigeria — keeping warehouses and plants moving.",
  },
};

export function getIndustryContent(slug: string): IndustryContent | undefined {
  return industriesContent[slug as IndustrySlug];
}

export const allIndustriesContent = Object.values(industriesContent);
