/**
 * http.ts — Shared route-handler helpers for the form endpoints.
 *
 * Keeps every POST route consistent: JSON parsing, honeypot, zod validation,
 * rate limiting, and typed JSON responses with correct status codes.
 */

import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { clientIp, rateLimit } from "./rate-limit";

export interface ApiResponseBody {
  ok: boolean;
  message: string;
  /** Field-level errors for client display (validation failures only). */
  errors?: Record<string, string[]>;
  /** Extra success data (e.g. { pdfUrl }). */
  data?: Record<string, unknown>;
}

export function json(
  body: ApiResponseBody,
  status: number,
  extraHeaders?: Record<string, string>,
): NextResponse {
  return NextResponse.json(body, { status, headers: extraHeaders });
}

/** Parse JSON body; returns null on malformed JSON. */
export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/**
 * Returns true if the honeypot field is filled (i.e. likely a bot).
 * Field name: `company_website` (hidden in the form).
 */
export function honeypotTripped(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const value = (body as Record<string, unknown>).company_website;
  return typeof value === "string" && value.trim().length > 0;
}

/** Enforce the per-endpoint, per-IP rate limit. Returns a 429 response if hit. */
export async function enforceRateLimit(
  req: Request,
  endpoint: string,
): Promise<NextResponse | null> {
  const ip = clientIp(req.headers);
  const result = await rateLimit(ip, endpoint);
  if (!result.allowed) {
    return json(
      {
        ok: false,
        message: "Too many requests. Please wait a moment and try again.",
      },
      429,
      { "Retry-After": String(result.retryAfter) },
    );
  }
  return null;
}

/** Validate `body` against `schema`. Returns either data or a 400 response. */
export function validate<T>(
  schema: ZodSchema<T>,
  body: unknown,
): { data: T } | { response: NextResponse } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      response: json(
        {
          ok: false,
          message: "Please correct the highlighted fields.",
          errors: parsed.error.flatten().fieldErrors as Record<
            string,
            string[]
          >,
        },
        400,
      ),
    };
  }
  return { data: parsed.data };
}

/** Best-effort client IP for payload metadata. */
export { clientIp } from "./rate-limit";
