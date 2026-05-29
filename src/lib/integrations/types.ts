/**
 * types.ts — Provider-agnostic types + adapter interfaces for lead capture.
 *
 * The integrations layer is a thin facade over swappable provider adapters.
 * Routes/forms depend ONLY on these types, never on a concrete provider, so a
 * real Resend / Brevo / HubSpot implementation can be dropped in via env with
 * NO changes to callers. Every adapter returns the same shaped result.
 */

/** Uniform result for every adapter call. */
export interface AdapterResult {
  /** True when the operation succeeded OR was deliberately skipped (stub). */
  ok: boolean;
  /** Provider-side id (message id, contact id, deal id) when available. */
  id?: string;
  /** True when no real provider ran because env was absent (stub mode). */
  skipped?: boolean;
  /** Human-readable error when ok === false. */
  error?: string;
}

/* ---------------------------------------------------------------------------
   Payloads — the canonical lead shapes flowing through the system.
   These mirror the zod-validated route inputs (server is source of truth) but
   are the *internal* representation passed to adapters.
   --------------------------------------------------------------------------- */

/** Common metadata captured for every lead regardless of source. */
export interface LeadMeta {
  /** Submission source for routing/segmentation. */
  source: "contact" | "newsletter" | "report-gate";
  /** ISO timestamp set server-side. */
  submittedAt: string;
  /** Best-effort client IP (from x-forwarded-for); may be "unknown". */
  ip?: string;
  /** Originating page/path, if provided by the client. */
  page?: string;
}

/** Contact form submission. */
export interface ContactPayload {
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  /** Service slug or "other". */
  serviceInterest: string;
  message: string;
  meta: LeadMeta;
}

/** Newsletter signup. */
export interface NewsletterPayload {
  email: string;
  meta: LeadMeta;
}

/** Gated quarterly-report download lead. */
export interface ReportLeadPayload {
  fullName: string;
  workEmail: string;
  company: string;
  role?: string;
  reportSlug: string;
  /** Whether the lead opted in to the newsletter as well. */
  subscribe?: boolean;
  meta: LeadMeta;
}

/**
 * LeadPayload — the discriminated union of everything the lead store records.
 * Useful for the store and for future analytics/export.
 */
export type LeadPayload =
  | ({ kind: "contact" } & ContactPayload)
  | ({ kind: "newsletter" } & NewsletterPayload)
  | ({ kind: "report-lead" } & ReportLeadPayload);

/* ---------------------------------------------------------------------------
   Adapter interfaces — each provider category implements one of these.
   --------------------------------------------------------------------------- */

/** Sends internal notification emails (e.g. "new contact lead"). */
export interface EmailNotifier {
  /** Notify the internal team of a new submission. */
  notify(input: EmailNotification): Promise<AdapterResult>;
}

export interface EmailNotification {
  subject: string;
  /** Plain-text body. Adapters MAY also build an HTML version. */
  text: string;
  /** Recipient — defaults to siteConfig.email at the call site. */
  to: string;
  /** Reply-to (the lead's own email) so the team can respond directly. */
  replyTo?: string;
}

/** Pushes contacts to an email-marketing list (Brevo / Mailchimp / etc.). */
export interface MarketingListProvider {
  /** Subscribe an email to the general newsletter list. */
  subscribe(payload: NewsletterPayload): Promise<AdapterResult>;
  /** Add a richer lead (with attributes) to the marketing list. */
  addLead(payload: ReportLeadPayload): Promise<AdapterResult>;
}

/** Pushes leads into a CRM (client CRM / HubSpot / webhook). */
export interface CrmProvider {
  /** Create/Upsert a CRM lead from a contact or report submission. */
  createLead(
    payload: ContactPayload | ReportLeadPayload,
  ): Promise<AdapterResult>;
}
