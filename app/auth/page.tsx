import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthEntry } from '@/components/auth/auth-entry'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.auth)

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
