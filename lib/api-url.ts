const PROD_BACKEND_URL = 'https://ai-assistant-production-0f6a.up.railway.app'
const LOCAL_BACKEND_URL = 'http://localhost:4000'

function defaultBackendBase() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') return LOCAL_BACKEND_URL
  }
  return PROD_BACKEND_URL
}

export function apiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  const explicit = process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL?.trim()
  const base = (explicit || defaultBackendBase()).replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}
