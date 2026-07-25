/**
 * data/locations.ts — Local substance for the three coverage cities.
 *
 * NAP stays canonical in site.ts; this is the local editorial layer. Each city
 * is written from what actually differs about operating there — the areas we
 * reach, the logistics reality, the sectors concentrated in that city, and the
 * questions a buyer in that city actually asks. No templated near-duplicates:
 * the neighbourhoods, sectors and logistics notes are specific to each city and
 * do not cross over (the §B.2 content-depth debt / 40%-similarity rule).
 *
 * The SEO layer reads `faqs`, `metaTitle` and `metaDescription`; LocalBusiness
 * JSON-LD is built in src/lib/seo/schema.ts.
 */
import type { TitledItem, FAQ } from "./types";

export interface LocationContent {
  slug: "abuja" | "lagos" | "port-harcourt";
  city: string;
  /** "Headquarters" | "Delivery hub", role of this location. */
  role: string;
  intro: string[];
  /** The operator's-eye story of working in this city (2–3 paragraphs). */
  localBody: string[];
  /** Named areas we deliver to — concrete, city-specific, not a generic list. */
  areasServed: string[];
  /** How delivery and logistics actually work in this city. */
  logistics: TitledItem[];
  /** Sectors concentrated in this city that we serve. */
  sectorsServed: TitledItem[];
  /** Short "on the ground" highlights (kept from the original copy). */
  highlights: string[];
  /** Local FAQ — feeds FAQPage schema and answers real area/coverage questions. */
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
}

