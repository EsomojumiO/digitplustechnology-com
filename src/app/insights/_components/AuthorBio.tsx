import type { Author } from "@/data";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * AuthorBio, E-E-A-T author card shown at the foot of an article. Shows who
 * wrote/reviewed the piece and why they're credible. Server component.
 */
export function AuthorBio({ author }: { author: Author }) {
  return (
    <aside
      aria-label="About the author"
      className="mt-12 rounded-lg border border-hairline bg-surface-raised p-6 sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-full bg-brand text-[var(--cream)] font-display text-h4 font-bold"
        >
          {initials(author.name)}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-mono text-caption uppercase tracking-[0.14em] text-accent-green">
              Written &amp; reviewed by
            </p>
            <p className="text-h4 text-text">{author.name}</p>
            <p className="text-small text-muted">{author.role}</p>
          </div>
          <p className="text-body text-muted measure">{author.bio}</p>
          {author.credentials && author.credentials.length > 0 ? (
            <ul className="mt-1 flex flex-wrap gap-2">
              {author.credentials.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-hairline px-3 py-1 text-caption text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default AuthorBio;
