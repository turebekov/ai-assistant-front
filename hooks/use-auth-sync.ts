'use client'

import { useEffect } from 'react'
import { apiUrl } from '@/lib/api-url'

/**
 * Syncs the user's current plan from the backend on component mount.
 * This ensures that localStorage has the latest plan after a subscription change.
 * Without this, users see cached 'free' plan even after upgrading.
 */
export function useAuthSync() {
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (cancelled) return

        const payload = (await response.json().catch(() => ({}))) as {
          token?: string
          user?: { plan?: string }
          access?: { plan?: string }
        }

        if (response.ok && payload.token) {
          localStorage.setItem('auth_token', payload.token)
        }

        const plan = payload.user?.plan || payload.access?.plan
        if (plan) {
          localStorage.setItem('auth_plan', plan)
        }
      } catch {
        // Silently ignore sync errors - localStorage will be used as fallback
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])
}
