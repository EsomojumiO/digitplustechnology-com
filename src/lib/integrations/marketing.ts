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
     
    console.info(
      `[marketing:stub] ${context} (no MARKETING_* env — not subscribed):`,
      JSON.stringify({ email, attributes }),
    );
    return { ok: true, skipped: true };
  }

  // ---- REAL PROVIDER: Brevo (Sendinblue) contacts upsert via REST ----------
  // Default to Brevo. (Mailchimp differs — see note at the end of this block.)
  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": process.env.MARKETING_API_KEY as string,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds: [Number(process.env.MARKETING_LIST_ID)],
        updateEnabled: true,
      }),
    });
    // Brevo returns 201 (created) or 204 (updated, when updateEnabled). Treat
    // "already in list" (400 duplicate) as success so newsletter re-signups
    // never surface an error to the user.
    if (res.ok || res.status === 204) {
      const data = (await res.json().catch(() => ({}))) as { id?: number };
      return { ok: true, id: String(data.id ?? email) };
    }
    const detail = await res.text().catch(() => "");
    if (res.status === 400 && /duplicate|already/i.test(detail)) {
      return { ok: true, id: email };
    }
    return { ok: false, error: `marketing ${res.status}: ${detail.slice(0, 200)}` };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "marketing request failed",
    };
  }
  // For Mailchimp instead: PUT /3.0/lists/{list_id}/members/{md5(lowercase email)}
  // with { email_address, status: "subscribed", merge_fields } and Basic auth.
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
