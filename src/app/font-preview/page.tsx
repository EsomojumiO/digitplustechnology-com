/**
 * /font-preview — TEMPORARY Phase 2 route. Delete once the client picks A/B/C.
 *
 * Renders the same composite three times, one per type candidate, on the
 * Apple-light canvas so the decision is made on real copy at real sizes.
 *
 * Escapes the site chrome deliberately: the root layout still ships the dark
 * header/footer (the token flip is Phase 3), and dark chrome around a white
 * canvas would poison the judgement. The fixed overlay covers it.
 *
 * Palette is the client-approved brand-kit ramp (spec 14 §1.2), not the
 * brief's invented values:
 *   Forest-600 #20493b  10.11:1 on white — green ink, eyebrows, rules
 *   Ember-600  #ad4527   5.74:1 on white — the one orange fill, white label
 *   Ember-700  #8c3820   7.77:1 on white — orange text-links
 */
import type { Metadata } from "next";
import { Inter, Instrument_Sans, Schibsted_Grotesk } from "next/font/google";
import { stats, testimonials } from "@/data";

export const metadata: Metadata = {
  title: "Font preview — internal",
  robots: { index: false, follow: false },
};

/* ── Candidates ────────────────────────────────────────────────────────────
   A is specced as "Inter Display + Inter". Inter Display is not a Google
   Fonts family — but Inter carries an `opsz` axis (14–32), and Inter Display
   IS Inter at display optical size. One family, two optical sizes, which is
   the pairing the brief is asking for. */
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--fp-inter",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--fp-instrument",
  display: "swap",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--fp-schibsted",
  display: "swap",
});

const INK = "#1d1d1f";
const BODY = "#424245";
const GREEN = "#20493b";
const ORANGE_FILL = "#ad4527";
const ORANGE_INK = "#8c3820";
const HAIRLINE = "#d2d2d7";
const BAND = "#f5f5f7";

type Candidate = {
  key: "A" | "B" | "C";
  name: string;
  note: string;
  displayFamily: string;
  bodyFamily: string;
  displayStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  displayWeight: number;
  bodyWeight: number;
};

const candidates: Candidate[] = [
  {
    key: "A",
    name: "Inter Display + Inter",
    note: "One family, two optical sizes (opsz 32 display / opsz 16 body). Neutral, ubiquitous, the safest read.",
    displayFamily: "var(--fp-inter)",
    bodyFamily: "var(--fp-inter)",
    displayStyle: { fontVariationSettings: '"opsz" 32' },
    bodyStyle: { fontVariationSettings: '"opsz" 16' },
    displayWeight: 600,
    bodyWeight: 400,
  },
  {
    key: "B",
    name: "Instrument Sans",
    note: "Single family, display and body two weights apart (700/400). Most restrained — one voice, contrast from weight alone.",
    displayFamily: "var(--fp-instrument)",
    bodyFamily: "var(--fp-instrument)",
    displayWeight: 700,
    bodyWeight: 400,
  },
  {
    key: "C",
    name: "Schibsted Grotesk + Inter",
    note: "Grotesk headline with a neutral body. Most character in the display line; body stays out of the way.",
    displayFamily: "var(--fp-schibsted)",
    bodyFamily: "var(--fp-inter)",
    bodyStyle: { fontVariationSettings: '"opsz" 16' },
    displayWeight: 700,
    bodyWeight: 400,
  },
];

