'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AssistantSidebar } from '@/widgets/assistant-sidebar/ui/assistant-sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleUserRound, CreditCard, LogOut, MessageCircleQuestion, User } from 'lucide-react'
import { FeedbackSupportModal } from '@/widgets/feedback-support/ui/feedback-support-modal'

interface ProfileLayoutShellProps {
  children: React.ReactNode
}

interface AuthMeResponse {
  user?: { email?: string; plan?: string }
  access?: { plan?: string }
}

export function ProfileLayoutShell({ children }: ProfileLayoutShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('free')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('bug_report')
  const [feedbackDetails, setFeedbackDetails] = useState('')
  const [feedbackFollowUp, setFeedbackFollowUp] = useState(true)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')

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
        setPlan(
          String(
            mePayload.user?.plan ||
            mePayload.access?.plan ||
            localStorage.getItem('auth_plan') ||
            'free'
          ).toLowerCase()
        )
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

  const submitFeedback = async () => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      setFeedbackError('Please sign in again.')
      return
    }
    setFeedbackSubmitting(true)
    setFeedbackError('')
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: feedbackType,
          details: feedbackDetails,
          wantsFollowUp: feedbackFollowUp,
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) {
        setFeedbackError(payload.error || 'Failed to submit feedback.')
        return
      }
      setFeedbackOpen(false)
      setFeedbackDetails('')
      setFeedbackType('bug_report')
      setFeedbackFollowUp(true)
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  if (loading) {
    return <main className="p-6 text-sm text-muted-foreground">Loading profile...</main>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {sidebarOpen ? (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setFeedbackOpen(true)}
                aria-label="Feedback and Support"
                title="Feedback & Support"
              >
                <MessageCircleQuestion className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative">
                    <Button variant="outline" size="icon-sm" aria-label="Profile menu" title="Profile">
                      <CircleUserRound className="h-4 w-4" />
                    </Button>
                    <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {plan.toUpperCase()}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-xs text-muted-foreground">Signed in as</div>
                    <div className="truncate font-medium">{email || 'No email'}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-default">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="ml-1 capitalize">{plan}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile/subscription')}>
                    <CreditCard className="h-4 w-4" />
                    Change plan
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
      <FeedbackSupportModal
        open={feedbackOpen}
        feedbackType={feedbackType}
        feedbackDetails={feedbackDetails}
        feedbackFollowUp={feedbackFollowUp}
        feedbackSubmitting={feedbackSubmitting}
        feedbackError={feedbackError}
        onOpenChange={setFeedbackOpen}
        onFeedbackTypeChange={setFeedbackType}
        onFeedbackDetailsChange={setFeedbackDetails}
        onFeedbackFollowUpChange={setFeedbackFollowUp}
        onSubmit={() => void submitFeedback()}
      />
    </div>
  )
}

