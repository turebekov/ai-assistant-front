/** Set NEXT_PUBLIC_PAID_SUBSCRIPTIONS_ENABLED=true when Lemon checkout is ready. */
export const PAID_SUBSCRIPTIONS_ENABLED =
  process.env.NEXT_PUBLIC_PAID_SUBSCRIPTIONS_ENABLED === 'true'

export function isPaidPlanBackend(plan: string) {
  return plan !== 'free'
}

export function isPlanAvailableForSignup(backendPlan: string) {
  if (backendPlan === 'free') return true
  return PAID_SUBSCRIPTIONS_ENABLED
}

/** User-facing plan label (no internal model or vendor names). */
export function formatPlanLabel(plan: string): string {
  const key = String(plan || 'free').toLowerCase()
  switch (key) {
    case 'pro':
      return 'Pro'
    case 'pro_claude':
      return 'Premium'
    case 'team':
      return 'Team'
    case 'free':
    default:
      return 'Free'
  }
}

export function formatPaidAmountUsd(plan: string): string | null {
  switch (String(plan || '').toLowerCase()) {
    case 'pro':
      return '$17.00 USD'
    case 'pro_claude':
      return '$25.00 USD'
    default:
      return null
  }
}
