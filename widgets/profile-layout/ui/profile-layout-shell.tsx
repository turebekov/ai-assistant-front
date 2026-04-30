'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AssistantSidebar } from '@/widgets/assistant-sidebar/ui/assistant-sidebar'

interface ProfileLayoutShellProps {
  children: React.ReactNode
}

interface AuthMeResponse {
  user?: { email?: string }
}

export function ProfileLayoutShell({ children }: ProfileLayoutShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => {
    if (pathname?.includes('/profile/interview')) return 'Interview Assistant'
    if (pathname?.includes('/profile/meetings')) return 'Meetings Assistant'
    if (pathname?.includes('/profile/subscription')) return 'Subscription'
    return 'Profile'
  }, [pathname])

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.replace('/auth')
      return
    }
    const run = async () => {
      try {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const mePayload = (await meRes.json().catch(() => ({}))) as AuthMeResponse
        if (!meRes.ok) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_plan')
          router.replace('/auth')
          return
        }
        setEmail(String(mePayload.user?.email || ''))
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [router])

  const signOut = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_plan')
    router.push('/auth')
  }

  if (loading) {
    return <main className="p-6 text-sm text-muted-foreground">Loading profile...</main>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <AssistantSidebar
          pathname={pathname || ''}
          sidebarOpen={sidebarOpen}
          onSignOut={signOut}
        />
        <div className="flex-1 md:ml-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
            <div className="flex items-center gap-3">
              <button className="rounded border border-slate-200 px-2 py-1 text-sm md:hidden" onClick={() => setSidebarOpen((v) => !v)}>
                ☰
              </button>
              <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
            </div>
            <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {email || 'No email'}
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

