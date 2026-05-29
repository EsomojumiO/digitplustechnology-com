/**
 * index.ts — Public barrel for the SEO library.
 *
 *   import { JsonLd, organizationSchema, breadcrumbSchema } from "@/lib/seo";
 */
export { JsonLd, default as JsonLdDefault } from "./jsonld";
export type { JsonLdProps } from "./jsonld";

export {
  absoluteUrl,
  organizationSchema,
  websiteSchema,
  serviceSchema,
  articleSchema,
  reportSchema,
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
} from "./schema";
export type { BreadcrumbItem, FaqItem } from "./schema";

export { buildMetadata } from "./metadata";
export type { BuildMetadataInput } from "./metadata";
