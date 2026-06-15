const PROD_BACKEND_URL = 'https://ai-assistant-production-0f6a.up.railway.app'
const LOCAL_BACKEND_URL = 'http://localhost:4000'

/** HTTP base for Express API (localhost in dev, Railway on prod unless overridden). */
export function getBackendBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') return LOCAL_BACKEND_URL
  }

  return PROD_BACKEND_URL
}

/** WebSocket origin (`ws:` / `wss:`) matching {@link getBackendBaseUrl}. */
export function getBackendWsOrigin(): string {
  const asUrl = new URL(getBackendBaseUrl())
  asUrl.protocol = asUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  return asUrl.origin
}

export function apiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getBackendBaseUrl()}${normalizedPath}`
}

export function wsUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getBackendWsOrigin()}${normalizedPath}`
}
