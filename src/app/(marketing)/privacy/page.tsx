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
  title: "Privacy Policy | Digitplus Technology",
  description:
    "How Digitplus Technology Limited collects, uses, and protects your information. A privacy-first policy: minimal data, no selling of data, and clear contact for data requests.",
};

export default function PrivacyPage() {
  return (
    <Section>
      <Container width="narrow">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
          className="mb-8"
        />
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-h1 mt-3 text-text">Privacy Policy</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge tone="outline">DRAFT — pending legal counsel review</Badge>
          <span className="text-small text-muted">Last updated: May 2026</span>
        </div>

        <Prose className="mt-10">
          <p>
            This Privacy Policy explains how {siteConfig.name} (“Digitplus”,
            “we”, “us”) handles information collected through{" "}
            {siteConfig.url.replace("https://", "")}. We take a privacy-first
            approach: we collect as little as we reasonably can, use it only for
            the purpose you gave it to us, and never sell it.
          </p>

          <h2>Information we collect</h2>
          <p>
            We only collect information you choose to provide, and the minimum a
            page genuinely needs:
          </p>
          <ul>
            <li>
              <strong>Contact enquiries.</strong> When you submit our contact
              form, we collect your name, email, organisation, optional phone
              number, service interest, and your message.
            </li>
            <li>
              <strong>Report downloads.</strong> When you request a report, we
              collect your name, work email, organisation, and optional role.
            </li>
            <li>
              <strong>Newsletter sign-ups.</strong> We collect your email
              address only.
            </li>
            <li>
              <strong>Limited technical data.</strong> Basic, privacy-respecting
              analytics may record aggregate usage. We do not load non-essential
              tracking before you consent.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your enquiry and provide the services you ask for.</li>
            <li>To deliver reports you request and, where you opt in, related updates.</li>
            <li>To maintain and improve the security and performance of the site.</li>
          </ul>
          <p>
            We do not use your information for automated decision-making, and we
            do not send marketing you did not ask for.
          </p>

          <h2>Cookies and consent</h2>
          <p>
            Essential cookies needed for the site to function may be set without
            consent. Any non-essential cookies (for example, analytics) are{" "}
            <strong>disabled by default</strong> and only enabled if you actively
            opt in through our consent control. You can change your choice at any
            time.
          </p>

          <h2>Sharing your information</h2>
          <p>
            <strong>We do not sell your data.</strong> We share information only
            with the service providers who help us operate the site and respond
            to you (for example, email delivery or form handling), and only to
            the extent needed to provide that service. We may disclose
            information where required by law.
          </p>

          <h2>Data retention</h2>
          <p>
            We keep enquiry and lead information only as long as needed to act on
            it and to meet legitimate business and legal requirements, then
            delete or anonymise it.
          </p>

          <h2>Your rights and requests</h2>
          <p>
            You can ask us what information we hold about you, request a
            correction, or ask us to delete it. To make a request, email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we
            will respond promptly.
          </p>

          <h2>Security</h2>
          <p>
            We use reasonable technical and organisational measures to protect
            your information. No method of transmission or storage is completely
            secure, but we work to safeguard the data you entrust to us.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be
            reflected here with a revised “last updated” date.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy or your data? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or write
            to us at our headquarters in {siteConfig.hq}.
          </p>
        </Prose>
      </Container>
    </Section>
  );
}
