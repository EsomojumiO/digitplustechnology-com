/**
 * mdx.tsx — Server-component wrapper that renders a raw MDX source string.
 *
 * Uses `next-mdx-remote/rsc` so MDX is compiled + rendered inside a React
 * Server Component at request/build time — no extra webpack/MDX build config,
 * no client bundle cost for the content itself.
 *
 * Pages (insights-engine / reports-engine) pass the `body` string from
 * getArticleBySlug / getReportBySlug and OPTIONALLY a `components` map to map
 * MDX elements (h2, p, blockquote, a, …) onto the design system's styled
 * primitives (e.g. a Prose component). The map here is intentionally minimal /
 * overridable: defaults are unstyled passthrough so this library never
 * hard-codes design decisions it doesn't own.
 *
 * Server-only — relies on next-mdx-remote's RSC entrypoint.
 */

import "server-only";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/**
 * Element->component override map. Sourced from MDXRemote's own props so we
 * don't take a direct dependency on `mdx/types` (which may not always resolve).
 */
type MDXComponents = NonNullable<MDXRemoteProps["components"]>;

/**
 * Default remark/rehype plugins:
 *  - remark-gfm   : tables, strikethrough, task lists, autolinks (GFM).
 *  - rehype-slug  : add id="" to headings so anchors / a TOC can link to them.
 *
 * Consumers can extend by passing their own `options` (merged shallowly).
 */
const defaultMdxOptions: MDXRemoteProps["options"] = {
  parseFrontmatter: false, // frontmatter is already stripped by gray-matter
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};

export interface MDXContentProps {
  /** Raw MDX body string (frontmatter already removed by the loader). */
  source: string;
  /**
   * Optional element->component overrides. Merge into the default map.
   * e.g. { h2: Heading, a: Link, blockquote: PullQuote }
   */
  components?: MDXComponents;
}

/**
 * Render MDX. Default components are an empty passthrough (browser defaults),
 * so the wrapper is style-agnostic; the consuming page supplies the styled map.
 */
export async function MDXContent({ source, components }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      options={defaultMdxOptions}
      components={{ ...components }}
    />
  );
}

export default MDXContent;
