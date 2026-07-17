/**
 * opengraph-image.tsx, Default site-wide Open Graph image (1200x630).
 *
 * Rendered at the edge via Next's ImageResponse. Used for any page that does
 * not supply its own `openGraph.images` (articles/reports override this with
 * their own cover via metadata). Brand wordmark + tagline on the forest-green
 * brand surface with the single confident ember accent, literal colour values,
 * because ImageResponse cannot read CSS custom properties.
 */
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name}, ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Literal Apple-light token values mirrored from globals.css (@theme cannot be
// read here — this renders in the OG image runtime, not the browser). Keep in
// sync with §2 by hand: nothing enforces it, and a stale OG card is invisible
// until someone shares a link.
const BRAND = "#ffffff"; // --background, the white canvas
const CREAM = "#1d1d1f"; // --text, ink on white (16.83:1)
const ACCENT = "#ad4527"; // --accent, Ember-600, the single orange fill
const ON_ACCENT = "#ffffff"; // --accent-foreground, white label on orange (5.74:1)
const GREEN = "#2d5d49"; // --accent-green, Forest-500 — structural rules (7.57:1)
const MUTED = "#6e6e73"; // --text-muted, a VALUE not alpha (5.07:1 on white)

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BRAND,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ON_ACCENT,
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div
            style={{
              color: CREAM,
              fontSize: "30px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        {/* Middle: tagline + value line */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              color: CREAM,
              fontSize: "84px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              color: MUTED,
              fontSize: "32px",
              lineHeight: 1.35,
              maxWidth: "880px",
            }}
          >
            End-to-end B2B IT for enterprises, government, and institutions across
            Nigeria.
          </div>
        </div>

        {/* Bottom: accent rule + coverage */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* GREEN, not orange: green carries structural rules, orange is
              conversion-only — and the logo tile above is already the card's
              one orange fill. */}
          <div style={{ display: "flex", width: "120px", height: "6px", background: GREEN, borderRadius: "3px" }} />
          <div style={{ color: MUTED, fontSize: "26px", letterSpacing: "0.04em" }}>
            {siteConfig.coverage.join("  •  ")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
