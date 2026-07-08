import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Sora, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import {
  Header,
  Footer,
  WhatsAppWidget,
  CookieConsent,
  SkipLink,
} from "@/components/layout";
import { JsonLd } from "@/lib/seo/jsonld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { Analytics } from "@/components/analytics/Analytics";

// Figtree, primary UI/body face (client-selected Option A).
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

// Sora, display face + buttons (headlines, stat numbers, CTAs) — distinctive
// geometric character on the dark canvas. Client-selected Option A.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// JetBrains Mono, technical-precision face (eyebrows, labels, stats, metadata),
// exposed as --font-geist-mono so the design token resolves.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060707",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}, ${siteConfig.tagline}`,
    template: `%s · Digitplus Technology`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "IT procurement Nigeria",
    "hardware supply Abuja",
    "IT infrastructure Nigeria",
    "managed IT services",
    "enterprise IT solutions",
    "B2B IT Nigeria",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name}, ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}, ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Fine grain texture, restrained futurism (fixed, non-interactive). */}
        <div className="grain-overlay" aria-hidden="true" />
        <SkipLink />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
        <CookieConsent />
        {/* Sitewide structured data, Organization + WebSite. */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        {/* React-independent scroll-reveal (works in every browser, incl. Safari).
            beforeInteractive: sets `reveal-ready` before paint (no flash) and is
            coupled to this script, if it never runs, content stays visible. */}
        <Script src="/reveal.js" strategy="beforeInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
