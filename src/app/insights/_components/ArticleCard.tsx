import Image from "next/image";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import type { ArticleMeta } from "@/lib/content";
import { formatDate, isoDate } from "./format";

export interface ArticleCardProps {
  article: ArticleMeta;
  /** Use a larger image priority for above-the-fold cards. */
  priority?: boolean;
  /** Heading element for correct document outline (default h3). */
  headingAs?: "h2" | "h3";
}

/**
 * ArticleCard — reusable article preview card.
 *
 * The whole card is a link to the article; the cover image sits in a fixed
 * aspect-ratio frame with a neutral surface fallback, so the layout stays
 * stable even when a cover file is absent (next/image renders nothing visible
 * but the frame holds its space).
 */
export function ArticleCard({
  article,
  priority = false,
  headingAs: Heading = "h3",
}: ArticleCardProps) {
  const href = `/insights/${article.slug}`;
  return (
    <Card
      as="article"
      padding="none"
      interactive
      className="group flex flex-col overflow-hidden bg-surface-raised/70 backdrop-blur-sm transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lg)]"
    >
      <Link
        href={href}
        className="flex h-full flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {/* Cover — fixed 16:10 frame with neutral fallback for layout stability */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
          <Image
            src={article.cover}
            alt={article.coverAlt || article.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div>
            <Badge tone="accent">{article.category.label}</Badge>
          </div>

          <Heading className="text-h4 text-text transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
            {article.title}
          </Heading>

          <p className="text-body text-muted line-clamp-3">
            {article.excerpt}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-small text-muted">
            <time dateTime={isoDate(article.publishedAt)}>
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden="true" className="text-muted/50">
              &middot;
            </span>
            <span>{article.readingTime.text}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default ArticleCard;
