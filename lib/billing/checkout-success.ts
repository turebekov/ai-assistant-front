/** Paths for Lemon Squeezy post-checkout redirects (configure in product settings). */
export const CHECKOUT_SUCCESS_PATH = '/profile/subscription/success'
export const CHECKOUT_CANCELLED_PATH = '/profile/subscription/cancelled'

export function checkoutSuccessUrl(origin: string): string {
  return `${origin.replace(/\/$/, '')}${CHECKOUT_SUCCESS_PATH}`
}

export function checkoutCancelledUrl(origin: string): string {
  return `${origin.replace(/\/$/, '')}${CHECKOUT_CANCELLED_PATH}`
}
