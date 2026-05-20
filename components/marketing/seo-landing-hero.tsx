import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SeoLandingHeroProps = {
  badge?: string
  title: string
  description: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function SeoLandingHero({
  badge,
  title,
  description,
  primaryCta = { label: 'Start For Free', href: '/auth?mode=register' },
  secondaryCta = { label: 'View pricing', href: '/pricing' },
}: SeoLandingHeroProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background pt-28 pb-16 lg:pt-32 lg:pb-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {badge ? (
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">{badge}</p>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl text-balance">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
