/**
 * store.ts — Lead store.
 *
 * Two layers:
 *   1. An in-memory ring buffer (debug/inspection only — per-instance, wiped on
 *      cold start; NEVER a source of truth).
 *   2. Durable persistence via `persist()` — a call to the token-guarded
 *      `ingest_website_lead` function in Supabase when SUPABASE_URL,
 *      SUPABASE_PUBLISHABLE_KEY and LEADS_INGEST_TOKEN are present (no SDK
 *      dependency). Falls back to STUB mode (console log, { ok, skipped }) when
 *      env is absent, so the build and the forms work with NO keys set.
 *
 * The facade calls `record()` once (synchronous id + buffer) then `persist()`
 * inside its isolated `safe()` wrapper, so a DB outage never fails the request.
 *
 * Live since 2026-10-09: rows land in `public.website_leads` in the dp-os
 * project. See supabase/migrations/0002_website_leads.sql.
 */

import type { AdapterResult, LeadPayload } from "./types";

/** Max retained in memory (debug/inspection only — NOT a source of truth). */
const MAX_RETAINED = 200;

const buffer: LeadPayload[] = [];

/**
 * Record a lead in the in-memory buffer + server log and return a generated id
 * so callers always have something to correlate logs with. NEVER throws —
 * recording must not fail a request.
 */
export function record(lead: LeadPayload): { id: string } {
  const id = `lead_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    buffer.push(lead);
    if (buffer.length > MAX_RETAINED) buffer.shift();

    // Structured-ish console record so it shows in server logs / Vercel logs.

    console.info(
      `[leads] recorded ${lead.kind} (${id})`,
      JSON.stringify(redact(lead)),
    );
  } catch {
    // Recording is best-effort; never block the request.
  }

  return { id };
}

function hasSupabase(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_PUBLISHABLE_KEY &&
      process.env.LEADS_INGEST_TOKEN,
  );
}

/**
 * Durably persist a lead into `public.website_leads` in the dp-os Supabase
 * project (supabase/migrations/0002_website_leads.sql). Returns { ok, skipped }
 * in stub mode (env absent), so local builds and previews work with no keys.
 *
 * It calls the `ingest_website_lead` function with the publishable key plus a
 * shared token, server-side only. The table itself has no API access at all,
 * so neither key nor token in isolation can read a single lead. The visitor's
 * IP is dropped here: the rate limiter needs it for a moment, the database
 * never does (NDPA data minimisation).
 */
export async function persist(
  lead: LeadPayload,
  id: string,
): Promise<AdapterResult> {
  if (!hasSupabase()) {
    return { ok: true, skipped: true };
  }

  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const contact = identify(lead);
  const payload = { ...lead, meta: { ...lead.meta, ip: undefined } };

  try {
    const res = await fetch(`${base}/rest/v1/rpc/ingest_website_lead`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_token: process.env.LEADS_INGEST_TOKEN,
        p_lead: {
          id,
          kind: lead.kind,
          email: contact.email,
          name: contact.name,
          company: contact.company,
          report_slug: lead.kind === "report-lead" ? lead.reportSlug : null,
          marketing_opt_in: optedIn(lead),
          source: lead.meta.source,
          page: lead.meta.page ?? null,
          environment: process.env.VERCEL_ENV ?? "development",
          payload,
          created_at: lead.meta.submittedAt,
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Supabase ${res.status}: ${detail.slice(0, 200)}`,
      };
    }
    return { ok: true, id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Supabase request failed",
    };
  }
}

/**
 * Whether this person agreed to marketing email. A newsletter sign-up is the
 * agreement. A report download counts only if the box was ticked (it is
 * unticked by default). A contact enquiry never does.
 */
function optedIn(lead: LeadPayload): boolean {
  if (lead.kind === "newsletter") return true;
  if (lead.kind === "report-lead") return lead.subscribe === true;
  return false;
}

/** Snapshot of retained leads (debug only). */
export function recent(): readonly LeadPayload[] {
  return buffer.slice();
}

/** Best-effort denormalised contact columns for querying/segmentation. */
function identify(lead: LeadPayload): {
  email: string;
  name: string | null;
  company: string | null;
} {
  switch (lead.kind) {
    case "contact":
      return {
        email: lead.email,
        name: lead.fullName,
        company: lead.company,
      };
    case "newsletter":
      return { email: lead.email, name: null, company: null };
    case "report-lead":
      return {
        email: lead.workEmail,
        name: lead.fullName,
        company: lead.company,
      };
  }
}

/** Light redaction for logs — keep emails readable but trim message bodies. */
function redact(lead: LeadPayload): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...lead };
  if ("message" in clone && typeof clone.message === "string") {
    clone.message =
      clone.message.length > 120
        ? `${clone.message.slice(0, 120)}…`
        : clone.message;
  }
  return clone;
}
