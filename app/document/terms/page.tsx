import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalDocumentLayout } from '@/components/legal/legal-document-layout'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.terms)

const CONTACT_EMAIL = 'support@jobtap.app'

export default function TermsPage() {
  return (
    <LegalDocumentLayout title="Terms and Conditions" lastUpdated="April 15, 2026">
      <p>
        These terms and conditions (&quot;Terms&quot;) govern your use of AssistantAI (the
        &quot;Service&quot;), a platform operated for JobTap / AssistantAI (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;). By accessing or using the Service, you agree to be
        bound by these Terms. If you do not agree to these Terms, please do not use the Service.
      </p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Service, you agree to be bound by these Terms and all applicable
          laws and regulations. If you do not agree with any of these Terms, you are prohibited from
          using or accessing the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          The Service is an AI-powered interview and meeting assistant designed to help users prepare
          for job interviews and participate in meetings with real-time transcription and coaching
          suggestions. The Service uses artificial intelligence to provide guidance, feedback, and
          recommendations based on context you provide and audio processed during your session.
        </p>
      </section>

      <section>
        <h2>3. Use of the Service</h2>
        <p>
          You must be at least 16 years old to use the Service. By using the Service, you represent
          and warrant that you are at least 16 years old and have the legal capacity to enter into
          these Terms. You are solely responsible for ensuring that your use complies with the rules
          of any interview, employer, school, or platform (e.g. video conferencing policies).
        </p>
      </section>

      <section>
        <h2>4. User Conduct</h2>
        <p>
          You agree to use the Service only for lawful purposes and in accordance with these Terms.
          You agree not to use the Service in any way that violates applicable laws or regulations,
          infringes third-party rights, or facilitates fraud, harassment, or unauthorized access to
          systems.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          All content included in or made available through the Service, such as text, graphics,
          logos, software, and data compilations, is the property of AssistantAI or its licensors and
          is protected by copyright and other intellectual property laws. You retain ownership of
          content you upload; you grant us a limited license to process it to provide the Service.
        </p>
      </section>

      <section>
        <h2>6. Subscriptions and Payments</h2>
        <p>
          Paid plans are billed on a recurring subscription basis through our payment partner, Lemon
          Squeezy, which acts as merchant of record. Prices and features are described on our
          pricing page and at checkout.
        </p>
        <p>
          <strong>Renewals and cancellation:</strong> Subscriptions renew automatically until you
          cancel through your account, Lemon Squeezy customer portal, or by contacting support.
          After cancellation, you retain access until the end of the current billing period.
        </p>
        <p>
          <strong>Refunds:</strong> Unless required by applicable law, subscription fees are
          non-refundable once charged. Lemon Squeezy may issue refunds or chargebacks according to
          its policies and payment network rules.
        </p>
      </section>

      <section>
        <h2>7. Privacy Policy</h2>
        <p>
          Your use of the Service is subject to our{' '}
          <Link href="/document/policy" className="text-primary underline">
            Privacy Policy
          </Link>
          , which is incorporated into these Terms by reference.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, AssistantAI shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of profits,
          revenues, data, use, goodwill, or other intangible losses, resulting from your access to or
          use of or inability to access or use the Service, whether based on warranty, contract,
          tort, or any other legal theory.
        </p>
      </section>

      <section>
        <h2>9. Early Stage Service</h2>
        <p>
          The Service may be subject to stability issues and intermittent downtime. We work to improve
          reliability but do not guarantee uninterrupted service. You use the Service at your own
          discretion and risk.
        </p>
      </section>

      <section>
        <h2>10. Modification of Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify you of material
          changes by posting the revised Terms on this page. Your continued use of the Service after
          changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          We may terminate or suspend your access to the Service immediately, without prior notice,
          for any reason, including if you breach these Terms.
        </p>
      </section>

      <section>
        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable law, without
          regard to conflict of law provisions, except where mandatory consumer protections apply in
          your country of residence.
        </p>
      </section>

      <section>
        <h2>13. Compliance with Laws</h2>
        <p>
          You agree to use the Service in compliance with all applicable laws and regulations. You
          are solely responsible for ensuring that your use adheres to legal requirements and does not
          infringe any third party&apos;s rights.
        </p>
      </section>

      <section>
        <h2>14. User Responsibility</h2>
        <p>
          AI suggestions are for assistance only and may be inaccurate. You are responsible for
          reviewing and deciding what to say or do in any interview or meeting. We do not guarantee
          employment outcomes or specific results.
        </p>
      </section>

      <section>
        <h2>15. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at{' '}
          <Link href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
            {CONTACT_EMAIL}
          </Link>
          .
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
