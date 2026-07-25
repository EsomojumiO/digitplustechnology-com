"use client";

import { Link } from "next-view-transitions";
import { Button } from "@/components/ui";
import { setConsentChoice, useConsentChoice } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * CookieConsent, privacy-first banner.
 *
 * Defaults to DECLINING non-essential cookies: nothing is loaded until the user
 * explicitly accepts. This only records the choice via the shared consent store
 * (src/lib/consent.ts); the analytics loader reads that same store and mounts
 * GA4 only once the choice is "accepted".
 */
export function CookieConsent() {
  const choice = useConsentChoice();
  const visible = choice === "unset";

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className={cn(
        "fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-md",
        "rounded-xl border border-hairline bg-surface-raised p-5 shadow-[var(--shadow-lg)]",
      )}
    >
      <h2 id="cookie-consent-title" className="text-small font-semibold text-text">
        Your privacy
      </h2>
      <p id="cookie-consent-desc" className="mt-1.5 text-small text-muted">
        We use only essential cookies by default. With your consent, we may use
        optional analytics to improve the site. See our{" "}
        <Link
          href="/privacy"
          className="font-medium text-accent-green underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setConsentChoice("declined")}
          className="sm:flex-1"
        >
          Decline
        </Button>
        <Button
          size="sm"
          onClick={() => setConsentChoice("accepted")}
          className="sm:flex-1"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}

export default CookieConsent;
