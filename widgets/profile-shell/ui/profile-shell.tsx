'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileHeader } from './profile-header'
import { ProfileSidebar } from './profile-sidebar'

interface AuthMeResponse {
  user?: { email?: string }
  error?: string
}

export function ProfileShell() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      router.replace('/auth')
      return
    }

    const run = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = (await response.json().catch(() => ({}))) as AuthMeResponse
        if (!response.ok) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_plan')
          router.replace('/auth')
          return
        }
        setEmail(String(payload.user?.email || ''))
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
        <ProfileSidebar onSignOut={signOut} />
        <div className="flex-1">
          <ProfileHeader email={email} />
          <main className="p-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">Welcome to your profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This is your main profile page. Use sidebar to open interview assistant or subscription.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

