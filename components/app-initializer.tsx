'use client'

import { useEffect } from 'react'
import { apiUrl } from '@/lib/api-url'

/**
 * Root app initializer that syncs the user's auth state on app mount.
 * This runs once per app load and ensures plan is up-to-date before any page loads.
 */
export function AppInitializer() {
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
        // Silently ignore - will fallback to cached value
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
