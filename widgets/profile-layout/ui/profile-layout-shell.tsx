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
import { ArrowLeft, CircleUserRound, CreditCard, LogOut, MessageCircleQuestion, User } from 'lucide-react'
import { FeedbackSupportModal } from '@/widgets/feedback-support/ui/feedback-support-modal'
import { apiUrl } from '@/lib/api-url'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { AssistantUsageProvider } from '@/contexts/assistant-usage-context'
import { AssistantUsageProgressBar } from '@/components/usage/assistant-usage-progress-bar'
import { formatPlanLabel } from '@/lib/billing/config'
import { cn } from '@/lib/utils'

interface ProfileLayoutShellProps {
  children: React.ReactNode
}

interface AuthMeResponse {
  token?: string
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

  const isAssistantSession = useMemo(
    () => /^\/profile\/(interview|meetings)\/[^/]+$/.test(pathname || ''),
    [pathname]
  )
  const isAssistantArea = useMemo(
    () => /^\/profile\/(interview|meetings)(\/|$)/.test(pathname || ''),
    [pathname]
  )
  const assistantSessionBackHref = useMemo(() => {
    if (pathname?.includes('/profile/meetings/')) return '/profile/meetings'
    return '/profile/interview'
  }, [pathname])

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
        const meRes = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const mePayload = (await meRes.json().catch(() => ({}))) as AuthMeResponse
        if (!meRes.ok) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_plan')
          router.replace('/auth')
          return
        }
        if (mePayload.token) {
          localStorage.setItem('auth_token', mePayload.token)
        }
        setEmail(String(mePayload.user?.email || ''))
        const nextPlan = String(
          mePayload.user?.plan ||
            mePayload.access?.plan ||
            localStorage.getItem('auth_plan') ||
            'free'
        ).toLowerCase()
        setPlan(nextPlan)
        if (mePayload.access?.plan) {
          localStorage.setItem('auth_plan', mePayload.access.plan)
        }
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
      const response = await fetch(apiUrl('/api/feedback'), {
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

  const profileHeaderActions = (
    <div className="ml-auto flex shrink-0 items-center gap-2">
      <Button
        variant="neutral"
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
            <Button variant="neutral" size="icon-sm" aria-label="Profile menu" title="Profile">
              <CircleUserRound className="h-4 w-4" />
            </Button>
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm shadow-primary/35">
              {formatPlanLabel(plan)}
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
            <span className="ml-1 font-semibold text-primary">{formatPlanLabel(plan)}</span>
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
  )

  const profileHeader = (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          {isAssistantSession ? (
            <Button
              variant="neutral"
              size="icon-sm"
              aria-label="Back to assistants"
              title="Back to assistants"
              onClick={() => router.push(assistantSessionBackHref)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <button
              type="button"
              className="rounded-full border border-gray-700/45 px-2 py-1 text-sm text-gray-800 hover:bg-gray-900/[0.06] md:hidden dark:border-gray-500 dark:text-gray-100 dark:hover:bg-white/10"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              ☰
            </button>
          )}
          <JobTapLogo
            href="/"
            variant="light"
            iconSize={28}
            className={cn('shrink-0', !isAssistantSession && 'md:hidden')}
          />
          <h1 className="truncate text-lg font-semibold text-slate-900">{pageTitle}</h1>
        </div>
        {isAssistantSession ? (
          <AssistantUsageProgressBar variant="header" className="hidden min-w-0 flex-1 md:flex" />
        ) : null}
        {profileHeaderActions}
      </div>
      {isAssistantSession ? (
        <div className="border-t border-slate-100 px-4 py-2 md:hidden">
          <AssistantUsageProgressBar variant="header" className="flex w-full" />
        </div>
      ) : null}
    </header>
  )

  const mainClassName = isAssistantSession ? 'p-2 md:p-3' : 'p-4 md:p-6'

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {!isAssistantSession && sidebarOpen ? (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
        {!isAssistantSession ? (
          <AssistantSidebar
            pathname={pathname || ''}
            sidebarOpen={sidebarOpen}
            onSignOut={signOut}
          />
        ) : null}
        <div
          className={cn(
            'flex flex-1 flex-col md:ml-0',
            isAssistantSession && 'min-h-0'
          )}
        >
          {isAssistantArea ? (
            <AssistantUsageProvider>
              {profileHeader}
              <main
                className={cn(
                  mainClassName,
                  isAssistantSession && 'flex min-h-0 flex-1 flex-col overflow-hidden'
                )}
              >
                {children}
              </main>
            </AssistantUsageProvider>
          ) : (
            <>
              {profileHeader}
              <main className={mainClassName}>{children}</main>
            </>
          )}
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
