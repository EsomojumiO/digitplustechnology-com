/**
 * controls.ts, shared styling for form controls so Input / Textarea / Select
 * match the token system: hairline border, soft surface, sm radius. Invalid
 * state (aria-invalid) tints the border with the danger token.
 *
 * Focus is the global green `:focus-visible` outline from globals.css §4 — the
 * same indicator buttons and links use.
 *
 * `focus:outline-none` used to lead this string. Because `:focus-visible` is a
 * subset of `:focus`, it killed that outline on every input and textarea on the
 * site, leaving a 2px ring at 30% alpha (~1.35:1 composited on white) as the
 * only cue. Form fields were the one control family with no real focus
 * indicator. Do not reintroduce it.
 */

// `min-w-0` is load-bearing, not tidying. An <input> has an intrinsic width of
// about 20 characters, and `min-width: auto` on a grid or flex item resolves to
// its content's min-content — so at a 200% user text size the inputs' intrinsic
// width came out at 576px, the contact column could not shrink below it, and
// the document scrolled sideways inside a 390px viewport. `w-full` does not
// help: it sets width, not the minimum.
export const controlBase =
  "block w-full min-w-0 rounded-sm border border-hairline bg-surface-raised text-text " +
  "px-3.5 py-2.5 text-body placeholder:text-muted shadow-[var(--shadow-sm)] " +
  "transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "focus-visible:border-accent " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "aria-[invalid=true]:border-danger-border";
