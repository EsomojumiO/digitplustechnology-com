"use client";

import * as React from "react";
import { Stagger, StaggerItem } from "@/components/motion";
import type { ArticleMeta } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";

/**
 * InsightsSearch — progressive-enhancement search island.
 *
 * PROGRESSIVE ENHANCEMENT CONTRACT:
 * The server (page.tsx) ALWAYS renders the full paginated grid of articles as
 * static HTML so crawlers and no-JS visitors see every article. This client
 * island is mounted alongside it: on mount it hides the server-rendered grid
 * (via the `controlsId` element) and takes over, rendering a filtered grid from
 * the same data passed as props. If JS never runs, the server grid simply
 * remains visible and fully functional (pagination links still work).
 *
 * Filtering is purely client-side over title + excerpt + tags + category; it is
 * intentionally lightweight (substring match, no fuzzy lib). When the query is
 * empty the island shows nothing extra and defers to the server grid for the
 * current page — so pagination behaviour is preserved until the user searches.
 */
export interface InsightsSearchProps {
  /** Full set of published articles (all pages) for client-side filtering. */
  articles: ArticleMeta[];
  /** id of the server-rendered grid + pagination block to hide once active. */
  controlsId: string;
}

export function InsightsSearch({ articles, controlsId }: InsightsSearchProps) {
  const [query, setQuery] = React.useState("");
  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length > 0;

  // Hide the server-rendered grid only while a search is active, so empty
  // input falls back to the crawlable, paginated server view.
  React.useEffect(() => {
    const el = document.getElementById(controlsId);
    if (el) el.hidden = searching;
  }, [searching, controlsId]);

  const results = React.useMemo(() => {
    if (!searching) return [];
    return articles.filter((a) => {
      const haystack = [
        a.title,
        a.excerpt,
        a.category.label,
        ...a.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [articles, trimmed, searching]);

  return (
    <div className="flex flex-col gap-8">
      <form
        role="search"
        className="relative max-w-md"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="insights-search" className="sr-only">
          Search insights
        </label>
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="insights-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search insights…"
          autoComplete="off"
          className="h-11 w-full rounded-md border border-hairline bg-surface-raised pl-10 pr-4 text-body text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-controls={controlsId}
        />
      </form>

      {searching ? (
        <div aria-live="polite">
          <p className="mb-8 text-small text-muted">
            {results.length === 0
              ? `No insights match “${query.trim()}”.`
              : `${results.length} ${
                  results.length === 1 ? "result" : "results"
                } for “${query.trim()}”.`}
          </p>
          {results.length > 0 ? (
            <Stagger
              key={trimmed}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {results.map((article) => (
                <StaggerItem key={article.slug} className="h-full">
                  <ArticleCard article={article} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default InsightsSearch;
