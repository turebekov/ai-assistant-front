'use client'

import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { useAssistantUsageOptional } from '@/contexts/assistant-usage-context'
import { formatUsageMinutes, usagePercentUsed } from '@/lib/assistant-usage'
import { cn } from '@/lib/utils'
import { PAID_SUBSCRIPTIONS_ENABLED } from '@/lib/billing/config'

type AssistantUsageProgressBarProps = {
  className?: string
}

export function AssistantUsageProgressBar({ className }: AssistantUsageProgressBarProps) {
  const ctx = useAssistantUsageOptional()
  if (!ctx || ctx.loading || !ctx.usage || ctx.usage.unlimited) {
    return null
  }

  const { usage } = ctx
  const limitSeconds = usage.limitSeconds ?? 3600
  const remainingSeconds = usage.remainingSeconds ?? 0
  const usedMinutes = formatUsageMinutes(usage.usedSeconds)
  const limitMinutes = formatUsageMinutes(limitSeconds)
  const remainingMinutes = formatUsageMinutes(remainingSeconds)
  const percent = usagePercentUsed(usage)
  const isDepleted = remainingSeconds <= 0

  return (
    <div
      className={cn(
        'border-b border-slate-200 bg-white px-4 py-2.5',
        isDepleted && 'bg-amber-50/80',
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <span className={cn('font-medium text-slate-700', isDepleted && 'text-amber-900')}>
            Free plan assistant time
          </span>
          <span className={cn('text-muted-foreground', isDepleted && 'text-amber-800')}>
            {usedMinutes} / {limitMinutes} min used
            {!isDepleted ? ` · ${remainingMinutes} min left` : null}
          </span>
        </div>
        <Progress
          value={percent}
          className={cn('h-2', isDepleted && '[&_[data-slot=progress-indicator]]:bg-amber-600')}
        />
        {isDepleted ? (
          <p className="text-xs text-amber-900">
            {PAID_SUBSCRIPTIONS_ENABLED ? (
              <>
                Limit reached.{' '}
                <Link href="/profile/subscription" className="font-semibold text-link underline hover:text-link-hover">
                  Upgrade your plan
                </Link>{' '}
                for unlimited assistant time.
              </>
            ) : (
              <>Free plan limit reached. Paid upgrades are coming soon.</>
            )}
          </p>
        ) : null}
      </div>
    </div>
  )
}
