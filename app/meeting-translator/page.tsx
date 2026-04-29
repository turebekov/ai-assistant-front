import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { TranslatorHero } from '@/components/translator/hero'
import { TranslatorHowItWorks } from '@/components/translator/how-it-works'
import { SupportedLanguages } from '@/components/translator/supported-languages'
import { TranslatorUseCases } from '@/components/translator/use-cases'
import { ComparisonTable } from '@/components/translator/comparison-table'
import { TranslatorTestimonials } from '@/components/translator/testimonials'
import { TranslatorPricing } from '@/components/translator/pricing'
import { TranslatorCTA } from '@/components/translator/cta'

export const metadata: Metadata = {
  title: 'AI Meeting Translator — Real-Time Translation for Zoom, Meet, Teams',
  description: 'Translate any meeting in real-time. AssistantAI translates your Google Meet, Zoom or Teams meeting live — from any language to yours, instantly. 50+ languages supported.',
  keywords: [
    'AI meeting translator',
    'real-time meeting translation',
    'live interview translator',
    'translate zoom meeting',
    'google meet translator',
    'teams meeting translation',
    'live translation overlay',
    'interview translator'
  ],
  openGraph: {
    title: 'AI Meeting Translator — Real-Time Translation',
    description: 'Translate any meeting in real-time. 50+ languages. Invisible overlay.',
    url: 'https://assistantai.io/meeting-translator',
    images: [{
      url: '/og-translator.png',
      width: 1200,
      height: 630,
      alt: 'AssistantAI Meeting Translator'
    }]
  },
  twitter: {
    title: 'AI Meeting Translator — Real-Time Translation',
    description: 'Translate any meeting in real-time. 50+ languages.',
    images: ['/og-translator.png'],
  },
  alternates: {
    canonical: 'https://assistantai.io/meeting-translator',
  },
}

export default function MeetingTranslatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <TranslatorHero />
        <TranslatorHowItWorks />
        <SupportedLanguages />
        <TranslatorUseCases />
        <ComparisonTable />
        <TranslatorTestimonials />
        <TranslatorPricing />
        <TranslatorCTA />
      </main>
      <Footer />
    </div>
  )
}
