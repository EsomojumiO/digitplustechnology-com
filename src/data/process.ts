/**
 * data/process.ts — The six-step Digitplus delivery process (the Approach).
 */
import type { ProcessStepContent } from "./types";

export const processSteps: ProcessStepContent[] = [
  {
    step: 1,
    title: "Discovery & Needs Assessment",
    description:
      "We start by understanding your operations, constraints, sites, and budget — the actual requirement, not a product list. Nothing is specified until we know what success looks like for you.",
  },
  {
    step: 2,
    title: "Solution Design & Proposal",
    description:
      "We design a right-sized solution and present a clear, line-itemised proposal: scope, specifications, timelines, and costs, with the trade-offs explained so you can decide with confidence.",
  },
  {
    step: 3,
    title: "Procurement & Logistics",
    description:
      "On approval, we source through authorised channels, fulfil LPOs, and coordinate logistics — keeping a complete, traceable record from order to delivery across every location.",
  },
  {
    step: 4,
    title: "Deployment & Installation",
    description:
      "We install and configure to agreed standards, planning the work around your operating hours so disruption stays minimal and the build is tidy and supportable.",
  },
  {
    step: 5,
    title: "Testing & Handover",
    description:
      "We test against acceptance criteria agreed in advance, train your people, and hand over documentation. Sign-off happens when everything works — not when the boxes are unpacked.",
  },
  {
    step: 6,
    title: "Ongoing Support & Management",
    description:
      "After go-live we keep systems running with proactive monitoring, responsive support, and clear SLAs — so the investment keeps delivering well beyond handover.",
  },
];

export default processSteps;
