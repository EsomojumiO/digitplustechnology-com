/**
 * Route template — re-mounts on every navigation, giving each page a subtle
 * entrance (fade + small rise). Implemented in pure CSS (`.route-enter`) so it
 * NEVER hides content from crawlers or no-JS users (the element's resting state
 * is fully visible; the keyframe only plays on mount) and respects
 * `prefers-reduced-motion` via the global reduce rule. No layout shift.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
