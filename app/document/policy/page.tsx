import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalDocumentLayout } from '@/components/legal/legal-document-layout'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.privacy)

const SITE_URL = 'https://www.jobtap.app'
const CONTACT_EMAIL = 'privacy@jobtap.app'

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy" lastUpdated="April 15, 2026">
      <p>
        This Privacy Policy describes how AssistantAI (&quot;AssistantAI,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, and discloses your personal information
        when you use the AssistantAI website ({SITE_URL}) and any related services (collectively,
        the &quot;Service&quot;).
      </p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          <strong>a. Information You Provide:</strong> When you use the Service, we may collect
          personal information that you voluntarily provide, such as your name, email address,
          account credentials, assistant settings, uploaded context files, and any other information
          you choose to provide.
        </p>
        <p>
          <strong>b. Automatically Collected Information:</strong> We may collect certain
          information automatically when you use the Service, including your IP address, browser
          type, operating system, referring URLs, device information, and usage data.
        </p>
        <p>
          <strong>c. Payment Information:</strong> When you subscribe to a paid plan, payment
          processing is handled by our merchant of record,{' '}
          <a
            href="https://www.lemonsqueezy.com"
            className="text-link underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lemon Squeezy
          </a>
          . We do not store your full payment card details.
        </p>
      </section>

      <section>
        <h2>2. Use of Information</h2>
        <p>We may use the information we collect for various purposes, including:</p>
        <ul>
          <li>To provide, maintain, and improve the Service;</li>
          <li>To personalize your experience and customize content;</li>
          <li>To communicate with you, including service updates and support messages;</li>
          <li>To respond to your inquiries, requests, and feedback;</li>
          <li>To detect, prevent, and address technical issues and security vulnerabilities;</li>
          <li>To comply with applicable laws, regulations, and legal processes.</li>
        </ul>
      </section>

      <section>
        <h2>3. Audio, Transcript, and Session Data</h2>
        <p>
          The Service may process audio from your browser tab and generate transcripts and AI
          suggestions in real time. We design the Service to minimize retention of sensitive
          content. Session metadata (such as date, duration, and saved notes you choose to store)
          may be kept to provide session history features. Do not use the Service where recording
          or AI assistance is prohibited.
        </p>
      </section>

      <section>
        <h2>4. Disclosure of Information</h2>
        <p>We may disclose your personal information to third parties for the following purposes:</p>
        <ul>
          <li>
            To service providers and partners who assist us in operating the Service (hosting,
            analytics, AI providers, payment processing);
          </li>
          <li>To comply with legal obligations, such as subpoenas, court orders, or other legal processes;</li>
          <li>To protect and defend the rights, property, or safety of AssistantAI, our users, or others.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We take reasonable measures to protect the security of your personal information and to
          prevent unauthorized access, disclosure, alteration, or destruction. No method of
          transmission over the Internet is completely secure.
        </p>
      </section>

      <section>
        <h2>6. Your Choices</h2>
        <p>
          You may choose not to provide certain personal information, but this may limit your
          ability to use certain features of the Service. You can request access, correction, or
          deletion of your account data by contacting us. You may opt out of promotional emails by
          following the unsubscribe instructions in those emails.
        </p>
      </section>

      <section id="cookies">
        <h2>7. Cookies</h2>
        <p>
          We use cookies and similar technologies for authentication, security, preferences, and
          analytics. You can control cookies through your browser settings; disabling some cookies may
          limit functionality.
        </p>
      </section>

      <section>
        <h2>8. Third-Party Links</h2>
        <p>
          The Service may contain links to third-party websites or services that are not owned or
          controlled by AssistantAI. We are not responsible for the privacy practices or content of
          those third parties.
        </p>
      </section>

      <section>
        <h2>9. Children&apos;s Privacy</h2>
        <p>
          The Service is not intended for children under the age of 16, and we do not knowingly
          collect personal information from children under 16. If you are a parent or guardian and
          believe that your child has provided us with personal information, please contact us
          immediately.
        </p>
      </section>

      <section>
        <h2>10. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
          periodically for any changes.
        </p>
      </section>

      <section>
        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <Link href={`mailto:${CONTACT_EMAIL}`} className="text-link underline">
            {CONTACT_EMAIL}
          </Link>
          .
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
