'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'

function VerifyEmailContent() {
  const router = useRouter()
  const params = useSearchParams()
  const token = String(params?.get('token') || '').trim()
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Verification link is invalid.')
      return
    }

    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(
          apiUrl(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
        )
        const payload = (await response.json().catch(() => ({}))) as {
          token?: string
          access?: { plan?: string }
          error?: string
          code?: string
        }
        if (!response.ok || !payload.token) {
          if (!cancelled) {
            setState('error')
            setMessage(payload.error || 'Verification failed.')
          }
          return
        }
        localStorage.setItem('auth_token', payload.token)
        if (payload.access?.plan) {
          localStorage.setItem('auth_plan', payload.access.plan)
        }
        if (!cancelled) {
          setState('success')
          setMessage('Your email is confirmed. Redirecting to your account...')
          window.setTimeout(() => router.replace('/profile'), 1500)
        }
      } catch {
        if (!cancelled) {
          setState('error')
          setMessage('Network error. Please try again.')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [router, token])

  return (
    <div>
      <div className="lg:hidden mb-8 flex justify-center">
        <JobTapLogo href="/" variant="light" iconSize={40} />
      </div>

      <div className="text-center mb-8">
        {state === 'loading' && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="mt-4 text-2xl font-bold text-heading">Verifying your email</h1>
            <p className="mt-2 text-gray">Please wait a moment...</p>
          </>
        )}
        {state === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <h1 className="mt-4 text-2xl font-bold text-heading">Email confirmed</h1>
            <p className="mt-2 text-gray">{message}</p>
          </>
        )}
        {state === 'error' && (
          <>
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold text-heading">Verification failed</h1>
            <p className="mt-2 text-gray">{message}</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/auth">Back to sign in</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export function VerifyEmailToken() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
