'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiUrl } from '@/lib/api-url'
import type { AssistantUsageQuota } from '@/lib/assistant-usage'

type AssistantUsageContextValue = {
  usage: AssistantUsageQuota | null
  loading: boolean
  refresh: () => Promise<AssistantUsageQuota | null>
  setUsage: (quota: AssistantUsageQuota) => void
}

const AssistantUsageContext = createContext<AssistantUsageContextValue | null>(null)

export function AssistantUsageProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<AssistantUsageQuota | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async (): Promise<AssistantUsageQuota | null> => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      setUsage(null)
      setLoading(false)
      return null
    }
    try {
      const response = await fetch(apiUrl('/api/usage'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = (await response.json().catch(() => ({}))) as {
        usage?: AssistantUsageQuota
      }
      if (response.ok && payload.usage) {
        setUsage(payload.usage)
        return payload.usage
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
    return null
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ usage, loading, refresh, setUsage }),
    [usage, loading, refresh]
  )

  return (
    <AssistantUsageContext.Provider value={value}>{children}</AssistantUsageContext.Provider>
  )
}

export function useAssistantUsage() {
  const ctx = useContext(AssistantUsageContext)
  if (!ctx) {
    throw new Error('useAssistantUsage must be used within AssistantUsageProvider')
  }
  return ctx
}

export function useAssistantUsageOptional() {
  return useContext(AssistantUsageContext)
}
