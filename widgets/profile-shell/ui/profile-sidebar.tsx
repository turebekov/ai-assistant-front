'use client'

import Link from 'next/link'
import { Briefcase, CreditCard, Home, LogOut, Video } from 'lucide-react'
import { JobTapLogo } from '@/components/brand/jobtap-logo'

interface ProfileSidebarProps {
  onSignOut: () => void
}

const topItems = [{ href: '/profile', label: 'Home', icon: Home }]
const assistantItems = [
  { href: '/profile/interview', label: 'Interview Assistant', icon: Briefcase },
  { href: '/profile/meetings', label: 'Meetings Assistant', icon: Video },
]
const bottomItems = [{ href: '/profile/subscription', label: 'Subscription', icon: CreditCard }]

export function ProfileSidebar({ onSignOut }: ProfileSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card p-4">
      <div className="mb-6">
        <JobTapLogo href="/" variant="light" iconSize={32} />
      </div>

      <nav className="space-y-1">
        {topItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        <div className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Assistants</div>
        {assistantItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
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

