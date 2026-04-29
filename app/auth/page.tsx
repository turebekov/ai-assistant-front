import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthEntry } from '@/components/auth/auth-entry'

export const metadata: Metadata = {
  title: 'Sign In - AssistantAI',
  description: 'Sign in to your AssistantAI account.',
}

export default function AuthPage() {
  return (
    <AuthLayout>
      <AuthEntry />
    </AuthLayout>
  )
}
