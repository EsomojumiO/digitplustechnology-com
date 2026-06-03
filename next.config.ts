import type { NextConfig } from "next";

/**
 * next.config.ts
 *
 * SEO-owned additions: legacy redirects, security headers, and next/image
 * formats. Kept additive — extend `nextConfig` rather than replacing it.
 */

/* ---------------------------------------------------------------------------
   Security headers — applied to every route. Chosen to be safe with Next 16 +
   Vercel (no CSP that would block Next's inline runtime / hydration; if a
   strict CSP is added later it must allow Next's nonce/inline scripts and the
   JSON-LD <script> tags). HSTS is safe on Vercel (HTTPS-only).
   --------------------------------------------------------------------------- */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Serve next-gen formats first (brief §10 image optimization).
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    /*
     * Legacy single-page → multi-page consolidation.
     *
     * NOTE: hash fragments (e.g. "/#services") are NEVER sent to the server, so
     * they cannot be redirected here — they are handled client-side / via the
     * new nav. We therefore redirect the equivalent PATH forms that crawlers,
     * old backlinks, and pasted bookmarks may carry.
     *
     * DOMAIN-CONSOLIDATION TODO (see docs/BLOCKERS.md):
     *   - Canonical host is https://digitplustechnology.com (non-www). Enforce
     *     www → non-www (and any stray apex variants) at the DNS / Vercel domain
     *     level; Vercel "Redirect to" on the secondary domain is the cleanest
     *     place for the 308.
     *   - Stray domain `digitplus.tech`: decide consolidate-vs-park with the
     *     client, then 301 it to this canonical host once the decision lands.
     *   - The store domain `thedigitplus.com` is a SEPARATE property — never
     *     redirect to/from it; cross-links only.
     */
    return [
      // ---- Host canonicalization (single canonical host for SEO) ----------
      // Force www → non-www on the canonical domain. Works at the app level so
      // it holds regardless of Vercel domain config (belt-and-braces with the
      // Vercel "Redirect to" on the secondary domain).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.digitplustechnology.com" }],
        destination: "https://digitplustechnology.com/:path*",
        permanent: true,
      },
      // Stray legacy domain → canonical. Only fires once digitplus.tech is
      // pointed at this Vercel project & assigned to it (DNS step is yours).
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?digitplus\\.tech" }],
        destination: "https://digitplustechnology.com/:path*",
        permanent: true,
      },

      // Home aliases
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },

      // Legacy anchor PATH equivalents → real routes
      { source: "/services-section", destination: "/services", permanent: true },
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/industries-section", destination: "/industries", permanent: true },
      { source: "/sectors", destination: "/industries", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/company", destination: "/about", permanent: true },
      { source: "/how-we-work", destination: "/approach", permanent: true },
      { source: "/process", destination: "/approach", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/get-in-touch", destination: "/contact", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      { source: "/news", destination: "/insights", permanent: true },
    ];
  },
};

export default nextConfig;
