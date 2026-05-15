export type AssistantUsageQuota = {
  plan: string
  unlimited: boolean
  limitSeconds: number | null
  usedSeconds: number
  remainingSeconds: number | null
}

export function formatUsageMinutes(seconds: number) {
  return Math.max(0, Math.ceil(seconds / 60))
}

export function usagePercentUsed(quota: AssistantUsageQuota): number {
  if (quota.unlimited || !quota.limitSeconds) return 0
  const used = Math.min(quota.usedSeconds, quota.limitSeconds)
  return Math.min(100, Math.round((used / quota.limitSeconds) * 100))
}
