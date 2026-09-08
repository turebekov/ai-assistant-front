'use client'

import { useEffect, useState } from 'react'
import { apiUrl } from '@/lib/api-url'

const TEST_USER_EMAIL_MARKER = 'turebekov'

/** Temporary prod testing gate: only this account should see paid subscription UI. Remove once fully launched. */
export function useIsTestPaidUser(): boolean {
  const [isTestUser, setIsTestUser] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) return

    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = (await response.json().catch(() => ({}))) as {
          user?: { email?: string }
        }
        const email = String(payload.user?.email || '').toLowerCase()
        if (!cancelled) {
          setIsTestUser(email.includes(TEST_USER_EMAIL_MARKER))
        }
      } catch {
        // keep default false
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return isTestUser
}
