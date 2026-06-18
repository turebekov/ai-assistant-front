'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'

type BackendPlan = 'free' | 'pro' | 'pro_claude' | 'team'

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
  available?: boolean
}

export default function ProfileSubscriptionPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [info, setInfo] = useState('')
  const [plans, setPlans] = useState<UiPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [paidEnabled, setPaidEnabled] = useState(false)
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setPlansLoading(true)
      try {
        const response = await fetch(apiUrl('/api/subscription-plans'))
        const payload = (await response.json().catch(() => ({}))) as {
          plans?: UiPlan[]
          paidSubscriptionsEnabled?: boolean
          error?: string
        }
        if (!response.ok) {
          setStatus(payload.error || 'Cannot load subscription plans.')
          setPlans([])
          setPaidEnabled(false)
          return
        }
        setPaidEnabled(payload.paidSubscriptionsEnabled === true)
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') !== 'success') return

    const token = localStorage.getItem('auth_token') || ''
    if (!token) return

    let cancelled = false
    void (async () => {
      let authToken = token
      for (let attempt = 0; attempt < 6; attempt++) {
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
              setInfo('Subscription is active. You can use paid features.')
              router.replace('/profile/subscription')
            }
            return
          }
        }
        await new Promise((r) => setTimeout(r, 1500))
      }
      if (!cancelled) {
        setInfo('If your plan is not updated yet, wait a minute and refresh the page (webhook may be delayed).')
        router.replace('/profile/subscription')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [router])

  const startLemonCheckout = async (planId: string) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setLoadingPlanId(planId)
    try {
      const response = await fetch(apiUrl('/api/billing/checkout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planCode: planId,
          returnUrl: `${window.location.origin}/profile/subscription?checkout=success`,
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as {
        checkoutUrl?: string
        error?: string
      }
      if (!response.ok || !payload.checkoutUrl) {
        setStatus(payload.error || 'Cannot start checkout.')
        return
      }
      window.location.href = payload.checkoutUrl
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setLoadingPlanId(null)
    }
  }

  const choosePlan = async (plan: BackendPlan, planId: string) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setLoadingPlanId(planId)
    try {
      const response = await fetch(apiUrl('/api/auth/plan'), {
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

  const onPlanCta = (plan: UiPlan) => {
    const available = plan.available ?? (plan.backendPlan === 'free' || paidEnabled)
    if (!available) {
      setStatus('Paid plans are coming soon. Please use the free plan for now.')
      return
    }
    if (plan.backendPlan === 'free') {
      void choosePlan('free', plan.id)
      return
    }
    if (plan.id === 'month' || plan.id === 'month-claude') {
      void startLemonCheckout(plan.id)
      return
    }
    void choosePlan(plan.backendPlan, plan.id)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground">Choose your plan.</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {paidEnabled
            ? 'Choose the monthly plan that fits your interview workflow.'
            : 'Only the free plan is available right now. Paid subscriptions are coming soon.'}
        </p>
        {info && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-500">{info}</p>}
        {status && <p className="mt-3 text-sm text-destructive">{status}</p>}

        {plansLoading ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading plans...</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const available =
              plan.available ?? (plan.backendPlan === 'free' || paidEnabled)
            return (
            <article
              key={plan.id}
              className={`relative flex h-full flex-col rounded-2xl p-5 ${
                !available ? 'opacity-75 ' : ''
              }${
                plan.highlighted && available
                  ? 'border-2 border-primary bg-card shadow-md shadow-primary/10'
                  : 'border border-border bg-background'
              }`}
            >
              {plan.badge ? (
                <span
                  className={`absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-semibold ${
                    available
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {plan.badge}
                </span>
              ) : null}
              <div
                className={`rounded-xl border px-3 py-2.5 ${
                  plan.highlighted
                    ? 'border-primary/35 bg-gradient-to-br from-primary-light/80 via-background to-background text-heading'
                    : 'border-transparent bg-muted'
                }`}
              >
                <div className="text-sm font-semibold text-heading">{plan.title}</div>
                <div className={`text-3xl font-bold ${plan.highlighted ? 'text-primary' : 'text-foreground'}`}>
                  {plan.priceLabel}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{plan.billingNote}</p>
              </div>
              <ul className="mt-4 min-h-28 flex-1 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={available ? 'default' : 'neutral'}
                onClick={() => onPlanCta(plan)}
                disabled={!available || loadingPlanId !== null}
              >
                {loadingPlanId === plan.id ? 'Saving...' : plan.cta}
              </Button>
            </article>
          )})}
          </div>
        )}
      </section>
    </main>
  )
}

