import type { Metadata } from "next";
import {
  Section,
  Container,
  Breadcrumbs,
  Eyebrow,
  Prose,
  Badge,
} from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use | Digitplus Technology",
  description:
    "The terms governing use of the Digitplus Technology Limited website, including acceptable use, intellectual property, and limitations of liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Section>
      <Container width="narrow">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Terms" }]}
          className="mb-8"
        />
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-h1 mt-3 text-text">Terms of Use</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge tone="outline">DRAFT — pending legal counsel review</Badge>
          <span className="text-small text-muted">Last updated: May 2026</span>
        </div>

        <Prose className="mt-10">
          <p>
            These Terms of Use govern your access to and use of the{" "}
            {siteConfig.name} website at{" "}
            {siteConfig.url.replace("https://", "")} (the “Site”). By using the
            Site, you agree to these terms. If you do not agree, please do not
            use the Site.
          </p>

          <h2>About this site</h2>
          <p>
            This Site is the corporate information and content resource for
            Digitplus Technology Limited. It is not an online store: it does not
            sell products or process payments. References to our separate retail
            property are provided for convenience only.
          </p>

          <h2>Use of the site</h2>
          <p>You agree to use the Site lawfully and not to:</p>
          <ul>
            <li>interfere with or disrupt the Site or its security;</li>
            <li>attempt to gain unauthorised access to any systems or data;</li>
            <li>
              use automated means to scrape or harvest content except as
              permitted by our robots directives;
            </li>
            <li>submit false information or misuse our contact and lead forms.</li>
          </ul>

          <h2>Information, no warranty</h2>
          <p>
            Content on the Site is provided for general information about our
            services. While we work to keep it accurate and current, we make no
            warranty that it is complete, error-free, or suitable for any
            particular purpose. Nothing on the Site constitutes a binding offer;
            engagements are governed by separate written agreements.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The Site and its content — including text, graphics, logos, and
            layout — are owned by or licensed to Digitplus Technology Limited and
            are protected by applicable law. You may view and share content for
            lawful, non-commercial purposes with attribution, but you may not
            reproduce or exploit it commercially without our written permission.
          </p>

          <h2>Third-party links</h2>
          <p>
            The Site may link to third-party websites. We are not responsible for
            the content or practices of those sites; accessing them is at your
            own risk.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Digitplus Technology Limited
            will not be liable for any indirect, incidental, or consequential
            loss arising from your use of, or inability to use, the Site.
          </p>

          <h2>Privacy</h2>
          <p>
            Our handling of personal information is described in our{" "}
            <a href="/privacy">Privacy Policy</a>, which forms part of these
            terms.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the Federal Republic of
            Nigeria, and any disputes are subject to the jurisdiction of its
            courts.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            Site after changes are posted constitutes acceptance of the revised
            terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </Prose>
      </Container>
    </Section>
  );
}
