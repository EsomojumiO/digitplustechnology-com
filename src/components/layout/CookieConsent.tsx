"use client";

import * as React from "react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dpt-cookie-consent";
const CHANGE_EVENT = "dpt-consent-change";
type Choice = "accepted" | "declined";

/** Read the persisted consent choice; "unset" means undecided (show banner). */
function readChoice(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "unset";
  } catch {
    // localStorage unavailable (private mode), treat as undecided, fail safe.
    return "unset";
  }
}

/**
 * Subscribe to the consent choice via an external store (localStorage), so the
 * banner's visibility is derived state, no setState inside an effect body.
 * The server snapshot ("ssr") keeps the banner out of the SSR markup, avoiding a
 * hydration flash; the client snapshot decides on first paint after hydration.
 */
function useConsentChoice(): string {
  return React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener(CHANGE_EVENT, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
      };
    },
    readChoice,
    () => "ssr",
  );
}

/**
 * CookieConsent, privacy-first banner.
 *
 * Defaults to DECLINING non-essential cookies: nothing is loaded until the user
 * explicitly accepts. No third-party scripts are touched here, this only
 * records the choice in localStorage. Analytics agents should gate behind it.
 */
export function CookieConsent() {
  const choice = useConsentChoice();
  const visible = choice === "unset";

  const choose = (next: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore persistence failure; still dismiss for this session.
    }
    // Notify same-tab subscribers (the "storage" event only fires cross-tab).
    window.dispatchEvent(new Event(CHANGE_EVENT));
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
