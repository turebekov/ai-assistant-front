import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { VerifyEmailPending } from '@/components/auth/verify-email-pending'

export const metadata: Metadata = {
  title: 'Confirm your email',
  robots: { index: false, follow: false },
}

function Fallback() {
  return (
    <div
      className="mx-auto w-full max-w-md animate-pulse rounded-lg border border-border bg-muted/40 h-[320px]"
      aria-hidden
    />
  )
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<Fallback />}>
        <VerifyEmailPending />
      </Suspense>
    </AuthLayout>
  )
}
