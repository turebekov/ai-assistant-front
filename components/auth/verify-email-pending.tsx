'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2, Mail } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'

export function VerifyEmailPending() {
  const params = useSearchParams()
  const email = String(params?.get('email') || '').trim()
  const sendFailed = params?.get('sendFailed') === '1'
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('emailVerifySendError')
    if (stored) {
      setError(stored)
      sessionStorage.removeItem('emailVerifySendError')
      return
    }
    if (sendFailed) {
      setError('We could not send the confirmation email. Try resending or contact support.')
    }
  }, [sendFailed])

  const resend = async () => {
    if (!email) {
      setError('Email address is missing. Go back to registration and try again.')
      return
    }
    setError('')
    setStatus('')
    setIsSending(true)
    try {
      const response = await fetch(apiUrl('/api/auth/resend-verification'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const payload = (await response.json().catch(() => ({}))) as { message?: string; error?: string }
      if (!response.ok) {
        setError(payload.error || 'Could not resend verification email.')
        return
      }
      setStatus(payload.message || 'Verification email sent.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div>
      <div className="lg:hidden mb-8 flex justify-center">
        <JobTapLogo href="/" variant="light" iconSize={40} />
      </div>

      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <Mail className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-heading">Check your email</h1>
        <p className="mt-2 text-gray">
          We sent a confirmation link{email ? ` to ${email}` : ''}. Open it to activate your account.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          className="w-full h-11 rounded-full"
          onClick={() => void resend()}
          disabled={isSending || !email}
          variant="outline"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend confirmation email'
          )}
        </Button>
        {status && <p className="text-sm text-emerald-600 dark:text-emerald-500">{status}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <p className="mt-6 text-center text-sm text-gray">
        Already confirmed?{' '}
        <Link href="/auth" className="font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
