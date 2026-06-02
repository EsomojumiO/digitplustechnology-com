/**
 * email.ts — Internal notification email adapter.
 *
 * STUB MODE (default): when neither RESEND_API_KEY nor a full SMTP config is
 * present, this console.logs the notification and returns
 * { ok: true, skipped: true } so the build runs with NO API keys.
 *
 * To go live, set RESEND_API_KEY (recommended) or SMTP_* and implement the
 * clearly-marked TODO block below — no caller changes required.
 */

import type { AdapterResult, EmailNotification, EmailNotifier } from "./types";

function hasResend(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function hasSmtp(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

async function notify(input: EmailNotification): Promise<AdapterResult> {
  // ---- STUB MODE -----------------------------------------------------------
  if (!hasResend() && !hasSmtp()) {
     
    console.info(
      "[email:stub] notification (no SMTP/RESEND env — not sent):",
      JSON.stringify({
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        text: input.text,
      }),
    );
    return { ok: true, skipped: true };
  }

  // ---- REAL PROVIDER: Resend via REST API (no SDK dependency) --------------
  if (hasResend()) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.EMAIL_FROM ??
            "Digitplus <leads@digitplustechnology.com>",
          to: [input.to],
          reply_to: input.replyTo,
          subject: input.subject,
          text: input.text,
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        return {
          ok: false,
          error: `Resend ${res.status}: ${detail.slice(0, 200)}`,
        };
      }
      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return { ok: true, id: data.id };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Resend request failed",
      };
    }
  }

  // SMTP path needs the `nodemailer` dependency — add it and implement here if
  // you prefer SMTP over Resend. Until then, soft-skip so requests still succeed.
  console.warn(
    "[email] SMTP_* present but SMTP needs the nodemailer dependency — skipping send.",
  );
  return { ok: true, skipped: true };
}

export const emailNotifier: EmailNotifier = { notify };
