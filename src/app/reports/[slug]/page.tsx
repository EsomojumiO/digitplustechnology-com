import type { Metadata } from "next";
import { Section, Container } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function ReportSlugPage({
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
