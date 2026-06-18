'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'
import { cn } from '@/lib/utils'

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

function defaultSelectedPlanId(plans: UiPlan[], paidEnabled: boolean): string | null {
  const available = (plan: UiPlan) =>
    plan.available ?? (plan.backendPlan === 'free' || paidEnabled)
  const pick =
    plans.find((p) => p.highlighted && available(p)) ??
    plans.find((p) => p.backendPlan !== 'free' && available(p)) ??
    plans.find((p) => available(p))
  return pick?.id ?? null
}

export default function ProfileSubscriptionPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [plans, setPlans] = useState<UiPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [paidEnabled, setPaidEnabled] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
        const paid = payload.paidSubscriptionsEnabled === true
        const nextPlans = Array.isArray(payload.plans) ? payload.plans : []
        setPaidEnabled(paid)
        setPlans(nextPlans)
        setSelectedPlanId(defaultSelectedPlanId(nextPlans, paid))
      } catch {
        setStatus('Network error while loading plans.')
        setPlans([])
      } finally {
        setPlansLoading(false)
      }
    }
    void run()
  }, [])

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  )

  const isPlanAvailable = (plan: UiPlan) =>
    plan.available ?? (plan.backendPlan === 'free' || paidEnabled)

  const startLemonCheckout = async (planId: string) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setSubmitting(true)
    try {
      const response = await fetch(apiUrl('/api/billing/checkout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planCode: planId }),
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
      setSubmitting(false)
    }
  }

  const choosePlan = async (plan: BackendPlan) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setSubmitting(true)
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
      setSubmitting(false)
    }
  }

  const confirmSelection = () => {
    if (!selectedPlan) return
    if (!isPlanAvailable(selectedPlan)) {
      setStatus('Paid plans are coming soon. Please use the free plan for now.')
      return
    }
    if (selectedPlan.backendPlan === 'free') {
      void choosePlan('free')
      return
    }
    if (selectedPlan.id === 'month' || selectedPlan.id === 'month-claude') {
      void startLemonCheckout(selectedPlan.id)
      return
    }
    void choosePlan(selectedPlan.backendPlan)
  }

  const continueLabel = selectedPlan ? selectedPlan.cta : 'Choose a plan'

  const maxFeatureCount = useMemo(
    () => plans.reduce((max, plan) => Math.max(max, plan.features.length), 0),
    [plans]
  )

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground">Choose your plan.</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {paidEnabled
            ? 'Select a plan, then continue to checkout or start free.'
            : 'Only the free plan is available right now. Paid subscriptions are coming soon.'}
        </p>
        {status && <p className="mt-3 text-center text-sm text-destructive">{status}</p>}

        {plansLoading ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading plans...</p>
        ) : (
          <>
            <div
              className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3"
              role="radiogroup"
              aria-label="Subscription plans"
            >
              {plans.map((plan) => {
                const available = isPlanAvailable(plan)
                const selected = selectedPlanId === plan.id
                return (
                  <button
                    key={plan.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!available}
                    onClick={() => {
                      if (available) setSelectedPlanId(plan.id)
                    }}
                    className={cn(
                      'relative flex h-full min-h-[26rem] flex-col rounded-2xl border-2 p-5 text-left transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      !available && 'cursor-not-allowed opacity-75',
                      available && 'cursor-pointer hover:border-primary/40',
                      selected
                        ? 'border-primary bg-card shadow-md shadow-primary/10'
                        : plan.highlighted && available
                          ? 'border-primary/30 bg-background'
                          : 'border-border bg-background'
                    )}
                  >
                    {plan.badge ? (
                      <span
                        className={cn(
                          'absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-semibold',
                          available
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {plan.badge}
                      </span>
                    ) : null}

                    <span
                      className={cn(
                        'absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2',
                        selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                      )}
                      aria-hidden
                    >
                      {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                    </span>

                    <div
                      className={cn(
                        'mt-6 rounded-xl border px-3 py-2.5',
                        selected || plan.highlighted
                          ? 'border-primary/35 bg-gradient-to-br from-primary-light/80 via-background to-background text-heading'
                          : 'border-transparent bg-muted'
                      )}
                    >
                      <div className="text-sm font-semibold text-heading">{plan.title}</div>
                      <div
                        className={cn(
                          'text-3xl font-bold',
                          selected || plan.highlighted ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {plan.priceLabel}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{plan.billingNote}</p>
                    </div>

                    <ul
                      className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground"
                      style={{ minHeight: `${Math.max(maxFeatureCount, 5) * 1.625}rem` }}
                    >
                      {plan.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex h-24 flex-col items-center justify-start gap-2">
              <Button
                className="h-11 w-64 shrink-0 px-8"
                size="lg"
                onClick={confirmSelection}
                disabled={!selectedPlan || !isPlanAvailable(selectedPlan) || submitting}
              >
                <span className="block w-full truncate text-center">
                  {submitting ? 'Please wait...' : continueLabel}
                </span>
              </Button>
              <p className="h-5 w-64 truncate text-center text-xs text-muted-foreground">
                {selectedPlan && isPlanAvailable(selectedPlan)
                  ? `Selected: ${selectedPlan.title}`
                  : '\u00A0'}
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
