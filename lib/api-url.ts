const PROD_BACKEND_URL = 'https://ai-assistant-production-0f6a.up.railway.app'
const LOCAL_BACKEND_URL = 'http://localhost:4000'

function isLocalBrowser(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

/** HTTP base for Express API (localhost in dev, Railway on prod unless overridden). */
export function getBackendBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  if (isLocalBrowser()) return LOCAL_BACKEND_URL

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
  if (isLocalBrowser() && !process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL?.trim()) {
    return normalizedPath
  }
  return `${getBackendBaseUrl()}${normalizedPath}`
}

export function wsUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getBackendWsOrigin()}${normalizedPath}`
}
