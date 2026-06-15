import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { Button } from '@/components/ui/button'
import { TUTORIAL_YOUTUBE_URL, TUTORIAL_YOUTUBE_VIDEO_ID } from '@/lib/constants'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.tutorial)

const steps = [
  'Create an AI assistant with your role, interview type, and language.',
  'Open a session and share your meeting tab audio.',
  'Get real-time answer suggestions invisible to screen sharing.',
]

export default function TutorialPage() {
  const embedSrc = `https://www.youtube-nocookie.com/embed/${TUTORIAL_YOUTUBE_VIDEO_ID}?rel=0`

  return (
    <MarketingPageShell>
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background pt-28 pb-12 lg:pt-32 lg:pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Tutorial</p>
          <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl text-balance">
            How to use JobTap
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray">
            A short walkthrough on creating your AI assistant and running your first interview session.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <div className="relative aspect-video w-full bg-dark/5">
              <iframe
                src={embedSrc}
                title="JobTap tutorial — create your assistant and start a session"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray">
            Prefer YouTube?{' '}
            <a
              href={TUTORIAL_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Open on YouTube
            </a>
          </p>

          <ul className="mt-10 space-y-4">
            {steps.map((step) => (
              <li key={step} className="flex items-start gap-3 text-gray">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl bg-primary px-8 py-10 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold">Ready to try it yourself?</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              Start free — 60 minutes of assistant time included.
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
