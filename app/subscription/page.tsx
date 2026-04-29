'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SubscriptionPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const choosePlan = async (plan: 'free' | 'pro' | 'team') => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setLoadingPlan(plan)
    try {
      const response = await fetch('/api/auth/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      })
      const payload = (await response.json().catch(() => ({}))) as {
        token?: string
        access?: { plan?: string; hasSubscription?: boolean }
        error?: string
      }
      if (!response.ok || !payload.token) {
        setStatus(payload.error || 'Cannot update plan.')
        return
      }
      localStorage.setItem('auth_token', payload.token)
      if (payload.access?.plan) {
        localStorage.setItem('auth_plan', payload.access.plan)
      }
      router.push('/interview')
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-foreground">Choose your plan</h1>
        <p className="mt-2 text-muted-foreground">
          Save and continue to the interview assistant.
        </p>
        {status && <p className="mt-3 text-sm text-destructive">{status}</p>}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border p-5">
            <h2 className="text-xl font-semibold">Free</h2>
            <p className="mt-2 text-sm text-muted-foreground">Basic features for testing.</p>
            <Button className="mt-6 w-full" variant="outline" onClick={() => choosePlan('free')} disabled={loadingPlan !== null}>
              {loadingPlan === 'free' ? 'Saving...' : 'Choose Free'}
            </Button>
          </article>
          <article className="rounded-xl border border-primary/30 p-5">
            <h2 className="text-xl font-semibold">Pro</h2>
            <p className="mt-2 text-sm text-muted-foreground">Unlimited sessions and faster workflow.</p>
            <Button className="mt-6 w-full" onClick={() => choosePlan('pro')} disabled={loadingPlan !== null}>
              {loadingPlan === 'pro' ? 'Saving...' : 'Choose Pro'}
            </Button>
          </article>
          <article className="rounded-xl border border-border p-5">
            <h2 className="text-xl font-semibold">Team</h2>
            <p className="mt-2 text-sm text-muted-foreground">For teams with collaboration and analytics.</p>
            <Button className="mt-6 w-full" variant="outline" onClick={() => choosePlan('team')} disabled={loadingPlan !== null}>
              {loadingPlan === 'team' ? 'Saving...' : 'Choose Team'}
            </Button>
          </article>
        </div>
      </section>
    </main>
  )
}
