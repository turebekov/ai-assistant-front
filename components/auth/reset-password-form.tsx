'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { apiUrl } from '@/lib/api-url'

function ResetPasswordContent() {
  const router = useRouter()
  const params = useSearchParams()
  const token = String(params?.get('token') || '').trim()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrength = useMemo(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    }
    const score = Object.values(checks).filter(Boolean).length
    return { checks, score }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError('Reset link is invalid. Request a new password reset email.')
      return
    }
    if (passwordStrength.score < 3) {
      setError('Please create a stronger password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const payload = (await response.json().catch(() => ({}))) as {
        token?: string
        access?: { plan?: string }
        error?: string
        code?: string
      }
      if (!response.ok || !payload.token) {
        setError(payload.error || 'Password reset failed.')
        return
      }
      localStorage.setItem('auth_token', payload.token)
      if (payload.access?.plan) {
        localStorage.setItem('auth_plan', payload.access.plan)
      }
      router.push('/profile')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-heading">Invalid reset link</h1>
        <p className="mt-2 text-gray">This password reset link is missing or invalid.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="lg:hidden mb-8 flex justify-center">
        <JobTapLogo href="/" variant="light" iconSize={40} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-heading">Set a new password</h1>
        <p className="mt-2 text-gray">Choose a strong password for your JobTap account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-heading"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <ul className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                <li key={key} className={cn('flex items-center gap-1', passed ? 'text-success' : 'text-gray')}>
                  {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {key === 'length' && '8+ characters'}
                  {key === 'uppercase' && 'Uppercase'}
                  {key === 'lowercase' && 'Lowercase'}
                  {key === 'number' && 'Number'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full h-11 rounded-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Update password'
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
  )
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
