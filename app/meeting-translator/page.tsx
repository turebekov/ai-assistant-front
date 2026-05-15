import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Languages, Subtitles, Video } from 'lucide-react'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { SeoLandingHero } from '@/components/marketing/seo-landing-hero'
import { Button } from '@/components/ui/button'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.meetingTranslator)

const highlights = [
  {
    icon: Languages,
    title: '50+ languages',
    description: 'Live translation and captions for calls, interviews, and team meetings.',
  },
  {
    icon: Video,
    title: 'Zoom, Meet & Teams',
    description: 'Works in the browser with Google Meet, Zoom Web, and Microsoft Teams.',
  },
  {
    icon: Subtitles,
    title: 'Real-time captions',
    description: 'See what was said instantly — ideal for multilingual interviews and standups.',
  },
  {
    icon: Globe,
    title: 'Interview + meetings',
    description: 'Combine live translation with AI interview coaching in one workspace.',
  },
]

export default function MeetingTranslatorPage() {
  return (
    <MarketingPageShell>
      <SeoLandingHero
        badge="AI Meeting Translator"
        title="Live Meeting Translator for Zoom, Meet & Teams"
        description="Translate any online meeting or interview in real time. JobTap delivers instant captions and context in your language."
        primaryCta={{ label: 'Try JobTap free', href: '/auth?mode=register' }}
        secondaryCta={{ label: 'Interview assistant', href: '/interview-assistant' }}
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
                <h2 className="text-lg font-semibold text-dark">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-primary px-8 py-10 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold">Understand every meeting</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              Start with a free plan, then upgrade for unlimited assistant and translation time.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 rounded-full">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}
