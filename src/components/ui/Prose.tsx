import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

/**
 * Prose, typographic wrapper for long-form / MDX content. Establishes
 * heading and spacing rhythm and constrains to a ~65ch measure. Styles are
 * applied to child elements via descendant selectors (no Tailwind typography
 * plugin needed).
 */
export function Prose({
  as: Comp = "div",
  className,
  children,
  ...props
}: ProseProps) {
  return (
    <Comp
      className={cn(
        "measure text-body text-text",
        // vertical rhythm
        "[&>*+*]:mt-6",
        // Headings. These variants emitted NOTHING while text-h2 was a
        // components-layer class (Tailwind can't resolve one inside a variant),
        // so every prose heading site-wide rendered at body size. Now that the
        // scale is generated from @theme they resolve, and the size carries its
        // own line-height/tracking/weight.
        "[&_h2]:text-h2 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-text",
        "[&_h3]:text-h3 [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-text",
        "[&_h4]:text-h4 [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-text",
        // body copy
        "[&_p]:leading-relaxed [&_p]:text-text",
        "[&_strong]:font-semibold [&_strong]:text-text",
        // links
        "[&_a]:font-medium [&_a]:text-accent-green [&_a]:underline [&_a]:decoration-from-font [&_a]:underline-offset-2 hover:[&_a]:text-accent-green",
        // lists
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mt-2 [&_li]:marker:text-muted",
        // blockquote
        "[&_blockquote]:border-l-2 [&_blockquote]:border-accent-green [&_blockquote]:pl-5 [&_blockquote]:text-muted [&_blockquote]:italic",
        // code
        "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-small [&_code]:font-mono",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-hairline [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:text-small",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // tables. remark-gfm is enabled in lib/content/mdx.tsx, so markdown
        // tables become real <table> elements — but nothing styled them, so
        // they inherited browser defaults: zero cell padding and no rules.
        // Adjacent cells collided ("MediumSingle-user issue…2 hours") at every
        // width, on five published articles. The horizontal scroll container
        // comes from `proseMdxComponents` below; these rules do the reading.
        // Width is owned by `proseMdxComponents.table` below, not here — a
        // `[&_table]:w-*` variant would outrank the override's own class.
        "[&_table]:border-collapse [&_table]:text-small",
        "[&_thead]:border-b [&_thead]:border-hairline",
        "[&_th]:py-3 [&_th]:pr-6 [&_th]:text-left [&_th]:align-bottom [&_th]:font-semibold [&_th]:text-text",
        "[&_td]:py-3 [&_td]:pr-6 [&_td]:align-top [&_td]:text-muted",
        "[&_th:last-child]:pr-0 [&_td:last-child]:pr-0",
        "[&_tbody_tr]:border-b [&_tbody_tr]:border-hairline",
        "[&_tbody_tr:last-child]:border-0",
        // media & rules
        "[&_img]:rounded-lg [&_img]:border [&_img]:border-hairline",
        "[&_hr]:my-10 [&_hr]:border-hairline",
        // captions / small
        "[&_figcaption]:mt-2 [&_figcaption]:text-small [&_figcaption]:text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * MDX element overrides the design system owns, passed to `<MDXContent components={…}>`.
 * `lib/content/mdx.tsx` is deliberately style-agnostic ("this library never
 * hard-codes design decisions it doesn't own"), so the wrapper lives here.
 *
 * A four-column table inside a 65ch measure cannot fit a 390px screen. Without
 * a scroll container it crushes to three-line cells that run into the next row.
 * `w-max` lets the table take its natural width and the parent scrolls.
 */
export const proseMdxComponents = {
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    // `tabIndex` + a named role because a scrollable region has to be reachable
    // by keyboard: someone who cannot use a pointer still needs to scroll a wide
    // table sideways. Adding the scroll container without this traded one
    // barrier for another (axe `scrollable-region-focusable`, serious).
    <div
      tabIndex={0}
      role="region"
      aria-label="Table"
      className="-mx-5 my-8 overflow-x-auto px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green sm:mx-0 sm:px-0"
    >
      <table {...props} className="w-max min-w-full" />
    </div>
  ),
};

export default Prose;
