'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveCheckoutCancelledMessage } from '@/lib/billing/checkout-cancelled-message'

function SubscriptionCancelledContent() {
  const searchParams = useSearchParams()
  const reason = searchParams?.get('reason') ?? searchParams?.get('error') ?? null
  const { title, description } = resolveCheckoutCancelledMessage(reason)

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <section className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <XCircle className="mx-auto h-12 w-12 text-destructive" aria-hidden />
        <h1 className="mt-6 text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/profile/subscription">Try again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profile/interview">Continue with free plan</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

export default function SubscriptionCancelledPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-4 py-16">
          <section className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </section>
        </main>
      }
    >
      <SubscriptionCancelledContent />
    </Suspense>
  )
}
