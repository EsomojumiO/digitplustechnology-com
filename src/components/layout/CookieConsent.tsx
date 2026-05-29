"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dpt-cookie-consent";
type Choice = "accepted" | "declined";

/**
 * CookieConsent — privacy-first banner.
 *
 * Defaults to DECLINING non-essential cookies: nothing is loaded until the user
 * explicitly accepts. No third-party scripts are touched here — this only
 * records the choice in localStorage. Analytics agents should gate behind it.
 */
export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== "accepted" && stored !== "declined") setVisible(true);
    } catch {
      // localStorage unavailable (private mode) — show banner, fail safe.
      setVisible(true);
    }
  }, []);

  const choose = (choice: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore persistence failure; still dismiss for this session.
    }
    setVisible(false);
  };

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
          className="font-medium text-accent underline-offset-2 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => choose("declined")}
          className="sm:flex-1"
        >
          Decline
        </Button>
        <Button
          size="sm"
          onClick={() => choose("accepted")}
          className="sm:flex-1"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}

export default CookieConsent;
