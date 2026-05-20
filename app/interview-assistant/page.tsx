import type { Metadata } from 'next'
import Link from 'next/link'
import { Eye, Headphones, Lightbulb, Mic } from 'lucide-react'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { SeoLandingHero } from '@/components/marketing/seo-landing-hero'
import { Button } from '@/components/ui/button'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.interviewAssistant)

const highlights = [
  {
    icon: Mic,
    title: 'Listens to the interviewer',
    description: 'Captures only the interviewer’s voice and analyzes questions in real time.',
  },
  {
    icon: Lightbulb,
    title: 'Instant answer suggestions',
    description: 'AI-powered hints tailored to role, resume, and interview context.',
  },
  {
    icon: Eye,
    title: 'Invisible to screen share',
    description: 'Stealth overlay works with Google Meet, Zoom, and Microsoft Teams.',
  },
  {
    icon: Headphones,
    title: 'Interview & meetings',
    description: 'Use the same workspace for live interviews and meeting assistance.',
  },
]

export default function InterviewAssistantPage() {
  return (
    <MarketingPageShell>
      <SeoLandingHero
        badge="AI Interview Assistant"
        title="AI Interview Assistant with Real-Time Answer Suggestions"
        description="JobTap listens to your interviewer and delivers instant, context-aware hints — completely invisible during screen sharing."
        secondaryCta={{ label: 'Meeting translator', href: '/meeting-translator' }}
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <item.icon className="mb-4 h-8 w-8 text-primary" aria-hidden />
                <h2 className="text-lg font-semibold text-heading">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-primary px-8 py-10 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold">Ready for your next interview?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              Start free — 60 minutes of assistant time included. Upgrade anytime for unlimited sessions.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full">
              <Link href="/auth?mode=register">Start For Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}