function Composite({ c }: { c: Candidate }) {
  const display: React.CSSProperties = {
    fontFamily: c.displayFamily,
    fontWeight: c.displayWeight,
    letterSpacing: "-0.015em",
    color: INK,
    ...c.displayStyle,
  };
  const body: React.CSSProperties = {
    fontFamily: c.bodyFamily,
    fontWeight: c.bodyWeight,
    color: BODY,
    ...c.bodyStyle,
  };

  return (
    <section
      aria-label={`Candidate ${c.key} — ${c.name}`}
      style={{ background: "#ffffff", borderTop: `1px solid ${HAIRLINE}` }}
    >
      {/* Candidate label — scaffolding, not part of the design being judged */}
      <div
        style={{
          ...body,
          maxWidth: 1160,
          margin: "0 auto",
          padding: "28px 24px 0",
          fontSize: 13,
        }}
      >
        <span style={{ color: GREEN, fontWeight: 600 }}>Candidate {c.key}</span>
        <span style={{ color: HAIRLINE, margin: "0 8px" }}>/</span>
        <span style={{ color: INK, fontWeight: 600 }}>{c.name}</span>
        <p style={{ marginTop: 6, maxWidth: "65ch", fontSize: 13 }}>{c.note}</p>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "56px 24px 88px" }}>
        <p
          style={{
            ...body,
            color: GREEN,
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 20,
          }}
        >
          Managed IT
        </p>
        <h2
          style={{
            ...display,
            fontSize: "clamp(48px, 5.4vw, 80px)",
            lineHeight: 1.06,
            maxWidth: "16ch",
            margin: 0,
          }}
        >
          Enterprise IT solutions, built to just work
        </h2>
        <p
          style={{
            ...body,
            fontSize: 17,
            lineHeight: 1.6,
            maxWidth: "65ch",
            marginTop: 28,
          }}
        >
          One accountable partner for the full IT lifecycle — procurement,
          infrastructure, deployment and managed services — for enterprises,
          government and banks across Nigeria.
        </p>

        {/* The 3-button system: one orange fill, hairline secondary, green ghost */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 16,
            marginTop: 36,
          }}
        >
          <span
            style={{
              ...body,
              background: ORANGE_FILL,
              color: "#ffffff",
              fontWeight: 600,
              fontSize: 15,
              padding: "12px 24px",
              borderRadius: 980,
            }}
          >
            Talk to an engineer
          </span>
          <span
            style={{
              ...body,
              border: `1px solid ${HAIRLINE}`,
              color: INK,
              fontWeight: 600,
              fontSize: 15,
              padding: "12px 24px",
              borderRadius: 980,
            }}
          >
            Explore services
          </span>
          <span style={{ ...body, color: ORANGE_INK, fontWeight: 600, fontSize: 15 }}>
            Get a quote ›
          </span>
        </div>
      </div>

      {/* Stat band */}
      <div style={{ background: BAND }}>
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "64px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 32,
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  ...display,
                  fontSize: "clamp(36px, 3.4vw, 52px)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div style={{ ...body, fontSize: 15, marginTop: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "88px 24px 96px" }}>
        <div
          style={{
            width: 40,
            height: 2,
            background: GREEN,
            marginBottom: 32,
          }}
        />
        <blockquote style={{ margin: 0 }}>
          <p
            style={{
              ...display,
              fontWeight: c.displayWeight === 700 ? 600 : 500,
              fontSize: "clamp(22px, 2.1vw, 30px)",
              lineHeight: 1.42,
              maxWidth: "42ch",
              margin: 0,
            }}
          >
            “{testimonials[0].quote}”
          </p>
          <footer style={{ ...body, fontSize: 15, marginTop: 24 }}>
            {testimonials[0].role}
            <span style={{ color: HAIRLINE, margin: "0 8px" }}>·</span>
            {testimonials[0].organization}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* The dark header/footer would poison a judgement about type on white, so this
   route hides the site chrome outright. Scoped: the <style> only ships on this
   page, and the route is deleted at the end of Phase 2.
   Note: an overlay is NOT an option here — `template.tsx`'s `.route-enter`
   animation puts a transform on the wrapper, which makes it the containing
   block for any `position: fixed` descendant, collapsing it to 0px. Normal
   flow sidesteps that entirely (and makes full-page screenshots correct). */
const hideChrome = `
  body > *:not(main) { display: none !important; }
  body { background: #ffffff !important; }
  main { flex: none !important; }
`;

export default function FontPreviewPage() {
  return (
    <div
      className={`${inter.variable} ${instrument.variable} ${schibsted.variable}`}
      style={{ background: "#ffffff", minHeight: "100vh" }}
    >
      <style>{hideChrome}</style>
      <header
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "40px 24px 8px",
          fontFamily: "var(--fp-inter)",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 600, color: INK, margin: 0 }}>
          Type candidates — Apple-light rebuild
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: BODY,
            maxWidth: "65ch",
            marginTop: 10,
          }}
        >
          Same composite, same copy, three type systems. Brand-kit palette
          (Forest #20493b / Ember #ad4527), all pairs ≥4.5:1 on white. Judge the
          headline’s presence, the body’s calm at 17px, and whether the stat
          numerals hold up. Pick A, B, or C.
        </p>
      </header>

      {candidates.map((c) => (
        <Composite key={c.key} c={c} />
      ))}

      <div style={{ height: 64 }} />
    </div>
  );
}
