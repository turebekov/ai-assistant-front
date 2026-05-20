'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { apiUrl } from '@/lib/api-url'

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    terms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

  const passwordStrength = useMemo(() => {
    const { password } = formData
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    }
    const score = Object.values(checks).filter(Boolean).length
    return { checks, score }
  }, [formData.password])

  const getStrengthLabel = () => {
    if (passwordStrength.score === 0) return ''
    if (passwordStrength.score <= 1) return 'Weak'
    if (passwordStrength.score <= 2) return 'Fair'
    if (passwordStrength.score <= 3) return 'Good'
    return 'Strong'
  }

  const getStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'bg-destructive'
    if (passwordStrength.score <= 2) return 'bg-warning'
    if (passwordStrength.score <= 3) return 'bg-primary'
    return 'bg-success'
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Please create a stronger password'
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setServerError('')
    setIsLoading(true)
    try {
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          plan: 'free',
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as {
        token?: string
        access?: { hasSubscription?: boolean; plan?: string }
        error?: string
      }
      if (!response.ok || !payload.token) {
        setServerError(payload.error || 'Registration failed.')
        return
      }
      localStorage.setItem('auth_token', payload.token)
      if (payload.access?.plan) {
        localStorage.setItem('auth_plan', payload.access.plan)
      }
      router.push('/profile')
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div>
      <div className="lg:hidden mb-8 flex justify-center">
        <JobTapLogo href="/" variant="light" iconSize={40} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-heading">Create your account</h1>
        <p className="mt-2 text-gray">Start for free — no credit card required</p>
      </div>

      <GoogleAuthButton mode="register" plan="free" onError={setServerError} />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-gray">or continue with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className={errors.firstName ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={errors.lastName ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-heading"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full transition-all', getStrengthColor())}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray">{getStrengthLabel()}</span>
              </div>
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
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={formData.terms}
            onCheckedChange={(checked) => updateField('terms', checked === true)}
            disabled={isLoading}
          />
          <Label htmlFor="terms" className="text-sm text-gray leading-tight cursor-pointer">
            I agree to the{' '}
            <Link href="/document/terms" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/document/policy" className="hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms}</p>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-primary text-base font-medium leading-none text-primary-foreground shadow-none hover:bg-primary-hover"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray">
        Already have an account?{' '}
        <Link href="/auth" className="font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
