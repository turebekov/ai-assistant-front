'use client'

import Link from 'next/link'
import { CreditCard, ExternalLink, LogOut, Monitor, Waves } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'
import { cn } from '@/lib/utils'

const SIDEBAR_LINK_BASE =
  'flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors duration-150'
const SIDEBAR_LINK_INACTIVE =
  'border-transparent text-nav hover:border-slate-200/80 hover:bg-muted/70 hover:text-nav-text-hover dark:text-slate-300 dark:hover:border-white/10 dark:hover:bg-white/[0.06] dark:hover:text-white'
const SIDEBAR_LINK_ACTIVE =
  'border-primary/40 bg-primary-light/90 font-semibold text-heading shadow-sm shadow-primary/[0.12] hover:bg-primary-light dark:border-primary/45 dark:bg-primary/18 dark:text-amber-50 dark:shadow-none'

interface AssistantSidebarProps {
  pathname: string
  sidebarOpen: boolean
  onSignOut: () => void
}

export function AssistantSidebar({
  pathname,
  sidebarOpen,
  onSignOut,
}: AssistantSidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 z-30 h-screen w-72 border-r border-border bg-card p-3 transition-transform md:static md:translate-x-0 md:p-4 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-4 px-1">
        <JobTapLogo href="/" variant="light" iconSize={32} />
      </div>
      <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:text-xs">Workspace</div>
      <nav className="mt-2 space-y-2 text-sm">
        <Link
          href="/profile/interview"
          className={cn(
            SIDEBAR_LINK_BASE,
            pathname.startsWith('/profile/interview') ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE,
          )}
        >
          <Waves className="h-4 w-4 shrink-0" />
          Interview Assistant
        </Link>
        <Link
          href="/profile/meetings"
          className={cn(
            SIDEBAR_LINK_BASE,
            pathname.startsWith('/profile/meetings') ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE,
          )}
        >
          <Monitor className="h-4 w-4 shrink-0" />
          Meetings AI Assistant
        </Link>
        <Link
          href="/profile/subscription"
          className={cn(
            SIDEBAR_LINK_BASE,
            pathname.startsWith('/profile/subscription') ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE,
          )}
        >
          <CreditCard className="h-4 w-4 shrink-0" />
          Subscription Plans
        </Link>
        <a
          href="https://interviewquestionbank.com/"
          target="_blank"
          rel="noreferrer noopener"
          className={cn(SIDEBAR_LINK_BASE, SIDEBAR_LINK_INACTIVE)}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Interview Question Bank
        </a>
      </nav>
      <button
        type="button"
        onClick={onSignOut}
        className="mt-4 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 md:mt-6"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}

