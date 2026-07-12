/**
 * data/stats.ts, "By the numbers" figures.
 */
import type { StatContent } from "./types";

// Every figure is verifiable from the repo or the founding record — no
// unverifiable brand claims. "2022" is the real operating-since year (never a
// computed "X+ years", which inflates); "8" industries, "6" service lines and
// "3" cities are all countable from src/data (industries.ts, services.ts,
// locations.ts). A real client-count stat can be added once the client supplies
// a verified figure — see PLACEHOLDERS.md.
export const stats: StatContent[] = [
  { value: "2022", label: "Operating since" },
  { value: "8", label: "Industries served" },
  { value: "6", label: "Service lines" },
  { value: "3", label: "Cities served" },
];

export default stats;
