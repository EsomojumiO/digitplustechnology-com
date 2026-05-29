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

  // ---- TODO: REAL PROVIDER -------------------------------------------------
  // (A) Generic webhook (works with Zapier/Make/HubSpot workflows):
  //   const res = await fetch(process.env.CRM_WEBHOOK_URL!, {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //   if (!res.ok) return { ok: false, error: `crm webhook ${res.status}` };
  //   return { ok: true };
  //
  // (B) HubSpot Contacts API (CRM_API_KEY = private-app token):
  //   const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
  //     method: "POST",
  //     headers: {
  //       authorization: `Bearer ${process.env.CRM_API_KEY}`,
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({ properties: mapToHubspot(payload) }),
  //   });
  //   if (!res.ok) return { ok: false, error: `hubspot ${res.status}` };
  //   const data = await res.json().catch(() => ({}));
  //   return { ok: true, id: String(data?.id ?? "") };
  // --------------------------------------------------------------------------

  if (hasWebhook()) {
    // The webhook path is safe to actually run when configured (no SDK needed).
    try {
      const res = await fetch(process.env.CRM_WEBHOOK_URL!, {
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

   
  console.warn(
    "[crm] CRM_API_KEY present but no SDK implementation wired — skipping.",
  );
  return { ok: true, skipped: true };
}

export const crmProvider: CrmProvider = { createLead };
