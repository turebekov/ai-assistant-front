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
