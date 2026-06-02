/**
 * schema.ts — Typed schema.org builders.
 *
 * Each function returns a plain JSON-serializable object (or array) ready to be
 * passed to <JsonLd data={...} />. All values derive from siteConfig / content
 * so the NAP (Name, Address, Phone) stays identical everywhere.
 *
 * Stable, well-known @id anchors are used so nodes can reference each other:
 *   #organization   — the Organization node
 *   #website        — the WebSite node
 * These resolve relative to siteConfig.url.
 */
import { siteConfig } from "@/lib/site";
import { getAuthor } from "@/data";
import type { ServiceContent } from "@/data/types";
import type { ArticleMeta, ReportMeta } from "@/lib/content";
import type { LocationContent } from "@/data/locations";

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

/** Make a path absolute against the canonical site origin. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;
const LOGO_URL = `${siteConfig.url}/logo-full.png`;

/** A lightweight reference to the Organization node (avoids re-embedding it). */
function orgRef() {
  return { "@id": ORG_ID };
}

/* ---------------------------------------------------------------------------
   Organization (sitewide)
   --------------------------------------------------------------------------- */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    image: LOGO_URL,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: "customer service",
        areaServed: "NG",
        availableLanguage: ["en"],
      },
    ],
    sameAs: [siteConfig.storeUrl] as string[],
  };
}

/* ---------------------------------------------------------------------------
   WebSite (sitewide) — with a SearchAction pointing at the Insights hub.
   --------------------------------------------------------------------------- */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: orgRef(),
    inLanguage: "en-NG",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/insights?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ---------------------------------------------------------------------------
   Service
   --------------------------------------------------------------------------- */
export function serviceSchema(service: ServiceContent) {
  const url = `${siteConfig.url}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    audience: {
      "@type": "BusinessAudience",
      name: "Enterprises, government, and institutions",
    },
  };
}

/* ---------------------------------------------------------------------------
   Article / BlogPosting
   --------------------------------------------------------------------------- */
export function articleSchema(article: ArticleMeta, url: string) {
  const image = article.seo.ogImage ?? article.cover;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.seo.metaDescription ?? article.excerpt,
    image: image ? [absoluteUrl(image)] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    articleSection: article.category.label,
    keywords: article.tags.length ? article.tags.join(", ") : undefined,
    inLanguage: "en-NG",
    author: (() => {
      const a = getAuthor(article.author);
      return a.type === "person"
        ? {
            "@type": "Person",
            name: a.name,
            jobTitle: a.role,
            worksFor: { "@id": ORG_ID },
            url: siteConfig.url,
          }
        : { "@type": "Organization", "@id": ORG_ID, name: siteConfig.name };
    })(),
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/* ---------------------------------------------------------------------------
   Report — modeled as an Article (data-rich, citable, ungated preview).
   --------------------------------------------------------------------------- */
export function reportSchema(report: ReportMeta, url: string) {
  const image = report.seo.ogImage ?? report.cover;
  const period = [report.quarter, report.year].filter(Boolean).join(" ");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#report`,
    headline: report.title,
    description: report.seo.metaDescription ?? report.summary,
    image: image ? [absoluteUrl(image)] : undefined,
    datePublished: report.publishedAt,
    dateModified: report.publishedAt,
    articleSection: period || "Quarterly report",
    inLanguage: "en-NG",
    author: orgRef(),
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/* ---------------------------------------------------------------------------
   BreadcrumbList
   --------------------------------------------------------------------------- */
export interface BreadcrumbItem {
  name: string;
  /** Root-relative path or absolute URL. Omit for the current (last) page. */
  url?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

/* ---------------------------------------------------------------------------
   FAQPage
   --------------------------------------------------------------------------- */
export interface FaqItem {
  q: string;
  a: string;
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/* ---------------------------------------------------------------------------
   LocalBusiness (per location)
   --------------------------------------------------------------------------- */

/** Approximate geo coordinates per coverage city (for LocalBusiness). */
const LOCATION_GEO: Record<
  LocationContent["slug"],
  { lat: number; lng: number; region: string }
> = {
  abuja: { lat: 9.0765, lng: 7.3986, region: "FCT" },
  lagos: { lat: 6.5244, lng: 3.3792, region: "Lagos" },
  "port-harcourt": { lat: 4.8156, lng: 7.0498, region: "Rivers" },
};

export function localBusinessSchema(location: LocationContent) {
  const url = `${siteConfig.url}/locations/${location.slug}`;
  const geo = LOCATION_GEO[location.slug];
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    name: `${siteConfig.name} — ${location.city}`,
    description: location.metaDescription,
    url,
    image: LOGO_URL,
    logo: LOGO_URL,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: "$$",
    parentOrganization: orgRef(),
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: geo?.region,
      addressCountry: "NG",
    },
    ...(geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.lat,
            longitude: geo.lng,
          },
        }
      : {}),
    areaServed: [
      { "@type": "City", name: location.city },
      { "@type": "Country", name: "Nigeria" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
  };
}
