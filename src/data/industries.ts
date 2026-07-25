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
    phrasing: {
      h1: "Government IT in Nigeria",
      specialist: "a government",
      demandsHeading: "What government IT demands",
      ctaHeading: "IT for government, done right",
    },
    intro: [
      "Documented, audit-ready IT procurement and delivery built for public-sector accountability and LPO workflows.",
    ],
    body: [
      "Public-sector IT is judged twice: once when it is delivered, and again — sometimes years later — when an auditor opens the file. That second test is the one most vendors fail. Getting the equipment to a ministry is the easy part; producing the quotation, proforma invoice, LPO-matched delivery note and authorised-channel provenance that a query demands is where procurement either holds up or unravels. We build the file as we go, so the paperwork is complete on the day and still complete when it is examined later.",
      "The work also has to respect how agencies actually buy: formal approval chains, budget lines that cannot be exceeded, and fulfilment that matches the LPO to the letter rather than substituting a different model when stock runs short. We plan around those constraints instead of treating them as friction — which is why our government deliveries move through approval without the back-and-forth that stalls less disciplined suppliers.",
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
    relatedInsights: [
      "audit-ready-it-procurement-for-government",
      "how-the-lpo-process-works-for-public-sector-it",
      "it-readiness-checklist-for-government-agencies",
      "complete-guide-to-it-procurement-in-nigeria",
      "how-to-evaluate-it-vendors-in-nigeria",
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
    phrasing: {
      h1: "Banking IT in Nigeria",
      specialist: "a banking",
      demandsHeading: "What financial services demand",
      ctaHeading: "IT for banking and financial services, done right",
    },
    intro: [
      "Bank branch infrastructure, resilient networks and managed services with the documentation regulated environments demand.",
    ],
    body: [
      "In banking, the infrastructure is only as good as its worst branch. A network built one way on Victoria Island and another way in a state capital creates exactly the inconsistency that makes support slow and audits painful. We deliver branch builds to a single documented standard — cabling, network, power and configuration the same everywhere — so a fault in one branch is diagnosed the same way as a fault in any other, and opening the next branch is a repeat of a known process rather than a fresh negotiation.",
      "Regulated environments also raise the bar on evidence and availability. Equipment has to be genuine and traceable, work has to be documented for the compliance team, and customer-facing systems cannot be down during banking hours. We plan cutovers out of hours, size power protection for real conditions, and monitor proactively — treating uptime and the paper trail as requirements, not extras.",
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
    relatedInsights: [
      "budgeting-bank-branch-infrastructure",
      "it-checklist-for-opening-a-new-bank-branch",
      "securing-multi-branch-networks",
      "lan-wan-design-for-multi-branch-businesses",
      "ndpr-compliance-for-it-teams",
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
    phrasing: {
      h1: "Enterprise IT in Nigeria",
      specialist: "an enterprise",
      demandsHeading: "What large enterprises demand",
      ctaHeading: "IT for enterprise, done right",
    },
    intro: [
      "One accountable IT partner across every site — consistent standards, clear ownership and measured SLAs.",
    ],
    body: [
      "The problem large organisations bring us is rarely a single broken thing — it is fragmentation. Different vendors for different sites, procurement in one place and support in another, and no one who can answer for the whole estate when something goes wrong. That is how a simple fault turns into a week of vendors pointing at each other. We consolidate the estate under one accountable partner, with one set of standards for hardware, infrastructure and configuration, so ownership is clear and the answer to 'who fixes this' is never in dispute.",
      "Consistency is also what makes growth cheap. When every site is built to the same standard and documented the same way, adding a location, a hundred users or a new capability is an extension of a known pattern, not a bespoke project. We design with that headroom deliberately, and back it with SLAs and reporting so IT performance is a number you can see rather than a feeling — and we extend in-house teams rather than replacing them where that is what you need.",
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
    relatedInsights: [
      "structuring-a-multi-site-it-refresh",
      "it-budgeting-for-nigerian-enterprises",
      "how-to-build-a-three-year-it-roadmap",
      "it-support-for-multi-site-operations",
      "what-an-it-sla-should-cover",
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
    phrasing: {
      h1: "IT for SMEs in Nigeria",
      specialist: "an SME",
      demandsHeading: "What growing SMEs need",
      ctaHeading: "IT for SMEs, done right",
    },
    intro: [
      "Right-sized equipment and dependable support in plain language — priced to fit and built to grow.",
    ],
    body: [
      "Smaller businesses get sold to badly. The usual pitch is either enterprise kit priced for a company ten times the size, or the cheapest possible option that has to be replaced within the year. Neither respects the actual constraint, which is that every naira has to earn its place. We size to the business in front of us — enough capacity and reliability to run without drama, without paying today for headroom you will not touch for three years — and we say so in plain language rather than jargon that exists to justify the invoice.",
      "The other thing an SME rarely has is an IT team, which means support cannot depend on someone in-house noticing a problem. For many of our SME clients we are that function: advice, procurement and responsive support in one place, and choices that scale so adding staff or a second location later is an upgrade rather than a rip-and-replace.",
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
    relatedInsights: [
      "cybersecurity-essentials-for-nigerian-smes",
      "in-house-vs-outsourced-it-support-nigeria",
      "refresh-or-repair-it-hardware-decision",
      "consolidated-vs-reactive-it-purchasing",
      "network-installation-checklist-new-office",
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
    phrasing: {
      h1: "Healthcare IT in Nigeria",
      specialist: "a healthcare",
      demandsHeading: "What healthcare demands",
      ctaHeading: "IT for healthcare, done right",
    },
    intro: [
      "High-uptime infrastructure and power protection that keep clinical systems available around the clock.",
    ],
    body: [
      "In a care setting, downtime is not an inconvenience — it is a records system a clinician cannot reach, a diagnostic device that will not connect, a queue that stops moving. That raises the stakes on two things most facilities underestimate: power and cabling. Unstable mains supply will corrupt data and shorten equipment life unless UPS and clean-power planning are designed in from the start, and intermittent network faults from poor cabling are precisely the kind of problem that is hardest to trace when a ward is busy. We build both properly the first time and document them, so the infrastructure is not a recurring source of emergencies.",
      "Support has to match the environment too. A slow fix in a hospital carries a cost an office never sees, so we back healthcare infrastructure with responsive remote support and on-site engineers under SLAs written for settings where availability is not negotiable.",
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
    relatedInsights: [
      "it-setup-guide-for-hospitals-and-clinics",
      "power-protection-and-ups-planning",
      "ransomware-readiness-for-nigerian-organisations",
      "what-an-it-sla-should-cover",
      "structured-cabling-standards-for-nigerian-offices",
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
    phrasing: {
      h1: "Education IT in Nigeria",
      specialist: "an education",
      demandsHeading: "What education demands",
      ctaHeading: "IT for education, done right",
    },
    intro: [
      "Durable, budget-conscious IT for labs, campuses and classrooms that keeps learning running.",
    ],
    body: [
      "Institutions buy IT against a fixed budget and then live with it for years, often across a campus that grew building by building with no single network plan behind it. That combination punishes the wrong choices twice: equipment that is too fragile fails mid-term when there is no budget to replace it, and a patchwork network makes every new lab or admin system harder to connect than the last. We right-size durable, standardised fleets that are easy to image, support and refresh as cohorts change, and we build campus connectivity as one coherent network rather than another one-off run.",
      "The support model matters as much as the kit. Labs and offices have to keep running through term, so we set sensible response targets for an institutional setting and standardise the estate enough that a fault is a quick, known fix rather than a bespoke investigation.",
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
    relatedInsights: [
      "it-infrastructure-for-schools-and-universities",
      "structured-cabling-standards-for-nigerian-offices",
      "network-installation-checklist-new-office",
      "in-house-vs-outsourced-it-support-nigeria",
      "cybersecurity-essentials-for-nigerian-smes",
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
    phrasing: {
      h1: "Oil and gas IT in Nigeria",
      specialist: "an energy-sector",
      demandsHeading: "What energy operations demand",
      ctaHeading: "IT for oil, gas and energy, done right",
    },
    intro: [
      "Resilient infrastructure and hardware built to survive demanding, remote energy-sector sites.",
    ],
    body: [
      "The energy sector sets requirements an office spec cannot meet. Equipment has to survive heat, humidity and dust, ride through mains power that is anything but clean, and keep running at sites where the nearest engineer may be hours away. Office-grade kit sent into that environment fails early and fails often. We specify for the conditions the equipment will actually operate in, size power protection for real supply quality rather than the nameplate assumption, and source everything genuine and warrantied through authorised channels so a failure in the field is covered, not disputed.",
      "Remoteness changes the support model as much as the hardware. When you cannot simply send someone that afternoon, resilience has to be designed in — spares planned, configurations documented so on-site staff can keep systems running between visits, and proactive monitoring under SLAs written for sites away from major centres. We plan for HSE requirements and site access up front, so delivery and maintenance are not held up at the gate.",
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
    relatedInsights: [
      "it-for-oil-gas-and-energy-operations",
      "powering-it-through-nigerias-energy-challenges",
      "power-protection-and-ups-planning",
      "designing-a-server-room-power-cooling-ups",
      "proactive-it-monitoring-explained",
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
    phrasing: {
      h1: "Logistics and plant IT in Nigeria",
      specialist: "a logistics",
      demandsHeading: "What logistics and manufacturing demand",
      ctaHeading: "IT for logistics and manufacturing, done right",
    },
    intro: [
      "Connected-site networks and responsive support that keep warehouses and plants moving.",
    ],
    body: [
      "In logistics and manufacturing, IT is not a back-office convenience — it is part of the line. When the network between a warehouse and head office drops, dispatch stalls; when a scanner or a plant workstation fails, throughput does with it. The environments are harder on equipment than an office, and the cost of an outage is measured in stopped goods, so the priorities invert: reliability and fast recovery come first, and the infrastructure has to be built and standardised for busy, physical sites rather than quiet ones.",
      "Most of these operations run across several locations, which makes coordination the real work. We connect warehouses, plants and offices on reliable networks, supply genuine standardised hardware that is quick to support, and put monitoring, power protection and SLAs around the systems that move goods — one accountable partner across every site, with consistent standards and documentation for the whole operation.",
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
    relatedInsights: [
      "it-support-for-multi-site-operations",
      "lan-wan-design-for-multi-branch-businesses",
      "structured-cabling-standards-for-nigerian-offices",
      "proactive-it-monitoring-explained",
      "what-an-it-sla-should-cover",
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
