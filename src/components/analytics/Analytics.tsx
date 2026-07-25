"use client";

import Script from "next/script";
import { useConsentChoice } from "@/lib/consent";

/**
 * Analytics — loads Google Analytics 4 (gtag.js) ONLY when BOTH:
 *   1. `NEXT_PUBLIC_GA_ID` is set (a `G-XXXXXXXXXX` measurement id), and
 *   2. the visitor has actively accepted non-essential cookies in the banner.
 *
 * GA4 sets cookies and is a non-essential tracker, so under the NDPA it must
 * not load before consent (brief §13/§14). This component reads the shared
 * consent store (src/lib/consent.ts): it renders nothing on the server and
 * nothing until the choice is "accepted", so there is no tracking — and no
 * network request to Google — for undecided or declining visitors. Accepting
 * in the banner re-renders this and mounts the scripts in the same tab.
 *
 * `track()` in src/lib/analytics.ts dispatches events to `window.gtag`, which
 * only exists once these scripts have run — so it is inherently consent-gated too.
 */
export function Analytics() {
  const choice = useConsentChoice();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId || choice !== "accepted") return null;

  return (
    <>
      <Script
        id="ga-gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="ga-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}

export default Analytics;
