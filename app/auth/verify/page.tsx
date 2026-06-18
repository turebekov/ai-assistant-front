import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { VerifyEmailToken } from '@/components/auth/verify-email-token'

export const metadata: Metadata = {
  title: 'Email verification',
  robots: { index: false, follow: false },
}

function Fallback() {
  return (
    <div
      className="mx-auto w-full max-w-md animate-pulse rounded-lg border border-border bg-muted/40 h-[280px]"
      aria-hidden
    />
  )
}

export default function VerifyTokenPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<Fallback />}>
        <VerifyEmailToken />
      </Suspense>
    </AuthLayout>
  )
}
