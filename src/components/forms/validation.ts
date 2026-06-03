/**
 * validation.ts, tiny client-side mirrors of server rules (UX only).
 * The server (zod) is always the source of truth.
 */

/** Pragmatic email check matching zod's `.email()` closely enough for UX. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
