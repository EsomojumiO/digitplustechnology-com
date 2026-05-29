/**
 * opengraph-image.tsx — Default site-wide Open Graph image (1200x630).
 *
 * Rendered at the edge via Next's ImageResponse. Used for any page that does
 * not supply its own `openGraph.images` (articles/reports override this with
 * their own cover via metadata). Brand wordmark + tagline on a calm dark
 * surface with the single confident accent — literal colour values, because
 * ImageResponse cannot read CSS custom properties.
 */
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Literal token values mirrored from globals.css (@theme cannot be read here).
const NEUTRAL_950 = "#0b0b0d";
const NEUTRAL_0 = "#ffffff";
const ACCENT = "#1d4ed8"; // ≈ hsl(222 80% 46%) accent-600
const MUTED = "#a1a1aa";

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
          background: NEUTRAL_950,
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
              color: NEUTRAL_0,
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div
            style={{
              color: NEUTRAL_0,
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
              color: NEUTRAL_0,
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
          <div style={{ display: "flex", width: "120px", height: "6px", background: ACCENT, borderRadius: "3px" }} />
          <div style={{ color: MUTED, fontSize: "26px", letterSpacing: "0.04em" }}>
            {siteConfig.coverage.join("  •  ")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
