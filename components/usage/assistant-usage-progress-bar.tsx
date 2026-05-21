'use client'

import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { useAssistantUsageOptional } from '@/contexts/assistant-usage-context'
import { formatUsageMinutes, usagePercentUsed } from '@/lib/assistant-usage'
import { cn } from '@/lib/utils'
import { PAID_SUBSCRIPTIONS_ENABLED } from '@/lib/billing/config'

type AssistantUsageProgressBarProps = {
  className?: string
  /** Compact strip for profile header (assistant session pages). */
  variant?: 'banner' | 'header'
}

export function AssistantUsageProgressBar({
  className,
  variant = 'banner',
}: AssistantUsageProgressBarProps) {
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

  if (variant === 'header') {
    return (
      <div
        className={cn(
          'min-w-0 flex-1 flex-col gap-1',
          isDepleted && 'rounded-md bg-amber-50/90 px-2 py-1',
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 text-[11px] leading-tight">
          <span className={cn('truncate font-medium text-slate-600', isDepleted && 'text-amber-900')}>
            Assistant time
          </span>
          <span className={cn('shrink-0 text-muted-foreground', isDepleted && 'text-amber-800')}>
            {usedMinutes}/{limitMinutes} min
            {!isDepleted ? ` · ${remainingMinutes} left` : null}
          </span>
        </div>
        <Progress
          value={percent}
          className={cn('h-1.5', isDepleted && '[&_[data-slot=progress-indicator]]:bg-amber-600')}
        />
        {isDepleted ? (
          <p className="truncate text-[10px] text-amber-900">
            {PAID_SUBSCRIPTIONS_ENABLED ? (
              <>
                Limit reached —{' '}
                <Link href="/profile/subscription" className="font-semibold underline">
                  Upgrade
                </Link>
              </>
            ) : (
              <>Limit reached</>
            )}
          </p>
        ) : null}
      </div>
    )
  }

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
