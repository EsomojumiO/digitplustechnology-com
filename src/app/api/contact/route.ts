/**
 * POST /api/contact, contact form submission.
 *
 * Flow: parse JSON -> honeypot (silent 200) -> rate-limit (429) -> zod (400)
 * -> integrations.handleContact (email notify + CRM) -> 200 / 500.
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
import { contactSchema } from "@/lib/integrations/schemas";

export const runtime = "nodejs";

const ENDPOINT = "contact";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  // Honeypot: respond 200 OK silently so bots don't learn they were caught.
  if (honeypotTripped(body)) {
    return json({ ok: true, message: "Thanks, we'll be in touch shortly." }, 200);
  }

  const limited = await enforceRateLimit(req, ENDPOINT);
  if (limited) return limited;

  const result = validate(contactSchema, body);
  if ("response" in result) return result.response;
  const input = result.data;

  try {
    await integrations.handleContact({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || undefined,
      company: input.company,
      serviceInterest: input.serviceInterest,
      message: input.message,
      meta: {
        source: "contact",
        submittedAt: new Date().toISOString(),
        ip: clientIp(req.headers),
        page: input.page,
      },
    });

    return json(
      {
        ok: true,
        message:
          "Thanks, your message has been received. Our team will respond shortly.",
      },
      200,
    );
  } catch (err) {
     
    console.error("[api/contact] unexpected error:", err);
    return json(
      { ok: false, message: "Something went wrong. Please try again." },
      500,
    );
  }
}
