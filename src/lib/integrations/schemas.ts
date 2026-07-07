/**
 * schemas.ts — Zod request schemas (server is the source of truth).
 *
 * Each endpoint validates its raw JSON body against one of these. The shapes
 * intentionally include the honeypot field (`company_website`) so it's part of
 * the parsed payload; routes check it separately and strip it before building
 * the adapter payload. Form components mirror these rules client-side for UX.
 */

import { z } from "zod";
import { services } from "@/lib/site";

/** Honeypot — must stay empty. Bots that auto-fill all fields trip it. */
const honeypot = z.string().max(0).optional().or(z.literal(""));

/** Trimmed, length-bounded required string. */
const requiredText = (label: string, max = 200) =>
  z
    .string({ required_error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const email = z
  .string({ required_error: "Email is required." })
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email is too long.")
  .email("Enter a valid email address.");

/** Optional path of the page the form was submitted from (telemetry). */
const page = z.string().trim().max(512).optional();

/** Allowed service-interest values: service slugs + "other". */
const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];
export const serviceInterestValues = [...serviceSlugs, "other"] as const;

/* ------------------------------------------------------------------------- */

export const contactSchema = z.object({
  fullName: requiredText("Full name", 120),
  email,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: requiredText("Company", 160),
  // Optional: the contact form was trimmed to 5 fields; other entry points
  // (service pages) may still pass a service context. Kept in the schema so the
  // integration pipeline still records it when present.
  serviceInterest: z
    .enum(serviceInterestValues, {
      errorMap: () => ({ message: "Select a service interest." }),
    })
    .optional(),
  message: requiredText("Message", 4000),
  company_website: honeypot,
  page,
});

export const newsletterSchema = z.object({
  email,
  company_website: honeypot,
  page,
});

export const reportLeadSchema = z.object({
  fullName: requiredText("Full name", 120),
  workEmail: email,
  company: requiredText("Company", 160),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  reportSlug: z
    .string()
    .trim()
    .min(1, "Missing report.")
    .max(160)
    // lowercase slug guard — prevents path traversal in the returned pdf url
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid report reference."),
  subscribe: z.boolean().optional(),
  company_website: honeypot,
  page,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ReportLeadInput = z.infer<typeof reportLeadSchema>;
