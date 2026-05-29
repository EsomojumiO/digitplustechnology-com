import type { Metadata } from "next";
import { Section, Container } from "@/components/ui";

/**
 * Placeholder for both article pages (/insights/[slug]) and category archives
 * (/insights/[category]). Next.js only allows one dynamic segment name per
 * level, so a single `[slug]` segment stands in for both here; the
 * insights-engine owns src/app/insights/** and will replace this with its real
 * dispatch (article vs. category) and generateStaticParams.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function InsightsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Section>
      <Container>
        <h1 className="text-h1">{slug}</h1>
        <p className="mt-4 text-body text-muted">
          Placeholder — under construction.
        </p>
      </Container>
    </Section>
  );
}
