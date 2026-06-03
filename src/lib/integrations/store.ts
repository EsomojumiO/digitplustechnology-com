/**
 * store.ts — Lead store.
 *
 * Two layers:
 *   1. An in-memory ring buffer (debug/inspection only — per-instance, wiped on
 *      cold start; NEVER a source of truth).
 *   2. Durable persistence via `persist()` — a Supabase REST insert when
 *      SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are present (no SDK dependency,
 *      mirrors the Resend/Brevo REST adapters). Falls back to STUB mode
 *      (console log, { ok, skipped }) when env is absent, so the build and the
 *      forms work with NO keys set.
 *
 * The facade calls `record()` once (synchronous id + buffer) then `persist()`
 * inside its isolated `safe()` wrapper, so a DB outage never fails the request.
 *
 * To go live: set the two env vars and run the SQL in
 * `supabase/migrations/0001_leads.sql` (or paste it into the Supabase SQL editor).
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
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Durably persist a lead. Returns { ok, skipped } in stub mode (no Supabase
 * env), otherwise inserts a row into the `leads` table via the Supabase REST
 * API. Designed to be called inside the facade's `safe()` wrapper.
 */
export async function persist(
  lead: LeadPayload,
  id: string,
): Promise<AdapterResult> {
  // ---- STUB MODE -----------------------------------------------------------
  if (!hasSupabase()) {
    return { ok: true, skipped: true };
  }

  // ---- REAL PROVIDER: Supabase via REST (no SDK dependency) ----------------
  const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const contact = identify(lead);

  try {
    const res = await fetch(`${base}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id,
        kind: lead.kind,
        email: contact.email,
        name: contact.name,
        company: contact.company,
        source: lead.meta.source,
        page: lead.meta.page ?? null,
        ip: lead.meta.ip ?? null,
        payload: lead,
        created_at: lead.meta.submittedAt,
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
