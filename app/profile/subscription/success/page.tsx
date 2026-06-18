'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'
import { formatPlanLabel } from '@/lib/billing/config'

type ActivationState = 'loading' | 'active' | 'pending'

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const [state, setState] = useState<ActivationState>('loading')
  const [planLabel, setPlanLabel] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.replace('/auth')
      return
    }

    let cancelled = false
    void (async () => {
      let authToken = token
      for (let attempt = 0; attempt < 8; attempt++) {
        const response = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        const payload = (await response.json().catch(() => ({}))) as {
          token?: string
          access?: { plan?: string; hasSubscription?: boolean }
        }
        if (response.ok && payload.token) {
          localStorage.setItem('auth_token', payload.token)
          authToken = payload.token
          const plan = payload.access?.plan || ''
          if (payload.access?.hasSubscription) {
            localStorage.setItem('auth_plan', plan)
            if (!cancelled) {
              setPlanLabel(formatPlanLabel(plan))
              setState('active')
            }
            return
          }
        }
        await new Promise((r) => setTimeout(r, 1500))
      }
      if (!cancelled) {
        setState('pending')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <section className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {state === 'loading' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-6 text-2xl font-bold text-foreground">Confirming your payment…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This usually takes a few seconds. Please keep this page open.
            </p>
          </>
        )}

        {state === 'active' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-6 text-2xl font-bold text-foreground">You&apos;re all set!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your <span className="font-medium text-foreground">{planLabel}</span> subscription is
              active. Paid features are unlocked.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/profile/interview">Start interview assistant</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile/subscription">View plans</Link>
              </Button>
            </div>
          </>
        )}

        {state === 'pending' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-amber-500" />
            <h1 className="mt-6 text-2xl font-bold text-foreground">Payment received</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your subscription is still being activated. This can take up to a minute while we
              process the payment confirmation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => window.location.reload()}>Check again</Button>
              <Button asChild variant="outline">
                <Link href="/profile/subscription">Back to plans</Link>
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
