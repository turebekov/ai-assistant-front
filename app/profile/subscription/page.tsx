'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ClipboardCopy } from 'lucide-react'
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
  const [copied, setCopied] = useState(false)

  const getOptionLabel = () => 'Code Assistant'

  const getHeaderBackground = (index: number) => {
    if (index === 1) {
      return {
        backgroundColor: '#0d3b8c',
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%), repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 12px, rgba(255,255,255,0) 12px, rgba(255,255,255,0) 28px), linear-gradient(180deg, #0d3b8c 0%, #0b2d7d 100%)",
        color: '#fff',
      }
    }

    if (index === 2) {
      return {
        backgroundColor: '#071e5d',
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%), repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 12px, rgba(255,255,255,0) 12px, rgba(255,255,255,0) 28px), linear-gradient(180deg, #0a1d4a 0%, #071e5d 100%)",
        color: '#fff',
      }
    }

    return {
      backgroundColor: '#edf3ff',
      backgroundImage:
        "linear-gradient(135deg, rgba(13,59,140,0.06) 0%, rgba(13,59,140,0) 32%), repeating-linear-gradient(135deg, rgba(13,59,140,0.08) 0px, rgba(13,59,140,0.08) 12px, rgba(13,59,140,0) 12px, rgba(13,59,140,0) 28px), linear-gradient(180deg, #edf3ff 0%, #dfe8fb 100%)",
      color: '#0f172a',
    }
  }

  const discountCode = 'K0NJA4NW'

  const copyDiscountCode = async () => {
    try {
      await navigator.clipboard.writeText(discountCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setStatus('Unable to copy code automatically. Please copy it manually.')
    }
  }

  return (
    <main className="min-h-screen bg-background px-2 py-1">
      <section className="mx-auto max-w-[980px] rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground">Choose your plan.</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {paidEnabled
            ? 'Select a plan, then continue to checkout or start free.'
            : 'Only the free plan is available right now. Paid subscriptions are coming soon.'}
        </p>
        {status && <p className="mt-3 text-center text-sm text-destructive">{status}</p>}
        <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 sm:flex-row sm:justify-between">
          <p className="font-medium">
            Use discount code <span className="font-semibold">{discountCode}</span> for 50% off paid plans.
          </p>
          <Button size="sm" variant="secondary" onClick={copyDiscountCode} type="button">
            <ClipboardCopy className="mr-2 h-4 w-4" />
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        {plansLoading ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Loading plans...</p>
        ) : (
          <>
            <div
              className="mt-8 grid grid-cols-1 items-stretch justify-center gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
              role="radiogroup"
              aria-label="Subscription plans"
            >
              {plans.map((plan, index) => {
                const available = isPlanAvailable(plan)
                const selected = selectedPlanId === plan.id
                const headerStyles = getHeaderBackground(index)
                const featureItems = [
                  ...plan.features,
                  ...(plan.backendPlan === 'free' ? [getOptionLabel()] : []),
                ]

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
                      'relative mx-auto flex h-full min-h-[22rem] w-full max-w-[330px] flex-col overflow-visible rounded-[10px] border border-[#dfe7f5] bg-white p-1 text-left transition-all duration-200 sm:max-w-[250px] md:max-w-[270px] lg:max-w-[290px] xl:max-w-[300px]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      !available && 'cursor-not-allowed opacity-75',
                      available && 'cursor-pointer hover:shadow-md',
                      selected && 'border-[#244DB8] shadow-[0_0_0_2px_rgba(36,77,184,0.15)]'
                    )}
                  >
                    {plan.badge || index === 1 ? (
                      <span
                        className={cn(
                          'absolute left-[-82px] top-[-11px] z-10 rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] md:left-auto md:right-[5%]',
                          index === 1 ? 'bg-[#f6a623] text-[#0b163d]' : 'bg-[#f3f4f6] text-[#0b163d]',
                          !available && 'opacity-70'
                        )}
                      >
                        {plan.badge || 'Popular plan'}
                      </span>
                    ) : null}

                    <div
                      className="rounded-[6px] px-3 py-3"
                      style={{ ...headerStyles, borderRadius: '6px' }}
                    >
                      <div className="min-w-0">
                        <p className="m-0 text-[0.95rem] font-semibold leading-6 text-current">{plan.title}</p>
                        <p className="mt-1 text-[10px] text-current/80">{plan.billingNote}</p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-2.5 pb-3 pt-3">
                      <ul className="space-y-3 text-sm text-[#1f2a3a]">
                        {featureItems.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 leading-5">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[#1d5ce6]">
                              <Check className="h-4 w-4" strokeWidth={2.8} />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-3">
                        <div className="flex items-center justify-center rounded-[6px] bg-[#f3f6fb] px-3 py-3 text-base font-semibold text-[#0f172a]">
                          {plan.priceLabel}
                        </div>
                      </div>
                    </div>
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
