/**
 * crm.ts — CRM adapter (client CRM / HubSpot / generic webhook).
 *
 * STUB MODE (default): when neither CRM_API_KEY nor CRM_WEBHOOK_URL is present,
 * console.logs the lead and returns { ok: true, skipped: true }.
 *
 * Go live by setting CRM_WEBHOOK_URL (simplest — POSTs JSON) or CRM_API_KEY
 * (HubSpot etc.) and implementing the TODO block — no caller changes required.
 */

import type {
  AdapterResult,
  ContactPayload,
  CrmProvider,
  ReportLeadPayload,
} from "./types";

function hasWebhook(): boolean {
  return Boolean(process.env.CRM_WEBHOOK_URL);
}

function hasApiKey(): boolean {
  return Boolean(process.env.CRM_API_KEY);
}

async function createLead(
  payload: ContactPayload | ReportLeadPayload,
): Promise<AdapterResult> {
  // ---- STUB MODE -----------------------------------------------------------
  if (!hasWebhook() && !hasApiKey()) {
     
    console.info(
      "[crm:stub] createLead (no CRM_* env — not pushed):",
      JSON.stringify(payload),
    );
    return { ok: true, skipped: true };
  }

  // ---- REAL PROVIDER (A): generic webhook (Zapier/Make/HubSpot workflows) ---
  if (hasWebhook()) {
    try {
      const res = await fetch(process.env.CRM_WEBHOOK_URL as string, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return { ok: false, error: `crm webhook ${res.status}` };
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "crm webhook failed",
      };
    }
  }

  // ---- REAL PROVIDER (B): HubSpot Contacts API (CRM_API_KEY = private token) -
  try {
    const res = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.CRM_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ properties: mapToHubspot(payload) }),
      },
    );
    // 409 = contact already exists; treat as success (don't error the user).
    if (res.ok || res.status === 409) {
      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return { ok: true, id: data.id };
    }
    const detail = await res.text().catch(() => "");
    return { ok: false, error: `hubspot ${res.status}: ${detail.slice(0, 200)}` };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "hubspot request failed",
    };
  }
}

/** Map a contact/report-lead payload to HubSpot contact properties. */
function mapToHubspot(
  payload: ContactPayload | ReportLeadPayload,
): Record<string, string> {
  const email = "email" in payload ? payload.email : payload.workEmail;
  const [firstname, ...rest] = payload.fullName.trim().split(/\s+/);
  const props: Record<string, string> = {
    email,
    firstname: firstname ?? "",
    lastname: rest.join(" "),
    company: payload.company,
    hs_lead_status: "NEW",
  };
  if ("phone" in payload && payload.phone) props.phone = payload.phone;
  if ("message" in payload && payload.message) props.message = payload.message;
  if ("serviceInterest" in payload)
    props.message = `Service interest: ${payload.serviceInterest}\n\n${props.message ?? ""}`.trim();
  if ("reportSlug" in payload)
    props.message = `Report download: ${payload.reportSlug}${payload.role ? ` · Role: ${payload.role}` : ""}`;
  return props;
}

export const crmProvider: CrmProvider = { createLead };
