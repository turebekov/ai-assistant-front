'use client'

import { useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'

export function AuthEntry() {
  const params = useSearchParams()
  const mode = params?.get('mode') === 'register' ? 'register' : 'login'
  return mode === 'register' ? <RegisterForm /> : <LoginForm />
}
