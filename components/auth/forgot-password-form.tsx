'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiUrl } from '@/lib/api-url'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setError('Please enter a valid email.')
      return
    }

    setError('')
    setMessage('')
    setIsLoading(true)
    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string
        error?: string
      }
      if (!response.ok) {
        setError(payload.error || 'Could not send reset email.')
        return
      }
      setMessage(
        payload.message ||
          'If an account with this email exists, we sent a link to reset your password.'
      )
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="lg:hidden mb-8 flex justify-center">
        <JobTapLogo href="/" variant="light" iconSize={40} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-heading">Forgot password?</h1>
        <p className="mt-2 text-gray">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>

        {message && <p className="text-sm text-emerald-600 dark:text-emerald-500">{message}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      <p className="mt-6 text-center text-sm text-gray">
        <Link href="/auth" className="font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
