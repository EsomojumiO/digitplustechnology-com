import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section, Container } from "@/components/ui";
import { services } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return { title: service?.title ?? "Service" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <Section>
      <Container>
        <h1 className="text-h1">{service.title}</h1>
        <p className="mt-4 text-body text-muted">
          Placeholder — under construction.
        </p>
      </Container>
    </Section>
  );
}
