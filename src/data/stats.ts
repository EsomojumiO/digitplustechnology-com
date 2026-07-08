/**
 * data/stats.ts, "By the numbers" figures.
 */
import type { StatContent } from "./types";

// Only defensible, verifiable figures. "50+ clients" is a client-provided brand
// fact; "2022" is the real founding/operating year (never a computed "X+ years",
// which inflates); "6 service lines" and "Abuja HQ" are countable from the repo.
export const stats: StatContent[] = [
  { value: "2022", label: "Operating since" },
  { value: "50+", label: "Enterprise clients" },
  { value: "6", label: "Service lines" },
  { value: "3", label: "Cities served" },
];

export default stats;
