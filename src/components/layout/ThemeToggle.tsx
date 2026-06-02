"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dpt-theme";
const CHANGE_EVENT = "dpt-theme-change";

/**
 * Subscribe to the current theme via an external store (the `.dark` class on
 * <html>), so the toggle's state is derived — no setState inside an effect body.
 * Server snapshot is "light" (the default), matching the no-FOUC init script.
 */
function useIsDark(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener(CHANGE_EVENT, onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener(CHANGE_EVENT, onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    () => document.documentElement.classList.contains("dark"),
    () => true, // dark is the default/showcase theme
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * ThemeToggle — switches between the light (default) and the on-brand dark theme.
 * Persists the choice to localStorage; the no-FOUC script in the root layout
 * applies it before paint on the next load.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const isDark = useIsDark();

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore persistence failure; still applies for this session.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-md text-muted",
        "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-surface hover:text-text",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {/* Avoid hydration mismatch: both icons render; CSS shows the right one by theme. */}
      <SunIcon className="hidden h-5 w-5 dark:block" />
      <MoonIcon className="block h-5 w-5 dark:hidden" />
    </button>
  );
}

export default ThemeToggle;