export const locations: LocationContent[] = [
  {
    slug: "abuja",
    city: "Abuja",
    role: "Headquarters",
    intro: [
      "Abuja is our home. From the FCT we run documented, audit-ready IT procurement and delivery for federal agencies, parastatals and enterprises — the work happens where our team is, not at the end of a courier chain.",
    ],
    localBody: [
      "Being headquartered in the FCT changes what we can promise. A specification meeting in Maitama, a proforma raised the same afternoon, a server-room walk-through in the Central Business District, and equipment staged from our own base — that loop runs in days here, not weeks. For federal buyers it also means we understand the paperwork: quotation, proforma invoice, LPO, delivery note and a clean file that survives an audit long after the equipment is installed.",
      "Most of our Abuja work sits with Ministries, Departments and Agencies clustered around the Three Arms Zone and the CBD, and with enterprises in Wuse and Garki. But delivery does not stop at the districts — we install and support across the satellite towns where staff and back-office operations actually sit, from Gwarinpa and Kubwa to Lugbe and Nyanya. On-site response is measured in hours because the team is already in the city.",
    ],
    areasServed: [
      "Central Business District & Three Arms Zone",
      "Maitama, Asokoro & Wuse",
      "Garki, Utako & Jabi",
      "Gwarinpa, Kubwa, Lugbe & Nyanya",
    ],
    logistics: [
      {
        title: "Staged from our own base",
        desc: "Equipment is received, configured and quality-checked at our Abuja premises before it goes to your site, so what arrives is already imaged and ready — not a box to unpack and troubleshoot.",
      },
      {
        title: "Same-city response",
        desc: "For managed and break-fix support in the FCT, an engineer can be on site the same day. Distance is measured across a city, not across states.",
      },
      {
        title: "Procurement paperwork that holds",
        desc: "Every federal order carries the full documentation trail — quotation, proforma, LPO alignment and delivery notes — filed so internal and external audits are straightforward.",
      },
    ],
    sectorsServed: [
      {
        title: "Federal government & parastatals",
        desc: "MDAs procuring hardware and infrastructure under formal LPO workflows, with documentation built for the audit that follows.",
      },
      {
        title: "Enterprise & professional services",
        desc: "Head-office IT for firms in Wuse, Garki and the CBD — refreshes, structured cabling and managed support under clear SLAs.",
      },
      {
        title: "Education & health institutions",
        desc: "Federal universities, teaching hospitals and agencies that need reliable supply and installation across dispersed campuses.",
      },
    ],
    highlights: [
      "Documented, audit-ready procurement for federal agencies",
      "Infrastructure builds and server-room fit-outs across the FCT",
      "On-site managed support with same-day response in and around Abuja",
    ],
    faqs: [
      {
        q: "Do you deliver to areas outside the central districts, like Gwarinpa or Lugbe?",
        a: "Yes. We deliver and install across the FCT — the central districts and the satellite towns including Gwarinpa, Kubwa, Lugbe and Nyanya. Because we are based in Abuja, reaching sites outside the CBD does not add days to a rollout.",
      },
      {
        q: "Can you handle federal LPO and procurement documentation from your Abuja office?",
        a: "Yes. Formal public-sector purchasing is our core Abuja work: quotations, proforma invoices, LPO-aligned fulfilment and complete delivery documentation, prepared to stand up to audit.",
      },
      {
        q: "How quickly can an engineer get to our Abuja office for support?",
        a: "For managed and break-fix support in the FCT, we aim for same-day on-site response. Our team and equipment base are in the city, so support is not routed through another state.",
      },
    ],
    metaTitle: "IT Company in Abuja — Our HQ",
    metaDescription:
      "Digitplus is an IT company headquartered in Abuja, delivering documented procurement, infrastructure and managed services to government and enterprises across the FCT.",
  },
  {
    slug: "lagos",
    city: "Lagos",
    role: "Delivery hub",
    intro: [
      "Lagos is where Nigerian business density is highest and delivery is hardest. We run branch infrastructure, multi-site rollouts and managed support across the island and the mainland — planned around how the city actually moves.",
    ],
    localBody: [
      "The difference in Lagos is not the equipment, it is the logistics. A twenty-branch rollout for a bank fails or succeeds on scheduling: staging kit centrally, sequencing installs so an engineer is not stuck crossing the Third Mainland Bridge at the wrong hour, and confirming site readiness before anyone travels. We plan Lagos deployments around traffic windows and access constraints rather than pretending they do not exist — which is why multi-site programmes here land on the dates we commit to.",
      "Our Lagos work concentrates where the customers are: banking and financial-services branches on Victoria Island, Ikoyi, Marina and Ikeja; enterprise head offices along the Lekki–Epe corridor; and the dense SME base across the mainland that needs the same accountable delivery without an enterprise budget. Whether it is one office or a branch network, the documentation and SLA discipline are identical.",
    ],
    areasServed: [
      "Victoria Island, Ikoyi & Marina",
      "Ikeja, Maryland & Opebi",
      "Lekki, Ajah & the Epe corridor",
      "Apapa, Surulere & the mainland",
    ],
    logistics: [
      {
        title: "Traffic-aware scheduling",
        desc: "Multi-site installs are sequenced around Lagos movement — staging, site-readiness checks and time windows planned so engineers arrive when they can actually work, not when they can only sit in traffic.",
      },
      {
        title: "Central staging for rollouts",
        desc: "Branch and office kit is configured and imaged before it ships to each location, so a twenty-site programme is a series of quick, predictable installs rather than twenty separate troubleshooting jobs.",
      },
      {
        title: "Island-and-mainland coverage",
        desc: "One accountable team covers both sides of the lagoon under a single SLA, so you are not stitching together separate vendors for VI and Ikeja.",
      },
    ],
    sectorsServed: [
      {
        title: "Banking & financial services",
        desc: "Branch infrastructure, structured cabling and refreshes across VI, Ikoyi, Marina and Ikeja, with the documentation compliance teams expect.",
      },
      {
        title: "Enterprise & multi-site business",
        desc: "Head-office and branch IT for firms along the Lekki corridor and the mainland, deployed and supported under clear SLAs.",
      },
      {
        title: "SMEs & professional firms",
        desc: "Right-sized procurement, setup and support for the dense Lagos SME base — accountable delivery without enterprise overhead.",
      },
    ],
    highlights: [
      "Branch and office infrastructure for banking and financial services",
      "Multi-site procurement and deployment planned around Lagos logistics",
      "Remote and on-site managed support under clear SLAs",
    ],
    faqs: [
      {
        q: "Do you cover both Lagos Island and the mainland?",
        a: "Yes. One team covers Victoria Island, Ikoyi and Lekki as well as Ikeja, Apapa and the wider mainland under a single SLA, so island and mainland sites are not split across different vendors.",
      },
      {
        q: "How do you handle multi-branch rollouts given Lagos traffic?",
        a: "We stage and configure equipment centrally, confirm each site is ready before travel, and sequence installs around realistic time windows. Planning the logistics up front is what keeps a multi-branch programme on schedule here.",
      },
      {
        q: "Can you support a single Lagos office, not just branch networks?",
        a: "Yes. From one office fit-out to a branch network, the procurement documentation and SLA discipline are the same — the scope simply scales to what you need.",
      },
    ],
    metaTitle: "IT Company in Lagos",
    metaDescription:
      "Digitplus delivers IT procurement, branch infrastructure, deployment and managed services across Lagos — island and mainland — for banks, enterprises and SMEs.",
  },
  {
    slug: "port-harcourt",
    city: "Port Harcourt",
    role: "Delivery hub",
    intro: [
      "Port Harcourt anchors our delivery across the South-South energy corridor — resilient infrastructure and support built for industrial sites, unreliable power and locations that are not always easy to reach.",
    ],
    localBody: [
      "The energy corridor sets the requirements here, and they are stricter than a typical office. Equipment specified for Port Harcourt has to survive heat, humidity and dust, ride through unstable mains power, and keep running at sites where a support engineer cannot simply drop in that afternoon. So we build for resilience first: UPS and power protection sized properly, spares planned in, and configurations documented so on-site staff can keep things running between visits.",
      "Most of our South-South work sits around the Trans-Amadi industrial cluster, corporate offices in the GRA, and operator and service-company sites stretching toward Eleme, Onne and the wider Rivers State industrial base. Access to those sites often comes with HSE requirements and scheduling constraints, which we plan for rather than discover on the day — the same accountable procurement and delivery discipline, adapted to an operating environment that does not forgive shortcuts.",
    ],
    areasServed: [
      "Trans-Amadi industrial area",
      "Old & New GRA, Port Harcourt city",
      "Eleme, Onne & the Rivers industrial belt",
      "Corporate offices across greater Port Harcourt",
    ],
    logistics: [
      {
        title: "Built for power instability",
        desc: "Deployments include properly sized UPS and power protection as standard, because equipment on the energy corridor cannot assume clean, continuous mains supply.",
      },
      {
        title: "Planned for remote and restricted sites",
        desc: "We plan for HSE requirements, site access and travel time up front, with spares and documented configurations so operations continue between engineer visits.",
      },
      {
        title: "Ruggedised specification",
        desc: "Hardware is specified for heat, humidity and industrial conditions — not office-grade kit sent into a field environment it was never rated for.",
      },
    ],
    sectorsServed: [
      {
        title: "Oil, gas & energy operations",
        desc: "Resilient infrastructure and hardware for operators and service companies across the Rivers State industrial base, specified for demanding sites.",
      },
      {
        title: "Industrial & logistics firms",
        desc: "Procurement, deployment and support for businesses around Trans-Amadi, Eleme and Onne, built for continuous operation.",
      },
      {
        title: "Corporate & professional offices",
        desc: "Head-office IT and structured infrastructure for firms in the GRA and across the city, under clear managed-support SLAs.",
      },
    ],
    highlights: [
      "Resilient infrastructure for oil, gas, and energy operations",
      "Hardware supply and deployment across the South-South industrial belt",
      "Managed support models suited to demanding, sometimes remote, sites",
    ],
    faqs: [
      {
        q: "Do you deliver to industrial sites like Trans-Amadi, Eleme or Onne?",
        a: "Yes. Much of our South-South work is around the Trans-Amadi cluster and the Eleme–Onne industrial belt. We plan for site access and HSE requirements in advance so delivery and installation are not held up on the day.",
      },
      {
        q: "How do you handle unreliable power at Port Harcourt sites?",
        a: "Power protection is part of the specification, not an afterthought. Deployments include correctly sized UPS and, where needed, coordination around backup power, because equipment on the energy corridor has to keep running through unstable mains supply.",
      },
      {
        q: "Can you support remote sites where an engineer can't visit quickly?",
        a: "Yes. We plan spares and document configurations so on-site staff can keep systems running between visits, and structure managed support around the reality that some energy-corridor sites are not a short drive away.",
      },
    ],
    metaTitle: "IT Company in Port Harcourt",
    metaDescription:
      "Digitplus delivers resilient IT infrastructure, hardware supply and managed services across Port Harcourt and the South-South — built for energy-corridor sites.",
  },
];

export function getLocation(slug: string): LocationContent | undefined {
  return locations.find((l) => l.slug === slug);
}
