/**
 * POST /api/report-lead — gated quarterly-report download lead.
 *
 * Flow: parse JSON -> honeypot (silent 200 + pdfUrl) -> rate-limit (429) ->
 * zod (400) -> integrations.handleReportLead (marketing + CRM + opt-in) ->
 * 200 with { pdfUrl } so the client can reveal/deliver the download.
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
import { reportLeadSchema } from "@/lib/integrations/schemas";

export const runtime = "nodejs";

const ENDPOINT = "report-lead";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (body === null) {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  // Honeypot: return a benign success WITHOUT a usable pdf url (we have no
  // validated slug from a bot) so we neither process nor tip them off.
  if (honeypotTripped(body)) {
    return json({ ok: true, message: "Thank you. Your download is ready." }, 200);
  }

  const limited = enforceRateLimit(req, ENDPOINT);
  if (limited) return limited;

  const result = validate(reportLeadSchema, body);
  if ("response" in result) return result.response;
  const input = result.data;

  try {
    const handled = await integrations.handleReportLead({
      fullName: input.fullName,
      workEmail: input.workEmail,
      company: input.company,
      role: input.role || undefined,
      reportSlug: input.reportSlug,
      subscribe: input.subscribe ?? false,
      meta: {
        source: "report-gate",
        submittedAt: new Date().toISOString(),
        ip: clientIp(req.headers),
        page: input.page,
      },
    });

    return json(
      {
        ok: true,
        message: "Thank you. Your download is ready.",
        data: handled.data, // { pdfUrl: "/reports/<slug>.pdf" }
      },
      200,
    );
  } catch (err) {
     
    console.error("[api/report-lead] unexpected error:", err);
    return json(
      { ok: false, message: "Something went wrong. Please try again." },
      500,
    );
  }
}
