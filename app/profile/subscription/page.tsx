'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type BackendPlan = 'free' | 'pro' | 'team'

type UiPlan = {
  id: string
  title: string
  priceLabel: string
  billingNote: string
  features: string[]
  backendPlan: BackendPlan
  cta: string
  highlighted?: boolean
  badge?: string
}

export default function ProfileSubscriptionPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [plans, setPlans] = useState<UiPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setPlansLoading(true)
      try {
        const response = await fetch('/api/subscription-plans')
        const payload = (await response.json().catch(() => ({}))) as { plans?: UiPlan[]; error?: string }
        if (!response.ok) {
          setStatus(payload.error || 'Cannot load subscription plans.')
          setPlans([])
          return
        }
        setPlans(Array.isArray(payload.plans) ? payload.plans : [])
      } catch {
        setStatus('Network error while loading plans.')
        setPlans([])
      } finally {
        setPlansLoading(false)
      }
    }
    void run()
  }, [])

  const choosePlan = async (plan: BackendPlan, planId: string) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setLoadingPlanId(planId)
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
      router.push('/profile/interview')
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground">Choose your plan.</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Pick the billing period that works best for you.
        </p>
        {status && <p className="mt-3 text-sm text-destructive">{status}</p>}

        {plansLoading ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading plans...</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex h-full flex-col rounded-2xl p-5 ${
                plan.highlighted
                  ? 'border-2 border-primary bg-primary/5 shadow-sm'
                  : 'border border-border bg-background'
              }`}
            >
              {plan.badge ? (
                <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </span>
              ) : null}
              <div className={`rounded-lg px-3 py-2 ${plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <div className={`text-sm font-semibold ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>{plan.title}</div>
                <div className={`text-3xl font-bold ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {plan.priceLabel}
                </div>
                <p className={`mt-1 text-xs ${plan.highlighted ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>{plan.billingNote}</p>
              </div>
              <ul className={`mt-4 min-h-28 flex-1 space-y-2 text-sm ${plan.highlighted ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
                onClick={() => choosePlan(plan.backendPlan, plan.id)}
                disabled={loadingPlanId !== null}
              >
                {loadingPlanId === plan.id ? 'Saving...' : plan.cta}
              </Button>
            </article>
          ))}
          </div>
        )}
      </section>
    </main>
  )
}

