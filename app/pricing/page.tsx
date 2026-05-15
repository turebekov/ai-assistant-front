import type { Metadata } from 'next'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { SeoLandingHero } from '@/components/marketing/seo-landing-hero'
import { Pricing } from '@/components/landing/pricing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.pricing)

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <SeoLandingHero
        badge="Pricing"
        title="Simple, Transparent Pricing"
        description="Start free with 60 minutes of assistant time. Upgrade when you need unlimited interviews, stealth mode, and meeting translation."
        primaryCta={{ label: 'Start For Free', href: '/auth?mode=register' }}
        secondaryCta={{ label: 'Interview assistant', href: '/interview-assistant' }}
      />
      <Pricing />
    </MarketingPageShell>
  )
}
