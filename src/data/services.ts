/**
 * data/services.ts — Full marketing copy for the six service lines.
 *
 * Keyed by the authoritative slugs in `src/lib/site.ts`. Long-form copy lives
 * here; short blurbs/nav labels live in site.ts. The SEO agent reads `faqs` to
 * build FAQPage JSON-LD and `metaTitle`/`metaDescription` for metadata.
 */
import type { ServiceContent, ServiceSlug } from "./types";

export const servicesContent: Record<ServiceSlug, ServiceContent> = {
  "it-procurement": {
    slug: "it-procurement",
    title: "IT Procurement",
    tagline: "Documented IT procurement in Nigeria — from requisition to delivery.",
    intro: [
      "IT procurement is where most projects quietly go wrong: untraceable quotes, grey-market hardware, mismatched specifications, and paperwork that fails an audit. As an IT procurement company in Nigeria, Digitplus runs sourcing as a disciplined, documented process so every purchase is justified, sourced from authorised channels, and traceable end to end.",
      "We handle hardware and software sourcing for single offices and multi-site rollouts alike, working within your budget cycle, approval chain, and Local Purchase Order (LPO) requirements. You get a single accountable partner instead of a scatter of vendors — and a paper trail that stands up to scrutiny.",
    ],
    whatsIncluded: [
      {
        title: "Hardware sourcing",
        desc: "Servers, workstations, networking, and peripherals specified to fit your environment and sourced through authorised distribution — no grey imports.",
      },
      {
        title: "Software & licensing",
        desc: "Correctly licensed operating systems, productivity suites, and security software, with renewal tracking so nothing lapses unexpectedly.",
      },
      {
        title: "LPO support",
        desc: "Procurement that fits public-sector and corporate purchasing workflows: quotations, proforma invoices, LPO fulfilment, and complete delivery documentation.",
      },
      {
        title: "Multi-site coordination",
        desc: "Consolidated buying and staged delivery across Abuja, Lagos, Port Harcourt, and beyond — one order, one invoice trail, many locations.",
      },
    ],
    howItWorks: [
      "We confirm requirements, standards, and budget constraints before a single quote is raised.",
      "We source from authorised channels and present transparent, line-itemised quotations.",
      "On approval, we issue or fulfil the LPO and confirm lead times in writing.",
      "We coordinate logistics, delivery, and inspection across every site involved.",
      "You receive complete documentation — invoices, warranties, and asset records — for your files and audits.",
    ],
    relevantIndustries: [
      "government",
      "banking-financial-services",
      "enterprise",
      "education",
    ],
    faqs: [
      {
        q: "Can you work within our existing procurement and LPO process?",
        a: "Yes. We are set up for formal purchasing workflows — quotations, proforma invoices, LPO fulfilment, and itemised delivery notes. We adapt to your approval chain rather than asking you to change it.",
      },
      {
        q: "Do you supply genuine, warrantied equipment?",
        a: "Always. We source through authorised distribution channels, so hardware arrives with valid manufacturer warranties and verifiable provenance. We do not deal in grey-market stock.",
      },
      {
        q: "Can you handle IT procurement for multiple locations in Nigeria at once?",
        a: "Yes. We routinely consolidate orders and coordinate staged delivery across Abuja, Lagos, Port Harcourt, and other sites, keeping a single, auditable record for the whole programme.",
      },
      {
        q: "How do you keep procurement audit-ready?",
        a: "Every step is documented — the requirement, the sourcing, the quotation, the LPO, delivery, and warranty details. The result is a complete, traceable file for internal and external audit.",
      },
      {
        q: "What if we are not sure exactly what to buy?",
        a: "We start with your actual requirement, not a product list. If specification is unclear, our advisory team helps you right-size before any money is committed.",
      },
    ],
    metaTitle: "IT Procurement Services in Nigeria",
    metaDescription:
      "Documented, audit-ready IT procurement for enterprises, government, and institutions. Authorised-channel hardware and software, LPO support, and multi-site coordination.",
  },

  "hardware-supply": {
    slug: "hardware-supply",
    title: "Hardware Supply",
    tagline: "Genuine hardware supply in Nigeria — authorised channels, real warranties.",
    intro: [
      "The hardware you deploy today sets your reliability and support costs for years. Digitplus is a hardware supply company in Nigeria: we supply servers, workstations, networking, and peripherals sourced exclusively through authorised distribution — equipment that arrives genuine, correctly specified, and covered by valid manufacturer warranties.",
      "We help you standardise on the right platforms, avoid over- and under-specifying, and plan refresh cycles that fit your budget. Whether you need a single server room build or a fleet of workstations across several sites, you get equipment chosen for fitness, not just price.",
    ],
    whatsIncluded: [
      {
        title: "Servers & storage",
        desc: "Rack and tower servers, storage, and backup hardware sized for your workloads, with vendor warranty and support options.",
      },
      {
        title: "Workstations & laptops",
        desc: "Business-grade desktops and laptops standardised across your fleet for easier support, imaging, and lifecycle management.",
      },
      {
        title: "Networking equipment",
        desc: "Switches, routers, access points, and firewalls from established vendors, specified to match your topology and growth plans.",
      },
      {
        title: "Warranties & lifecycle",
        desc: "Valid manufacturer warranties, extended-cover options, and refresh planning so ageing equipment never becomes a surprise.",
      },
    ],
    howItWorks: [
      "We assess your workloads, sites, and standardisation goals.",
      "We recommend right-sized platforms from authorised vendors — no over-spend, no grey stock.",
      "We confirm specifications, warranty terms, and lead times in writing.",
      "We deliver and, where required, stage equipment ahead of deployment.",
      "We register warranties and hand over complete asset and serial records.",
    ],
    relevantIndustries: [
      "enterprise",
      "banking-financial-services",
      "healthcare",
      "logistics-manufacturing",
    ],
    faqs: [
      {
        q: "Is all your hardware genuine and warrantied?",
        a: "Yes. We supply only through authorised distribution, so equipment is genuine and arrives with valid manufacturer warranties you can verify.",
      },
      {
        q: "Which hardware brands do you supply in Nigeria?",
        a: "We work across established enterprise vendors — including HP, Dell, Lenovo, Cisco, and Fortinet — and recommend based on fit for your environment rather than pushing a single brand.",
      },
      {
        q: "Can you help us standardise our equipment?",
        a: "That is one of the biggest cost savings we deliver. Standardising on a small set of platforms simplifies support, imaging, and spares — we help you choose and roll it out.",
      },
      {
        q: "Do you offer extended warranty or support cover?",
        a: "Yes. We can arrange extended manufacturer cover and pair hardware with our managed-services SLAs so support is in place from day one.",
      },
    ],
    metaTitle: "IT Hardware Supply in Nigeria — Servers & Networking",
    metaDescription:
      "Genuine, warrantied IT hardware from authorised channels — servers, workstations, networking, and peripherals — specified, supplied, and lifecycle-managed across Nigeria.",
  },

  "infrastructure-solutions": {
    slug: "infrastructure-solutions",
    title: "Infrastructure Solutions",
    tagline: "Structured cabling, network installation, and server room setup — built to last.",
    intro: [
      "Reliable IT starts with reliable infrastructure: clean cabling, well-designed networks, properly conditioned server rooms, and power that holds. Get these wrong and you inherit years of intermittent faults that are expensive to diagnose. As an IT infrastructure company working across Abuja, Lagos, and Port Harcourt, Digitplus designs and builds infrastructure to standard, the first time.",
      "We deliver structured cabling, LAN/WAN network installation, server room setup, and UPS/power systems as a coordinated whole — so your network, environment, and power work together rather than fighting each other. Every build is documented and labelled for the people who will support it later.",
    ],
    whatsIncluded: [
      {
        title: "Structured cabling",
        desc: "Certified copper and fibre cabling, neatly dressed and labelled, tested and documented to recognised standards for long-term reliability.",
      },
      {
        title: "LAN / WAN networks",
        desc: "Network design and build across floors, buildings, and branches — resilient links that scale as you add sites and users.",
      },
      {
        title: "Server rooms & data closets",
        desc: "Racking, cooling, environmental considerations, and physical organisation that keep critical equipment safe and serviceable.",
      },
      {
        title: "UPS & power protection",
        desc: "Uninterruptible power, surge protection, and clean-power planning to keep systems running through the unstable supply Nigerian sites contend with.",
      },
    ],
    howItWorks: [
      "We survey the site and document existing conditions and constraints.",
      "We design cabling, network, and power as one coordinated system.",
      "We agree a build plan that minimises disruption to live operations.",
      "We install, terminate, test, and certify — capturing results as we go.",
      "We hand over labelled records, test reports, and as-built documentation.",
    ],
    relevantIndustries: [
      "banking-financial-services",
      "enterprise",
      "healthcare",
      "oil-gas-energy",
    ],
    faqs: [
      {
        q: "Do you test and certify structured cabling?",
        a: "Yes. We test and certify every run, label both ends, and hand over the results as part of the as-built documentation, so faults are quick to trace later.",
      },
      {
        q: "Can you work in a live environment without major downtime?",
        a: "We plan builds around your operations — phasing work, scheduling cutovers, and working out of hours where needed to keep disruption to a minimum.",
      },
      {
        q: "Do you handle power and UPS as well as cabling?",
        a: "Yes. We treat cabling, networking, and power as one system. Designing them together avoids the mismatches that cause intermittent, hard-to-find faults.",
      },
      {
        q: "Will the infrastructure scale as we grow?",
        a: "We design with headroom and clear documentation so adding floors, branches, or capacity later is straightforward rather than a rebuild.",
      },
    ],
    metaTitle: "IT Infrastructure Company in Nigeria — Cabling & Networks",
    metaDescription:
      "Structured cabling, LAN/WAN, server rooms, and UPS/power — designed and built to standard, tested, and documented for long-term reliability across Nigeria.",
  },

  "managed-services": {
    slug: "managed-services",
    title: "Managed Services",
    tagline: "Managed IT services in Nigeria — support and monitoring that keep operations running.",
    intro: [
      "Most organisations do not need more IT staff — they need their IT to simply work, with someone accountable when it does not. Our managed IT services in Nigeria give you that: proactive monitoring, responsive remote and on-site support, and SLAs that put commitments in writing.",
      "We become the dependable extension of your team, watching the systems that matter, resolving issues before they spread, and reporting clearly on what we are doing. The result is fewer surprises, predictable costs, and time back for your people to focus on the business.",
    ],
    whatsIncluded: [
      {
        title: "Remote support",
        desc: "A responsive helpdesk for day-to-day issues, remote diagnosis, and fast resolution without waiting for an on-site visit.",
      },
      {
        title: "On-site support",
        desc: "Scheduled and on-demand engineer visits for the work that has to happen in person, across your covered locations.",
      },
      {
        title: "Service-level agreements",
        desc: "Clear response and resolution targets, defined scope, and regular reporting — commitments you can hold us to.",
      },
      {
        title: "Proactive monitoring",
        desc: "Continuous monitoring of servers, networks, and critical services so we can act on problems before they become outages.",
      },
    ],
    howItWorks: [
      "We document your environment and agree what we will support and to what targets.",
      "We put monitoring and access in place and establish your support channels.",
      "We handle day-to-day issues remotely, escalating to on-site where needed.",
      "We act proactively on alerts to prevent avoidable downtime.",
      "We report regularly on tickets, uptime, and recommendations against the SLA.",
    ],
    relevantIndustries: [
      "enterprise",
      "banking-financial-services",
      "healthcare",
      "sme",
    ],
    faqs: [
      {
        q: "What does your SLA actually commit to?",
        a: "Defined response and resolution targets for different issue priorities, the scope of what is covered, and regular reporting against those targets. It is written down, so expectations are clear on both sides.",
      },
      {
        q: "Do you provide managed IT support across multiple locations in Nigeria?",
        a: "Yes. We deliver remote support nationwide and on-site support across Abuja, Lagos, Port Harcourt, and other agreed locations.",
      },
      {
        q: "Can you work alongside our in-house IT team?",
        a: "Absolutely. Many clients use us to extend an existing team — covering monitoring, after-hours support, or specialist work — rather than replacing them.",
      },
      {
        q: "What do you monitor?",
        a: "Typically servers, networks, internet links, and the business-critical services you depend on. We tailor monitoring to your environment so alerts are meaningful, not noise.",
      },
    ],
    metaTitle: "Managed IT Services & Support with SLAs",
    metaDescription:
      "Proactive monitoring, remote and on-site support, and clear SLAs that keep your operations running. Managed IT services for organisations across Nigeria.",
  },

  "technology-advisory": {
    slug: "technology-advisory",
    title: "Technology Advisory",
    tagline: "Independent guidance that turns IT spend into outcomes.",
    intro: [
      "Technology decisions are expensive to get wrong and hard to reverse. Digitplus advisory gives decision-makers clear, vendor-neutral guidance: what to invest in, when, and why — grounded in your operations and budget rather than a product catalogue.",
      "We help you set IT strategy, plan budgets you can defend, select the right vendors, and lay out multi-year roadmaps that sequence investment sensibly. Because we deliver as well as advise, our recommendations are realistic — we know what it takes to implement them.",
    ],
    whatsIncluded: [
      {
        title: "IT strategy",
        desc: "A clear view of where your technology stands today and a practical plan to align it with where the organisation is going.",
      },
      {
        title: "Budgeting & business cases",
        desc: "Defensible IT budgets and cost models — including total cost of ownership — that hold up in front of finance and leadership.",
      },
      {
        title: "Vendor selection",
        desc: "Independent evaluation of platforms and suppliers against your real requirements, free of any single-vendor bias.",
      },
      {
        title: "Multi-year roadmaps",
        desc: "Phased plans that sequence refreshes, upgrades, and new capability so investment is paced and disruption is managed.",
      },
    ],
    howItWorks: [
      "We listen first — to your goals, constraints, and the pain points you live with.",
      "We assess your current estate, costs, and risks objectively.",
      "We frame options with clear trade-offs in cost, risk, and timing.",
      "We agree a roadmap and budget you can defend internally.",
      "We stay available to help you execute — or hand off cleanly to your team.",
    ],
    relevantIndustries: [
      "government",
      "enterprise",
      "banking-financial-services",
      "sme",
    ],
    faqs: [
      {
        q: "Are your recommendations vendor-neutral?",
        a: "Yes. Advisory engagements are about your best fit, not selling a particular brand. We assess options against your requirements and tell you what we genuinely recommend.",
      },
      {
        q: "Can you help build an IT budget we can defend?",
        a: "That is a core part of what we do. We produce costed plans, including total cost of ownership, that stand up to finance and leadership scrutiny.",
      },
      {
        q: "Do we have to use you for delivery afterwards?",
        a: "No. Advisory is a standalone service. Many clients do ask us to deliver, because we already understand the plan — but it is never a condition.",
      },
      {
        q: "How long does an advisory engagement take?",
        a: "It depends on scope. A focused vendor selection can be a couple of weeks; a full strategy and multi-year roadmap takes longer. We agree timeframes up front.",
      },
    ],
    metaTitle: "IT Strategy & Technology Advisory Services",
    metaDescription:
      "Vendor-neutral IT strategy, budgeting, vendor selection, and multi-year roadmaps for decision-makers. Practical advisory from a partner who also delivers.",
  },

  "deployment-implementation": {
    slug: "deployment-implementation",
    title: "Deployment & Implementation",
    tagline: "From delivered boxes to working systems — handover done right.",
    intro: [
      "Hardware on a loading dock is not a working system. The gap between the two is deployment — and it is where rushed projects fail. Digitplus handles IT deployment and implementation in Nigeria as a managed process — installation, configuration, testing, and user training — so what you bought actually works and your people can use it.",
      "We plan rollouts around your operations, configure to agreed standards, test against clear acceptance criteria, and only sign off when everything works as intended. You get a clean, documented handover and users who are ready on day one — not weeks of teething problems.",
    ],
    whatsIncluded: [
      {
        title: "Installation",
        desc: "Physical installation and commissioning of equipment — racked, mounted, connected, and powered to a tidy, supportable standard.",
      },
      {
        title: "Configuration",
        desc: "Systems, network, and software configured to agreed standards and security baselines, consistently across every device.",
      },
      {
        title: "Testing & acceptance",
        desc: "Structured testing against clear acceptance criteria, so issues are found and fixed before go-live, not after.",
      },
      {
        title: "User training",
        desc: "Practical handover and training so staff are confident with new systems from the first day they rely on them.",
      },
    ],
    howItWorks: [
      "We build a rollout plan that works around your operating hours and sites.",
      "We install and commission equipment to a tidy, supportable standard.",
      "We configure systems consistently to agreed standards and baselines.",
      "We test against acceptance criteria and resolve issues before go-live.",
      "We train users and hand over documentation, then support the transition.",
    ],
    relevantIndustries: [
      "enterprise",
      "education",
      "healthcare",
      "logistics-manufacturing",
    ],
    faqs: [
      {
        q: "Do you deploy outside normal working hours?",
        a: "Yes. We plan rollouts around your operations and frequently work evenings, weekends, or in phases to keep disruption to a minimum.",
      },
      {
        q: "How do you confirm a deployment is actually finished?",
        a: "We test against acceptance criteria agreed in advance. Sign-off happens when those criteria are met — not when the boxes are simply unpacked.",
      },
      {
        q: "Is user training included?",
        a: "Practical handover and training are part of how we deliver. Systems only deliver value when the people using them are confident, so we make sure they are.",
      },
      {
        q: "Can you deploy across several sites at once?",
        a: "Yes. We coordinate multi-site rollouts with consistent configuration and a single plan, so every location ends up at the same standard.",
      },
    ],
    metaTitle: "IT Deployment & Implementation Services",
    metaDescription:
      "Installation, configuration, testing, and user training delivered as a managed process. Clean, documented IT deployment and implementation across Nigeria.",
  },
};

export function getServiceContent(slug: string): ServiceContent | undefined {
  return servicesContent[slug as ServiceSlug];
}

export const allServicesContent = Object.values(servicesContent);
