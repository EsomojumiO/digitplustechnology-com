/**
 * data/index.ts — Barrel for the marketing copy layer.
 *
 *   import { servicesContent, industriesContent, processSteps } from "@/data";
 */
export * from "./types";
export {
  servicesContent,
  allServicesContent,
  getServiceContent,
} from "./services";
export {
  industriesContent,
  allIndustriesContent,
  getIndustryContent,
} from "./industries";
export { testimonials } from "./testimonials";
export { processSteps } from "./process";
export { stats } from "./stats";
export { whyUs } from "./whyUs";
export { authors, getAuthor, type Author } from "./authors";
