import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
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

// Inter — the whole type system for the Apple-light rebuild (client-selected
// Candidate A at the Phase 2 STOP; see docs/DECISIONS.md).
//
// The spec calls this pairing "Inter Display + Inter". Inter Display is not a
// separate Google Fonts family — but Inter ships an `opsz` axis (14–32), and
// Inter Display IS Inter at display optical size. So it's one variable family
// at two optical sizes: globals.css pins `opsz 32` on the display classes and
// lets body text optically size itself. Requesting the axis here is what makes
// that possible.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
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
    template: `%s · Digitplus`,
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
