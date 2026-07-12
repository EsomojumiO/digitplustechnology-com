/**
 * Author registry, powers article bylines, author-bio cards, and author
 * structured data (E-E-A-T signals).
 *
 * NOTE on E-E-A-T: Google rewards content with clear, credible authorship.
 * We ship a truthful organisational author ("Digitplus Editorial Team") now.
 * For stronger E-E-A-T, add REAL named experts below (a practitioner's name,
 * role, short bio, and credentials) and set the matching `author:` value in the
 * article frontmatter. Do NOT invent people, see docs/BLOCKERS.md.
 */
export interface Author {
  /** URL-safe id (reserved for a future /insights/author/[slug] page). */
  slug: string;
  /** Display name used in the byline. */
  name: string;
  /** Short role/title under the name. */
  role: string;
  /** 1–3 sentence bio. Keep truthful. */
  bio: string;
  /** Optional credential chips that reinforce expertise. */
  credentials?: string[];
  /** schema.org author type. Use "person" only for real named individuals. */
  type: "organization" | "person";
  /** Optional headshot in /public (omit to render initials). */
  avatar?: string;
}

export const authors: Author[] = [
  {
    slug: "digitplus-editorial",
    name: "Digitplus Editorial Team",
    role: "IT advisory, procurement & infrastructure specialists",
    bio: "Articles from the Digitplus Editorial Team are written and reviewed by our procurement, infrastructure, and managed-services practitioners. Digitplus Technology Limited is a CAC-registered Nigerian IT solutions company operating since 2022, delivering to enterprises, government, banks, hospitals, and schools across Abuja, Lagos, and Port Harcourt.",
    credentials: [
      "Enterprise IT delivery since 2022",
      "Enterprise & public-sector clients",
      "Authorised partner channels",
      "Abuja • Lagos • Port Harcourt",
    ],
    type: "organization",
  },
  // EXAMPLE, add real named experts here for stronger E-E-A-T, then set the
  // article frontmatter `author:` to the exact `name` below. (Placeholder, do
  // not publish until it's a real person.)
  // {
  //   slug: "ada-okeke",
  //   name: "Ada Okeke",
  //   role: "Head of Infrastructure, Digitplus",
  //   bio: "Ada leads structured cabling, server-room, and network deployments across Digitplus's Abuja, Lagos, and Port Harcourt projects.",
  //   credentials: ["15+ years in network infrastructure", "Led 100+ multi-site rollouts"],
  //   type: "person",
  // },
];

const DEFAULT_AUTHOR_SLUG = "digitplus-editorial";

/**
 * Resolve an article's `author` string to a profile. Legacy values like
 * "Digitplus Technology" and any unknown author fall back to the editorial team.
 */
export function getAuthor(name?: string): Author {
  const fallback = authors.find((a) => a.slug === DEFAULT_AUTHOR_SLUG)!;
  if (!name) return fallback;
  return authors.find((a) => a.name === name) ?? fallback;
}
