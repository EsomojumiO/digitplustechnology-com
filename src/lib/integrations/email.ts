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

  // ---- TODO: REAL PROVIDER -------------------------------------------------
  // Implement ONE of the following. Keep the same return shape.
  //
  // (A) Resend (recommended — add `resend` to package.json):
  //   const { Resend } = await import("resend");
  //   const resend = new Resend(process.env.RESEND_API_KEY!);
  //   const { data, error } = await resend.emails.send({
  //     from: process.env.EMAIL_FROM ?? "Digitplus <leads@digitplustechnology.com>",
  //     to: input.to,
  //     replyTo: input.replyTo,
  //     subject: input.subject,
  //     text: input.text,
  //   });
  //   if (error) return { ok: false, error: error.message };
  //   return { ok: true, id: data?.id };
  //
  // (B) SMTP (add `nodemailer` to package.json):
  //   const nodemailer = await import("nodemailer");
  //   const transport = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: Number(process.env.SMTP_PORT),
  //     secure: Number(process.env.SMTP_PORT) === 465,
  //     auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  //   });
  //   const info = await transport.sendMail({
  //     from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
  //     to: input.to,
  //     replyTo: input.replyTo,
  //     subject: input.subject,
  //     text: input.text,
  //   });
  //   return { ok: true, id: info.messageId };
  // --------------------------------------------------------------------------

  // Until a provider above is implemented, treat configured-but-unimplemented
  // as a soft skip rather than a hard failure (keeps requests succeeding).
   
  console.warn(
    "[email] provider env present but no implementation wired — skipping send.",
  );
  return { ok: true, skipped: true };
}

export const emailNotifier: EmailNotifier = { notify };
