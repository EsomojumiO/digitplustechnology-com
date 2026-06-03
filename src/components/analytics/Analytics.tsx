import Script from "next/script";

/**
 * Analytics, loads Plausible (privacy-friendly, cookieless) ONLY when
 * `NEXT_PUBLIC_ANALYTICS` is set to the site's domain. Renders nothing
 * otherwise, keeping the site tracker-free by default.
 *
 * Plausible sets no cookies and collects no personal data, so it's exempt from
 * cookie consent (see brief §13/§14). To self-host or use a proxy, set
 * `NEXT_PUBLIC_ANALYTICS_SRC` to the script URL.
 *
 * `track()` in src/lib/analytics.ts dispatches custom events to `window.plausible`.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_ANALYTICS;
  if (!domain) return null;

  const src =
    process.env.NEXT_PUBLIC_ANALYTICS_SRC ??
    "https://plausible.io/js/script.tagged-events.js";

  return (
    <Script
      defer
      data-domain={domain}
      src={src}
      strategy="afterInteractive"
    />
  );
}

export default Analytics;
