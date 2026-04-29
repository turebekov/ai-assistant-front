import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/landing/hero'
import { LogosStrip } from '@/components/landing/logos-strip'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { CTABanner } from '@/components/landing/cta-banner'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <LogosStrip />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
