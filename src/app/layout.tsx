import type { Metadata } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
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

// Inter — primary UI/body face (exposed as --font-geist-sans so tokens resolve).
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Montserrat — brand headline face (display / H1 / H2).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// JetBrains Mono — technical-precision face (eyebrows, labels, stats, metadata),
// exposed as --font-geist-mono so the design token resolves.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
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
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
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
      className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Fine grain texture — restrained futurism (fixed, non-interactive). */}
        <div className="grain-overlay" aria-hidden="true" />
        <SkipLink />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
        <CookieConsent />
        {/* Sitewide structured data — Organization + WebSite. */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
