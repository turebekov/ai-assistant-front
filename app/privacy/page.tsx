import { Metadata } from 'next'
import Link from 'next/link'
import { Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - AssistantAI',
  description: 'Learn how AssistantAI protects your privacy and handles your data.',
}

const sections = [
  { id: 'information-we-collect', title: '1. Information We Collect' },
  { id: 'how-we-use', title: '2. How We Use Your Information' },
  { id: 'audio-interview-data', title: '3. Audio & Interview Data' },
  { id: 'data-sharing', title: '4. Data Sharing' },
  { id: 'data-security', title: '5. Data Security' },
  { id: 'your-rights', title: '6. Your Rights' },
  { id: 'cookies', title: '7. Cookies' },
  { id: 'childrens-privacy', title: "8. Children's Privacy" },
  { id: 'changes', title: '9. Changes to This Policy' },
  { id: 'contact', title: '10. Contact Us' },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-dark">AssistantAI</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-gray hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <h2 className="text-sm font-semibold text-dark mb-4">
                Table of Contents
              </h2>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-gray hover:text-primary transition-colors block py-1"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray">
                Last updated: April 2026
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray leading-relaxed">
                At AssistantAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI interview coaching service. Please read this policy carefully to understand our practices regarding your personal data.
              </p>

              <section id="information-we-collect" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
                  <li><strong>Profile Information:</strong> Optional information you choose to provide, such as your job title, industry, and target companies.</li>
                  <li><strong>Payment Information:</strong> When you subscribe to a paid plan, payment processing is handled by Stripe. We do not store your full credit card details.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our service, including session frequency, feature usage, and preferences.</li>
                  <li><strong>Device Information:</strong> Information about the device and browser you use to access our service.</li>
                </ul>
              </section>

              <section id="how-we-use" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li>Provide, maintain, and improve our AI interview coaching service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Develop new features and services</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                </ul>
              </section>

              <section id="audio-interview-data" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  3. Audio & Interview Data
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  <strong>This is important:</strong> AssistantAI is designed with privacy as a core principle.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li><strong>No Audio Storage:</strong> We do NOT record or store any audio from your interviews. Audio is processed in real-time by our AI system and immediately discarded.</li>
                  <li><strong>Interviewer Voice Only:</strong> Our system only captures the interviewer&apos;s voice for analysis. Your voice is never processed or recorded.</li>
                  <li><strong>Real-Time Processing:</strong> Questions are analyzed by Claude AI in real-time to generate suggestions. No transcripts or question logs are retained.</li>
                  <li><strong>Session Metadata:</strong> We may store basic session metadata (date, duration, platform used) to improve our service, but never the content of your interviews.</li>
                </ul>
              </section>

              <section id="data-sharing" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  4. Data Sharing
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li><strong>Service Providers:</strong> We work with third-party service providers (hosting, analytics, payment processing) who assist in operating our service. These providers are bound by confidentiality agreements.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, or legal process.</li>
                  <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                  <li><strong>With Your Consent:</strong> We may share information with your explicit consent.</li>
                </ul>
              </section>

              <section id="data-security" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  5. Data Security
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li>All data is encrypted in transit using TLS 1.3</li>
                  <li>Sensitive data is encrypted at rest using AES-256 encryption</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection practices</li>
                </ul>
                <p className="text-gray leading-relaxed mt-4">
                  While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section id="your-rights" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  6. Your Rights
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  We are committed to GDPR compliance. You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate personal data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;)</li>
                  <li><strong>Restriction:</strong> Request restriction of processing of your personal data</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your personal data</li>
                </ul>
                <p className="text-gray leading-relaxed mt-4">
                  To exercise any of these rights, please contact us at privacy@assistantai.io. We will respond within 30 days.
                </p>
              </section>

              <section id="cookies" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  7. Cookies
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray">
                  <li><strong>Essential Cookies:</strong> Required for the service to function (authentication, security)</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                </ul>
                <p className="text-gray leading-relaxed mt-4">
                  You can control cookies through your browser settings. Note that disabling certain cookies may affect functionality.
                </p>
              </section>

              <section id="childrens-privacy" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  8. Children&apos;s Privacy
                </h2>
                <p className="text-gray leading-relaxed">
                  AssistantAI is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section id="changes" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-gray leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically for any changes.
                </p>
              </section>

              <section id="contact" className="mt-12">
                <h2 className="text-2xl font-semibold text-dark mb-4">
                  10. Contact Us
                </h2>
                <p className="text-gray leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="list-none space-y-2 text-gray">
                  <li><strong>Email:</strong> privacy@assistantai.io</li>
                  <li><strong>Address:</strong> AssistantAI Inc., 123 Tech Street, San Francisco, CA 94105</li>
                </ul>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-light-gray mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray">
              &copy; {new Date().getFullYear()} AssistantAI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-primary font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
