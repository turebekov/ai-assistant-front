'use client'

import Link from 'next/link'
import { LogOut, Monitor, Waves } from 'lucide-react'

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
    <aside className={`fixed left-0 top-0 z-30 h-screen w-72 border-r border-slate-200 bg-white p-4 transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-4 text-lg font-bold text-slate-900">AssistantAI</div>
      <div className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Assistant</div>
      <nav className="mt-2 space-y-2 text-sm">
        <Link
          href="/profile/interview"
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${
            pathname === '/profile/interview'
              ? 'bg-violet-600 font-medium text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Waves className="h-4 w-4" />
          Interview Assistant
        </Link>
        <Link
          href="/profile/meetings"
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${
            pathname === '/profile/meetings'
              ? 'bg-violet-600 font-medium text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Monitor className="h-4 w-4" />
          Meetings Assistant
        </Link>
      </nav>
      <button
        type="button"
        onClick={onSignOut}
        className="mt-6 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}

