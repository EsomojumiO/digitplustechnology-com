/**
 * marketing.ts — Email-marketing list adapter (Brevo / Mailchimp / similar).
 *
 * STUB MODE (default): when MARKETING_API_KEY / MARKETING_LIST_ID are absent,
 * console.logs the contact and returns { ok: true, skipped: true }.
 *
 * Go live by setting MARKETING_API_KEY + MARKETING_LIST_ID and implementing the
 * TODO block — no caller changes required.
 */

import type {
  AdapterResult,
  MarketingListProvider,
  NewsletterPayload,
  ReportLeadPayload,
} from "./types";

function isConfigured(): boolean {
  return Boolean(
    process.env.MARKETING_API_KEY && process.env.MARKETING_LIST_ID,
  );
}

async function upsert(
  email: string,
  attributes: Record<string, unknown>,
  context: string,
): Promise<AdapterResult> {
  // ---- STUB MODE -----------------------------------------------------------
  if (!isConfigured()) {
    // eslint-disable-next-line no-console
    console.info(
      `[marketing:stub] ${context} (no MARKETING_* env — not subscribed):`,
      JSON.stringify({ email, attributes }),
    );
    return { ok: true, skipped: true };
  }

  // ---- TODO: REAL PROVIDER -------------------------------------------------
  // Example — Brevo (Sendinblue) contacts upsert via REST:
  //   const res = await fetch("https://api.brevo.com/v3/contacts", {
  //     method: "POST",
  //     headers: {
  //       "api-key": process.env.MARKETING_API_KEY!,
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email,
  //       attributes,
  //       listIds: [Number(process.env.MARKETING_LIST_ID)],
  //       updateEnabled: true,
  //     }),
  //   });
  //   if (!res.ok) return { ok: false, error: `marketing ${res.status}` };
  //   const data = await res.json().catch(() => ({}));
  //   return { ok: true, id: String(data?.id ?? email) };
  //
  // (Mailchimp uses PUT /lists/{list_id}/members/{subscriber_hash}.)
  // --------------------------------------------------------------------------

  // eslint-disable-next-line no-console
  console.warn(
    "[marketing] provider env present but no implementation wired — skipping.",
  );
  return { ok: true, skipped: true };
}

async function subscribe(payload: NewsletterPayload): Promise<AdapterResult> {
  return upsert(
    payload.email,
    { SOURCE: payload.meta.source, SIGNUP_PAGE: payload.meta.page ?? "" },
    "newsletter subscribe",
  );
}

async function addLead(payload: ReportLeadPayload): Promise<AdapterResult> {
  return upsert(
    payload.workEmail,
    {
      FULLNAME: payload.fullName,
      COMPANY: payload.company,
      ROLE: payload.role ?? "",
      REPORT: payload.reportSlug,
      SOURCE: payload.meta.source,
    },
    "report lead addLead",
  );
}

export const marketingProvider: MarketingListProvider = { subscribe, addLead };
