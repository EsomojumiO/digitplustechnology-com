import type { Metadata } from "next";
import {
  Sora,
  Figtree,
  Outfit,
  Manrope,
  Instrument_Sans,
  Space_Grotesk,
} from "next/font/google";

/**
 * TEMPORARY font-selection route. Renders the same composite in three candidate
 * type systems (A/B/C) so the client can pick. noindex + not in the sitemap +
 * unlinked. DELETE this route and the unused fonts once a winner is chosen.
 */
export const metadata: Metadata = {
  title: "Font preview (internal)",
  robots: { index: false, follow: false, nocache: true },
};

// Candidate fonts — scoped to this route via their CSS variables.
const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--fp-sora" });
const figtree = Figtree({ subsets: ["latin"], variable: "--fp-figtree" });
const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--fp-outfit" });
const manrope = Manrope({ subsets: ["latin"], variable: "--fp-manrope" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--fp-instrument" });
const space = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--fp-space" });

const allVars = [sora, figtree, outfit, manrope, instrument, space]
  .map((f) => f.variable)
  .join(" ");

type Candidate = {
  id: string;
  displayName: string;
  bodyName: string;
  display: string;
  body: string;
  button: string;
};

const CANDIDATES: Candidate[] = [
  {
    id: "A",
    displayName: "Sora",
    bodyName: "Figtree",
    display: "var(--fp-sora)",
    body: "var(--fp-figtree)",
    button: "var(--fp-sora)",
  },
  {
    id: "B",
    displayName: "Outfit",
    bodyName: "Manrope",
    display: "var(--fp-outfit)",
    body: "var(--fp-manrope)",
    button: "var(--fp-outfit)",
  },
  {
    id: "C",
    displayName: "Space Grotesk",
    bodyName: "Instrument Sans",
    display: "var(--fp-space)",
    body: "var(--fp-instrument)",
    button: "var(--fp-instrument)",
  },
];

function Composite({ c }: { c: Candidate }) {
  return (
    <section className="border-t border-hairline py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Label */}
        <p className="mb-8 font-mono text-caption uppercase tracking-[0.18em] text-accent-green">
          Option {c.id} · {c.displayName} display / {c.bodyName} body
        </p>

        {/* Hero headline */}
        <p
          className="font-mono text-caption uppercase tracking-[0.18em] text-accent-green"
        >
          Enterprise IT · Nigeria
        </p>
        <h1
          className="mt-4 max-w-[16ch] text-[clamp(2.5rem,1.8rem+3vw,4.25rem)] font-bold leading-[1.03] tracking-[-0.02em] text-text"
          style={{ fontFamily: c.display }}
        >
          Enterprise IT solutions, built to just work
        </h1>

        {/* Paragraph */}
        <p
          className="mt-6 max-w-[65ch] text-[16.5px] leading-[1.65]"
          style={{ fontFamily: c.body, color: "rgb(255 255 255 / 0.72)" }}
        >
          One accountable partner for the full IT lifecycle — procurement,
          infrastructure, deployment and managed services — for enterprises,
          government and banks across Nigeria. Documented, audit-ready delivery
          from a team that owns the outcome end to end.
        </p>

        {/* Button */}
        <div className="mt-8">
          <button
            type="button"
            className="rounded-lg bg-accent px-6 py-3 text-[15px] font-semibold tracking-[-0.01em] text-accent-foreground shadow-[var(--shadow-sm)] transition-[filter] duration-200 hover:brightness-110"
            style={{ fontFamily: c.button }}
          >
            Get a quote
          </button>
        </div>

        {/* Stat band */}
        <div className="mt-12 grid grid-cols-3 gap-6 border-y border-hairline py-8">
          {[
            { v: "2022", l: "Operating since" },
            { v: "50+", l: "Enterprise clients" },
            { v: "3", l: "Cities served" },
          ].map((s) => (
            <div key={s.l}>
              <div
                className="text-[clamp(2rem,1.4rem+2vw,3rem)] font-bold tracking-[-0.02em] text-text"
                style={{ fontFamily: c.display }}
              >
                {s.v}
              </div>
              <div className="mt-1 font-mono text-caption uppercase tracking-[0.1em] text-muted">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial card (target sizing: quote in body font 18–20px) */}
        <div className="mt-12 max-w-2xl rounded-xl border border-hairline bg-surface-raised p-8">
          <blockquote
            className="text-[19px] leading-[1.6]"
            style={{ fontFamily: c.body, color: "rgb(255 255 255 / 0.8)" }}
          >
            “Digitplus took ownership from procurement through deployment. One
            partner, one paper trail, and our branches came online on schedule.”
          </blockquote>
          <figcaption className="mt-5" style={{ fontFamily: c.body }}>
            <div className="text-[14px] font-medium text-text">A. Okafor</div>
            <div className="text-[13px]" style={{ color: "rgb(255 255 255 / 0.5)" }}>
              Head of IT, Regional Bank
            </div>
          </figcaption>
        </div>
      </div>
    </section>
  );
}

export default function FontPreviewPage() {
  return (
    <div className={allVars}>
      <div className="mx-auto max-w-5xl px-6 pt-16">
        <h2 className="text-h3 text-text">Type system preview — pick A, B or C</h2>
        <p className="mt-2 text-body text-muted">
          Same composite in three candidate pairings. Internal only — this route
          is noindex and will be deleted once a winner is chosen.
        </p>
      </div>
      {CANDIDATES.map((c) => (
        <Composite key={c.id} c={c} />
      ))}
      <div className="h-16" />
    </div>
  );
}
