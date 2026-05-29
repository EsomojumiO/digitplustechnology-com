/**
 * POST /api/newsletter — newsletter signup (footer + report pages).
 *
 * Flow: parse JSON -> honeypot (silent 200) -> rate-limit (429) -> zod (400)
 * -> integrations.handleNewsletter (marketing list) -> 200 / 500.
 */

import { integrations } from "@/lib/integrations";
import {
  clientIp,
  enforceRateLimit,
  honeypotTripped,
  json,
  readJson,
  validate,
} from "@/lib/integrations/http";
import { newsletterSchema } from "@/lib/integrations/schemas";

export const runtime = "nodejs";

const ENDPOINT = "newsletter";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  if (honeypotTripped(body)) {
    return json({ ok: true, message: "You're subscribed. Thank you." }, 200);
  }

  const limited = enforceRateLimit(req, ENDPOINT);
  if (limited) return limited;

  const result = validate(newsletterSchema, body);
  if ("response" in result) return result.response;
  const input = result.data;

  try {
    await integrations.handleNewsletter({
      email: input.email,
      meta: {
        source: "newsletter",
        submittedAt: new Date().toISOString(),
        ip: clientIp(req.headers),
        page: input.page,
      },
    });

    return json(
      { ok: true, message: "You're subscribed. Thank you." },
      200,
    );
  } catch (err) {
     
    console.error("[api/newsletter] unexpected error:", err);
    return json(
      { ok: false, message: "Something went wrong. Please try again." },
      500,
    );
  }
}
