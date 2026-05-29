/**
 * metadata.ts — buildMetadata() helper.
 *
 * Produces a Next.js `Metadata` object with an absolute canonical, OpenGraph,
 * Twitter card, and robots directives, all derived from siteConfig. Pages may
 * use this to reduce duplication.
 *
 * Note: `metadataBase` is already set in the root layout, so OpenGraph/Twitter
 * image paths here may be root-relative — Next resolves them. The `canonical`
 * we set is the relative `path`; Next combines it with metadataBase to emit an
 * absolute <link rel="canonical">.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export interface BuildMetadataInput {
  /** Page <title> (without the template suffix; the layout appends the brand). */
  title: string;
  description: string;
  /** Root-relative path, e.g. "/services/it-procurement". Used for canonical + OG url. */
  path: string;
  /** Root-relative or absolute OG/Twitter image. Falls back to the default OG image. */
  image?: string;
  /** OpenGraph type. Defaults to "website". */
  type?: "website" | "article";
  /** Set true to noindex (e.g. thin/utility pages). */
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: "en_NG",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
