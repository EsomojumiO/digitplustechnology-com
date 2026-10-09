/**
 * index.ts — Integrations facade.
 *
 * The ONLY surface route handlers should import. It fans each submission out to
 * the relevant adapters, isolates failures (one failing provider never fails
 * the whole request), records the lead, and aggregates results.
 *
 *   contact      -> store + email.notify + crm.createLead
 *   newsletter   -> store + marketing.subscribe + email.notify
 *   report-lead  -> store + crm.createLead + email.notify (+ marketing.subscribe
 *                   ONLY if opted in) and returns the PDF url to reveal.
 */

import { siteConfig } from "@/lib/site";
import { crmProvider } from "./crm";
import { emailNotifier } from "./email";
import { marketingProvider } from "./marketing";
import { persist, record } from "./store";
import type {
  AdapterResult,
  ContactPayload,
  LeadPayload,
  NewsletterPayload,
  ReportLeadPayload,
} from "./types";

export type { AdapterResult } from "./types";
export type {
  ContactPayload,
  NewsletterPayload,
  ReportLeadPayload,
  LeadPayload,
  LeadMeta,
} from "./types";

/** Per-provider outcome map for an operation (for logging/debugging). */
export interface HandleResult {
  /** Overall success — true if the request should be treated as accepted. */
  ok: boolean;
  /** Internal lead id from the store. */
  leadId: string;
  /** Individual adapter results keyed by provider name. */
  providers: Record<string, AdapterResult>;
  /** Extra payload returned to the client (e.g. pdfUrl). */
  data?: Record<string, unknown>;
}

/**
 * Run an adapter call, never letting it throw. A thrown/rejected adapter is
 * downgraded to a captured error so other providers still run.
 */
async function safe(
  name: string,
  fn: () => Promise<AdapterResult>,
): Promise<[string, AdapterResult]> {
  try {
    const result = await fn();
    return [name, result];
  } catch (err) {
     
    console.error(`[integrations] provider "${name}" threw:`, err);
    return [
      name,
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
    ];
  }
}

function aggregate(
  entries: Array<[string, AdapterResult]>,
): Record<string, AdapterResult> {
  return Object.fromEntries(entries);
}

/* ------------------------------------------------------------------------- */

async function handleContact(payload: ContactPayload): Promise<HandleResult> {
  const lead: LeadPayload = { kind: "contact", ...payload };
  const { id: leadId } = record(lead);

  const entries = await Promise.all([
    safe("store", () => persist(lead, leadId)),
    safe("email", () =>
      emailNotifier.notify({
        to: siteConfig.email,
        replyTo: payload.email,
        subject: `New contact enquiry — ${payload.company}`,
        text:
          `New contact form submission\n\n` +
          `Name:     ${payload.fullName}\n` +
          `Email:    ${payload.email}\n` +
          `Phone:    ${payload.phone ?? "—"}\n` +
          `Company:  ${payload.company}\n` +
          `Interest: ${payload.serviceInterest}\n\n` +
          `Message:\n${payload.message}\n\n` +
          `— submitted ${payload.meta.submittedAt} from ${payload.meta.page ?? "site"}`,
      }),
    ),
    safe("crm", () => crmProvider.createLead(payload)),
  ]);

  const providers = aggregate(entries);
  return { ok: true, leadId, providers };
}

async function handleNewsletter(
  payload: NewsletterPayload,
): Promise<HandleResult> {
  const lead: LeadPayload = { kind: "newsletter", ...payload };
  const { id: leadId } = record(lead);

  const entries = await Promise.all([
    safe("store", () => persist(lead, leadId)),
    safe("marketing", () => marketingProvider.subscribe(payload)),
    safe("email", () =>
      emailNotifier.notify({
        to: siteConfig.email,
        replyTo: payload.email,
        subject: `New newsletter sign-up — ${payload.email}`,
        text:
          `New newsletter sign-up\n\n` +
          `Email: ${payload.email}\n\n` +
          `— submitted ${payload.meta.submittedAt} from ${payload.meta.page ?? "site"}`,
      }),
    ),
  ]);

  return { ok: true, leadId, providers: aggregate(entries) };
}

async function handleReportLead(
  payload: ReportLeadPayload,
): Promise<HandleResult> {
  const lead: LeadPayload = { kind: "report-lead", ...payload };
  const { id: leadId } = record(lead);

  // No marketing-list call unless the person ticked the opt-in below. This
  // used to add every downloader to the marketing platform, which would have
  // emailed people who never agreed to it (NDPA consent) the day a real
  // provider was connected.
  const calls: Array<Promise<[string, AdapterResult]>> = [
    safe("store", () => persist(lead, leadId)),
    safe("crm", () => crmProvider.createLead(payload)),
    safe("email", () =>
      emailNotifier.notify({
        to: siteConfig.email,
        replyTo: payload.workEmail,
        subject: `Report download — ${payload.company}`,
        text:
          `Someone downloaded a report\n\n` +
          `Report:   ${payload.reportSlug}\n` +
          `Name:     ${payload.fullName}\n` +
          `Email:    ${payload.workEmail}\n` +
          `Company:  ${payload.company}\n` +
          `Role:     ${payload.role ?? "—"}\n` +
          `Opted in to email: ${payload.subscribe ? "yes" : "no"}\n\n` +
          `— submitted ${payload.meta.submittedAt} from ${payload.meta.page ?? "site"}`,
      }),
    ),
  ];

  // Optional explicit newsletter opt-in.
  if (payload.subscribe) {
    calls.push(
      safe("newsletter", () =>
        marketingProvider.subscribe({
          email: payload.workEmail,
          meta: payload.meta,
        }),
      ),
    );
  }

  const providers = aggregate(await Promise.all(calls));

  return {
    ok: true,
    leadId,
    providers,
    data: { pdfUrl: `/reports/${payload.reportSlug}.pdf` },
  };
}

export const integrations = {
  handleContact,
  handleNewsletter,
  handleReportLead,
};
