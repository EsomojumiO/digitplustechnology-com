"use client";

/**
 * consent.ts — the single source of truth for the cookie-consent choice.
 *
 * Both the banner (CookieConsent) that WRITES the choice and the analytics
 * loader that READS it subscribe to the same localStorage-backed store, so
 * accepting in the banner immediately mounts GA4 in the same tab (and the
 * "storage" event syncs other tabs). Non-essential tracking (GA4 sets cookies)
 * must never load until this reports "accepted" — NDPA §26 consent (brief §13).
 */

import * as React from "react";

export const CONSENT_STORAGE_KEY = "dpt-cookie-consent";
export const CONSENT_CHANGE_EVENT = "dpt-consent-change";

export type ConsentChoice = "accepted" | "declined";

/** Persisted choice; "unset" means undecided (banner shows, nothing loads). */
export function readConsentChoice(): string {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? "unset";
  } catch {
    // localStorage unavailable (private mode): treat as undecided, fail safe.
    return "unset";
  }
}

/** Record a choice and notify same-tab subscribers (storage only fires cross-tab). */
export function setConsentChoice(next: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
  } catch {
    // ignore persistence failure; still dismiss/apply for this session.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

/**
 * Subscribe to the choice via an external store, so consumers derive their
 * state instead of running setState in an effect. The server snapshot ("ssr")
 * keeps consent-gated UI and scripts out of the SSR markup, avoiding a
 * hydration flash; the client snapshot decides on first paint after hydration.
 */
export function useConsentChoice(): string {
  return React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
      };
    },
    readConsentChoice,
    () => "ssr",
  );
}
