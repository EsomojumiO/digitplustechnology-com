/**
 * index.ts — Integrations facade.
 *
 * The ONLY surface route handlers should import. It fans each submission out to
 * the relevant adapters, isolates failures (one failing provider never fails
 * the whole request), records the lead, and aggregates results.
 *
 *   contact      -> store + email.notify + crm.createLead
 *   newsletter   -> store + marketing.subscribe
 *   report-lead  -> store + marketing.addLead + crm.createLead (+ subscribe if
 *                   opted in) and returns the PDF url for the client to reveal.
 */

import { siteConfig } from "@/lib/site";
import { crmProvider } from "./crm";
import { emailNotifier } from "./email";
import { marketingProvider } from "./marketing";
import { record } from "./store";
import type {
  AdapterResult,
  ContactPayload,
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
  const { id: leadId } = record({ kind: "contact", ...payload });

  const entries = await Promise.all([
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
  const { id: leadId } = record({ kind: "newsletter", ...payload });

  const entries = await Promise.all([
    safe("marketing", () => marketingProvider.subscribe(payload)),
  ]);

  return { ok: true, leadId, providers: aggregate(entries) };
}

async function handleReportLead(
  payload: ReportLeadPayload,
): Promise<HandleResult> {
  const { id: leadId } = record({ kind: "report-lead", ...payload });

  const calls: Array<Promise<[string, AdapterResult]>> = [
    safe("marketing", () => marketingProvider.addLead(payload)),
    safe("crm", () => crmProvider.createLead(payload)),
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
