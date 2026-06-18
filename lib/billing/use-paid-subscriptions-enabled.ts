'use client'

import { useEffect, useState } from 'react'
import { apiUrl } from '@/lib/api-url'
import { PAID_SUBSCRIPTIONS_ENABLED as BUILD_TIME_PAID_ENABLED } from '@/lib/billing/config'

/**
 * Paid billing flag from Railway (runtime). Falls back to NEXT_PUBLIC_* from the build.
 */
export function usePaidSubscriptionsEnabled(): boolean {
  const [enabled, setEnabled] = useState(BUILD_TIME_PAID_ENABLED)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(apiUrl('/api/subscription-plans'))
        const payload = (await response.json().catch(() => ({}))) as {
          paidSubscriptionsEnabled?: boolean
        }
        if (!cancelled && response.ok && typeof payload.paidSubscriptionsEnabled === 'boolean') {
          setEnabled(payload.paidSubscriptionsEnabled)
        }
      } catch {
        // keep build-time fallback
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return enabled
}
