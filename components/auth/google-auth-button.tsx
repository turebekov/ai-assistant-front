'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiUrl } from '@/lib/api-url'

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (opts: {
            client_id: string
            callback: (resp: { credential?: string }) => void
          }) => void
          renderButton: (parent: HTMLElement, options: Record<string, string>) => void
        }
      }
    }
  }
}

interface GoogleAuthButtonProps {
  plan: 'free' | 'pro' | 'team'
  mode: 'login' | 'register'
  onError: (message: string) => void
}

export function GoogleAuthButton({ plan, mode, onError }: GoogleAuthButtonProps) {
  const router = useRouter()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const scriptId = 'google-gsi-script'

    const ensureScript = async () => {
      if (window.google?.accounts?.id) return
      const exists = document.getElementById(scriptId) as HTMLScriptElement | null
      if (exists) {
        await new Promise<void>((resolve) => {
          if (window.google?.accounts?.id) resolve()
          else exists.addEventListener('load', () => resolve(), { once: true })
        })
        return
      }
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Google script failed to load'))
        document.head.appendChild(script)
      })
    }

    const init = async () => {
      try {
        await ensureScript()
        const cfgRes = await fetch(apiUrl('/api/public-config'))
        const cfg = (await cfgRes.json().catch(() => ({}))) as { googleClientId?: string }
        const clientId = String(cfg.googleClientId || '').trim()
        if (!clientId) {
          onError('Missing GOOGLE_CLIENT_ID on server.')
          return
        }
        const googleId = window.google?.accounts?.id
        if (!googleId || !wrapRef.current) {
          onError('Google Identity is unavailable.')
          return
        }
        wrapRef.current.innerHTML = ''
        googleId.initialize({
          client_id: clientId,
          callback: async (resp: { credential?: string }) => {
            const credential = String(resp.credential || '')
            if (!credential) {
              onError('Google login failed: missing credential.')
              return
            }
            try {
              const response = await fetch(apiUrl('/api/auth/google'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential, plan }),
              })
              const payload = (await response.json().catch(() => ({}))) as {
                token?: string
                access?: { hasSubscription?: boolean; plan?: string }
                error?: string
              }
              if (!response.ok || !payload.token) {
                onError(payload.error || 'Google authentication failed.')
                return
              }
              localStorage.setItem('auth_token', payload.token)
              if (payload.access?.plan) {
                localStorage.setItem('auth_plan', payload.access.plan)
              }
              router.push('/profile')
            } catch (error) {
              onError(`Google auth error: ${error instanceof Error ? error.message : String(error)}`)
            }
          },
        })
        googleId.renderButton(wrapRef.current, {
          type: 'standard',
          theme: 'outline',
          text: mode === 'register' ? 'signup_with' : 'signin_with',
          size: 'large',
          width: '390',
        })
        if (!cancelled) setReady(true)
      } catch (error) {
        onError(error instanceof Error ? error.message : String(error))
      }
    }

    void init()
    return () => {
      cancelled = true
    }
  }, [mode, onError, plan, router])

  return (
    <div className="space-y-2">
      <div ref={wrapRef} className="flex justify-center" />
      {!ready && <p className="text-center text-xs text-muted-foreground">Loading Google sign-in...</p>}
    </div>
  )
}
