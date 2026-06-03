/**
 * controls.ts, shared styling for form controls so Input / Textarea / Select
 * match the token system: hairline border, soft surface, accent focus ring,
 * sm radius. Invalid state (aria-invalid) tints the border red.
 */

export const controlBase =
  "block w-full rounded-sm border border-hairline bg-surface-raised text-text " +
  "px-3.5 py-2.5 text-body placeholder:text-muted shadow-[var(--shadow-sm)] " +
  "transition-[border-color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "focus:outline-none focus-visible:border-accent " +
  "focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-0 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus-visible:ring-red-500/30";
