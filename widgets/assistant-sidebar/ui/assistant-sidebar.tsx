'use client'

import Link from 'next/link'
import { CreditCard, ExternalLink, LogOut, Monitor, Waves } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'

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
        <JobTapLogo href="/profile" variant="light" iconSize={32} />
      </div>
      <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground md:text-xs">Workspace</div>
      <nav className="mt-2 space-y-2 text-sm">
        <Link
          href="/profile/interview"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
            pathname.startsWith('/profile/interview')
              ? 'bg-primary font-medium text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Waves className="h-4 w-4" />
          Interview Assistant
        </Link>
        <Link
          href="/profile/meetings"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
            pathname.startsWith('/profile/meetings')
              ? 'bg-primary font-medium text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Monitor className="h-4 w-4" />
          Meetings AI Assistant
        </Link>
        <Link
          href="/profile/subscription"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
            pathname.startsWith('/profile/subscription')
              ? 'bg-primary font-medium text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Subscription Plans
        </Link>
        <a
          href="https://interviewquestionbank.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
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

