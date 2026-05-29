/**
 * store.ts — Lead store STUB.
 *
 * Records every submission so nothing is silently lost while real persistence
 * is pending. This is intentionally an in-memory ring buffer + console log:
 *
 *   BLOCKER: real persistence needs a database (e.g. Postgres/Supabase) — an
 *   in-memory store is per-instance and wiped on every cold start/redeploy.
 *   Logged in docs/BLOCKERS.md.
 *
 * Swap `record()` for a DB insert (or queue publish) later without touching
 * callers — the facade depends only on this function.
 */

import type { LeadPayload } from "./types";

/** Max retained in memory (debug/inspection only — NOT a source of truth). */
const MAX_RETAINED = 200;

const buffer: LeadPayload[] = [];

/**
 * Record a lead. Returns a generated id so callers always have something to
 * correlate logs with. NEVER throws — recording must not fail a request.
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

/** Snapshot of retained leads (debug only). */
export function recent(): readonly LeadPayload[] {
  return buffer.slice();
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
