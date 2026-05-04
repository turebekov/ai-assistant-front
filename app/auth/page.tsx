import { Suspense } from 'react'
import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthEntry } from '@/components/auth/auth-entry'

export const metadata: Metadata = {
  title: 'Sign In - AssistantAI',
  description: 'Sign in to your AssistantAI account.',
}

function AuthFormFallback() {
  return (
    <div
      className="mx-auto w-full max-w-md animate-pulse rounded-lg border border-border bg-muted/40 h-[420px]"
      aria-hidden
    />
  )
}

export default function AuthPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<AuthFormFallback />}>
        <AuthEntry />
      </Suspense>
    </AuthLayout>
  )
}
