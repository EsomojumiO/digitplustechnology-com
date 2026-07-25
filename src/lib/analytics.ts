/**
 * analytics.ts, Privacy-respecting analytics hook (shared infra).
 *
 * `track(event, props?)` is a NO-OP unless `NEXT_PUBLIC_GA_ID` is set AND the
 * GA4 script has actually loaded (`window.gtag` exists). The GA4 script only
 * loads after the visitor accepts non-essential cookies (see Analytics.tsx),
 * so events are inherently consent-gated: no consent, no `gtag`, no event.
 * Forms call e.g. track("contact_submit"); WhatsApp/store referral clicks too.
 *
 * Safe on both server and client (guards `window`); NEVER throws.
 */

export type AnalyticsEvent =
  | "contact_submit"
  | "newsletter_signup"
  | "report_download"
  | "report_lead_submit"
  | "whatsapp_click"
  | "store_referral_click"
  | (string & {});

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

/** True only when GA4 is configured via public env (a measurement id is set). */
export function analyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GA_ID);
}

/**
 * Record an analytics event via GA4. No-ops silently when GA is unconfigured,
 * on the server, or before the consent-gated gtag.js has loaded. NEVER throws.
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!analyticsEnabled()) return;
  if (typeof window === "undefined") return;

  try {
    const w = window as unknown as {
      gtag?: (command: "event", name: string, params?: AnalyticsProps) => void;
    };
    // `gtag` exists only after the visitor consented and gtag.js loaded, so
    // this is the consent gate for events, not just a load-order guard.
    if (typeof w.gtag === "function") {
      w.gtag("event", event, props);
    } else if (process.env.NODE_ENV !== "production") {

      console.debug("[analytics]", event, props ?? {});
    }
  } catch {
    /* analytics must never break UX */
  }
}
