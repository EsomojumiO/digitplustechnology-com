import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section, Container } from "@/components/ui";
import { industries } from "@/lib/site";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  return { title: industry?.title ?? "Industry" };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return (
    <Section>
      <Container>
        <h1 className="text-h1">{industry.title}</h1>
        <p className="mt-4 text-body text-muted">
          Placeholder — under construction.
        </p>
      </Container>
    </Section>
  );
}
