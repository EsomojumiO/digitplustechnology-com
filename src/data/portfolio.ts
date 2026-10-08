/**
 * data/portfolio.ts, The projects shown on /portfolio.
 *
 * REAL WORK ONLY. Every fact below is taken from the project's own case-study
 * article in content/insights/ (tag "case study") and goes no further than it
 * does. Clients are never named. If a detail is not in the write-up, it does
 * not belong here: no invented durations, counts, outcomes or quotes.
 *
 * Adding a project is one entry. The page resolves each `writeUps` slug
 * through the content layer for its title and URL, and silently skips any
 * slug that is not published yet, so an entry can name a follow-on write-up
 * before it ships without producing a dead link.
 */
import type { IndustrySlug, ServiceSlug } from "./types";

export interface PortfolioFigure {
  /** The number with its unit, e.g. "5kVA". */
  value: string;
  label: string;
}

export interface PortfolioProject {
  /** Stable id, used as the element id and React key. */
  id: string;
  /** The project's heading on the page. Names the work, never the client. */
  title: string;
  /** Sector as the reader would say it ("Legal practice"), not a slug. */
  sector: string;
  /** The industry page this work belongs to. */
  industry: IndustrySlug;
  location: string;
  /** One or two sentences: what the job was. */
  summary: string;
  services: ServiceSlug[];
  /** Two to four headline figures for the spec panel. Units included. */
  figures: PortfolioFigure[];
  /** What we handed over. Short spec lines, not marketing. */
  delivered: string[];
  /** The condition the design had to survive. */
  constraint: string;
  /** The one decision that shaped the result, and why. */
  decision: { title: string; body: string };
  /** Article slugs in reading order. Unpublished slugs are skipped. */
  writeUps: string[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "private-hospital-abuja",
    title: "Workstations and printing for a private hospital",
    sector: "Healthcare",
    industry: "healthcare",
    location: "Abuja",
    summary:
      "Clinical and administrative desks across the hospital, equipped from one specification and handed over with a full asset register. The hospital comes back to us for repeat procurement, and we support the estate after go-live.",
    services: [
      "it-procurement",
      "hardware-supply",
      "deployment-implementation",
      "managed-services",
    ],
    figures: [
      { value: "7", label: "Desktop workstations" },
      { value: "7", label: "Monitors, one per workstation" },
      { value: "Canon", label: "Printers, with consumables on hand" },
    ],
    delivered: [
      "7 desktop workstations on SSD, at least 8GB RAM, on a board with a free slot to double it later",
      "7 IPS monitors at 1080p, 21.5 to 24 inches, with HDMI and VGA inputs",
      "Canon printers, installed and shared on the network rather than tethered to one desk",
      "A buffer stock of Canon consumables, delivered with the hardware",
      "Serial capture, asset tags and warranty registration in the hospital’s name",
      "An asset register listing model, serial, location, purchase date and warranty expiry for every item",
    ],
    constraint:
      "Downtime in a hospital is clinical. A dead records workstation means a patient waiting in a corridor while somebody hunts for a paper file.",
    decision: {
      title: "Spend on storage, not on processor",
      body: "Hospitals hear “clinical system” and expect workstation-class hardware. For a browser-based or lightweight HMIS that is money set on fire. Storage decides whether a receptionist finds the machine fast or slow, so every unit went out on an SSD, with RAM that can be doubled without a rebuild.",
    },
    writeUps: [
      "it-asset-procurement-hospitals-nigeria",
      "after-go-live-how-we-support-a-private-hospital-in-abuja",
    ],
  },
  {
    id: "law-practice-managed-devices",
    title: "Managed devices for a law practice",
    sector: "Legal practice",
    industry: "sme",
    location: "Abuja",
    summary:
      "A twelve-person firm moved off personal laptops, shared passwords and WhatsApp file transfers onto Microsoft Entra ID and Intune, with access tied to the person and the device.",
    services: [
      "technology-advisory",
      "deployment-implementation",
      "managed-services",
    ],
    figures: [
      { value: "12", label: "People, each on a named account" },
      { value: "1", label: "Licence: Microsoft 365 Business Premium" },
      { value: "Minutes", label: "To cut a leaver off mail, files and Teams" },
    ],
    delivered: [
      "Microsoft 365 Business Premium: Entra ID, Intune and Defender for Business under one licence",
      "Named accounts for everyone, MFA enforced by Conditional Access, legacy authentication blocked",
      "A break-glass admin account held offline, and self-service password reset",
      "SPF, DKIM and DMARC on the firm’s domain",
      "Firm-owned Windows devices in Intune, BitLocker keys escrowed to Entra ID",
      "OneDrive Known Folder Move, and matter files in SharePoint by client and matter",
      "App Protection Policies on personal phones, so firm data can be wiped without touching anything personal",
    ],
    constraint:
      "Confidentiality is a professional duty and, since 2023, a legal one under the Nigeria Data Protection Act. A stolen unencrypted laptop is not an answer either framework accepts.",
    decision: {
      title: "Access follows the device, not the password",
      body: "One Conditional Access rule carries the project. Firm data needs a managed, compliant device and a user who has passed MFA. A stolen laptop marked non-compliant loses access, and a correct password with no second factor gets nothing. It had a cost: personal laptops stopped working, so the hardware had to be budgeted before the rule went on.",
    },
    writeUps: ["microsoft-entra-intune-small-business-nigeria"],
  },
  {
    id: "rural-school-lab-ipele",
    title: "A 20-seat computer lab for a rural secondary school",
    sector: "Education",
    industry: "education",
    location: "Ipele, Ondo State",
    summary:
      "A complete lab for a school with no fixed-line internet and unreliable grid power: solar and battery, Starlink, twenty wired seats, and the maintenance plan that keeps the room teaching past year three.",
    services: [
      "infrastructure-solutions",
      "hardware-supply",
      "deployment-implementation",
      "managed-services",
    ],
    figures: [
      { value: "20", label: "Wired workstations" },
      { value: "5kVA", label: "Inverter on a 48V bus" },
      { value: "~10kWh", label: "Usable LiFePO4 storage" },
      { value: "~5kWp", label: "Solar array" },
    ],
    delivered: [
      "20 business-class small-form-factor desktops: quad-core, 8GB RAM, 256GB SSD, Windows 11 Pro, 22-inch monitors",
      "Solar, LiFePO4 storage and inverter on a dedicated, surge-protected, earthed circuit",
      "Starlink, roof-mounted and earthed, bridged into a gateway with DNS filtering and per-device rate limits",
      "A wired gigabit backbone to every seat, with Wi-Fi for staff devices",
      "One golden image cloned to all twenty machines, students on standard accounts",
      "Recovery training, an on-site spares kit, a written maintenance schedule and full documentation",
    ],
    constraint:
      "No fibre to pull, mobile broadband too weak for twenty sessions, and grid power that cannot be trusted for a forty-minute lesson.",
    decision: {
      title: "Power first, then connectivity, then machines",
      body: "Schools usually spend the whole budget on computers and find nothing to run them on. We sized power from measured load, about 2.25kW sustained, and took the inverter to 5kVA where 3.5kVA would have passed, so the school can add seats without replacing the system. Small-form-factor desktops draw less, which cut the solar and battery spend.",
    },
    writeUps: ["school-computer-lab-ipele-ondo-starlink"],
  },
];

export default portfolioProjects;
