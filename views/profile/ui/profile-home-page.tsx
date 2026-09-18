'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'

type BackendPlan = 'free' | 'pro' | 'pro_claude' | 'team'

export function ProfileHomePage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [currentPlan, setCurrentPlan] = useState<BackendPlan>('free')
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null)
  const [openingPortal, setOpeningPortal] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) return
    const run = async () => {
      const meResponse = await fetch(apiUrl('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!meResponse.ok) return
      const mePayload = (await meResponse.json().catch(() => ({}))) as {
        user?: { plan?: string }
        access?: { plan?: string; currentPeriodEnd?: string | null }
      }
      const nextPlan = String(
        mePayload.user?.plan || mePayload.access?.plan || localStorage.getItem('auth_plan') || 'free'
      ).toLowerCase() as BackendPlan
      setCurrentPlan(nextPlan)
      setCurrentPeriodEnd(mePayload.access?.currentPeriodEnd ?? null)
    }
    void run()
  }, [])

  const formattedPeriodEnd = useMemo(() => {
    if (!currentPeriodEnd) return null
    const date = new Date(currentPeriodEnd)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }, [currentPeriodEnd])

  const manageSubscription = async () => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setOpeningPortal(true)
    try {
      const response = await fetch(apiUrl('/api/billing/lemonsqueezy/portal'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const payload = (await response.json().catch(() => ({}))) as {
        portalUrl?: string
        error?: string
      }
      if (!response.ok || !payload.portalUrl) {
        setStatus(payload.error || 'Cannot open the subscription portal.')
        return
      }
      window.open(payload.portalUrl, '_blank', 'noopener,noreferrer')
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setOpeningPortal(false)
    }
  }

  const deleteAccount = async () => {
    if (!window.confirm('Delete your account and all associated data? This action cannot be undone.')) {
      return
    }
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.push('/auth')
      return
    }
    setStatus('')
    setDeletingAccount(true)
    try {
      const response = await fetch(apiUrl('/api/auth/me'), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        setStatus(payload.error || 'Could not delete your account.')
        return
      }
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_plan')
      router.replace('/auth')
    } catch {
      setStatus('Network error. Please try again.')
    } finally {
      setDeletingAccount(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Welcome to your profile</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the shared sidebar to open Interview or Meetings assistant.
      </p>

      {status && <p className="mt-3 text-sm text-destructive">{status}</p>}

      {currentPlan !== 'free' && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Active subscription</div>
              <p className="mt-1 text-amber-800">
                {formattedPeriodEnd
                  ? `You keep access until ${formattedPeriodEnd}, even after cancelling.`
                  : 'You keep access until the end of the current billing period, even after cancelling.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" onClick={manageSubscription} disabled={openingPortal}>
                {openingPortal ? 'Opening...' : 'Manage subscription'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="text-sm font-semibold">Delete account</h3>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Permanently delete your account and associated data. This action cannot be undone.
        </p>
        <Button
          type="button"
          variant="destructive"
          className="mt-4"
          onClick={deleteAccount}
          disabled={deletingAccount}
        >
          {deletingAccount ? 'Deleting...' : 'Delete my account'}
        </Button>
      </div>
    </section>
  )
}

