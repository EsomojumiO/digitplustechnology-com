/**
 * analytics.ts, Privacy-respecting analytics hook (shared infra).
 *
 * `track(event, props?)` is a NO-OP unless `NEXT_PUBLIC_ANALYTICS` is set,
 * keeping the site tracker-free by default (cookie consent defaults to decline;
 * see brief §13/§14). Forms call e.g. track("contact_submit"); WhatsApp/store
 * referral clicks can import this later.
 *
 * When enabled, it dispatches to whatever lightweight provider is wired below
 * (Plausible / Fathom / GA4-conservative), implement the TODO once the client
 * confirms a platform. Safe on both server and client (guards `window`).
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

/** True only when analytics is explicitly enabled via public env. */
export function analyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ANALYTICS);
}

/**
 * Record an analytics event. No-ops silently when disabled, on the server, or
 * if the provider script hasn't loaded. NEVER throws.
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!analyticsEnabled()) return;
  if (typeof window === "undefined") return;

  try {
    // ---- TODO: wire the chosen provider -----------------------------------
    // Plausible:
    //   (window as any).plausible?.(event, props ? { props } : undefined);
    // Fathom:
    //   (window as any).fathom?.trackEvent?.(event);
    // GA4 (conservative):
    //   (window as any).gtag?.("event", event, props);
    // -----------------------------------------------------------------------

    const w = window as unknown as {
      plausible?: (e: string, o?: { props?: AnalyticsProps }) => void;
    };
    if (typeof w.plausible === "function") {
      w.plausible(event, props ? { props } : undefined);
    } else if (process.env.NODE_ENV !== "production") {
       
      console.debug("[analytics]", event, props ?? {});
    }
  } catch {
    /* analytics must never break UX */
  }
}
