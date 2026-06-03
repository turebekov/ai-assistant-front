'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronsRight, CircleHelp, Download, FileText, MonitorUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { AssistantProfile } from '@/entities/assistant/model/types'
import { useAssistantUsage } from '@/contexts/assistant-usage-context'
import { apiUrl } from '@/lib/api-url'
import { PAID_SUBSCRIPTIONS_ENABLED } from '@/lib/billing/config'
import type { AssistantUsageQuota } from '@/lib/assistant-usage'
import {
  DEFAULT_LANGUAGE_CODE,
  normalizeInterviewLanguage,
  toFormLanguageValue,
  type SupportedLanguageCode,
} from '@/lib/languages'
import { cn } from '@/lib/utils'

type Pipeline = 'realtime_asr' | 'realtime_translate' | 'http'
type SessionSummary = {
  id: string
  createdAt: string
  role: string
  language: string
  transcript: string
  suggestion: string
}

function backendWsBase() {
  const raw =
    process.env.NEXT_PUBLIC_EXPRESS_BACKEND_URL?.trim() ||
    'http://localhost:4000'
  const asUrl = new URL(raw)
  asUrl.protocol = asUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  return asUrl.origin
}

function tailText(lines: string[], maxChars = 1000) {
  const joined = lines.join('\n').trim()
  return joined.length <= maxChars ? joined : joined.slice(-maxChars)
}

function escapeHtml(value: string) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatSuggestion(text: string) {
  const escaped = escapeHtml(text)
  const withStrong = escaped
    .replace(/^#{2,3}\s+(.+)$/gm, '<strong>$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '• $1')
  return withStrong.replace(/\n/g, '<br />')
}

function looksLikeQuestion(line: string) {
  const text = line.trim().toLowerCase()
  if (!text) return false
  if (text.includes('?') || text.includes('？')) return true
  return /^(why|what|how|when|where|who|which|can|could|would|do|did|are|is|tell me|explain|почему|как|что|когда|зачем|где|можете|можешь|расскажите|расскажи|объясните|объясни|неге|қалай|қандай|не|қайда)\b/.test(text)
}

export function InterviewClient({
  settingsId,
  mode = 'interview',
}: {
  settingsId?: string
  mode?: 'interview' | 'meetings'
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { usage, refresh, setUsage } = useAssistantUsage()
  const [isHydrated, setIsHydrated] = useState(false)
  const [pipeline, setPipeline] = useState<Pipeline>('realtime_asr')
  const [status, setStatus] = useState('Idle')
  const [transcriptLines, setTranscriptLines] = useState<string[]>([])
  const [transcriptLineTimestamps, setTranscriptLineTimestamps] = useState<number[]>([])
  const [partial, setPartial] = useState('')
  const [suggestionPrimaryHistory, setSuggestionPrimaryHistory] = useState<string[]>([])
  const [suggestionClaudeHistory, setSuggestionClaudeHistory] = useState<string[]>([])
  const [resumeText, setResumeText] = useState('')
  const [resumeStatus, setResumeStatus] = useState('No resume')
  const [role, setRole] = useState('general')
  const [targetPosition, setTargetPosition] = useState('')
  const [transcriptLanguage, setTranscriptLanguage] = useState('auto')
  const [translateTarget, setTranslateTarget] =
    useState<SupportedLanguageCode>(DEFAULT_LANGUAGE_CODE)
  const [primaryInterviewLanguage, setPrimaryInterviewLanguage] =
    useState<SupportedLanguageCode>(DEFAULT_LANGUAGE_CODE)
  const [isRunning, setIsRunning] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [isSessionSaving, setIsSessionSaving] = useState(false)
  const [history, setHistory] = useState<
    SessionSummary[]
  >([])
  const [sentLineIndexes, setSentLineIndexes] = useState<Set<number>>(new Set())
  const [activeAssistant, setActiveAssistant] = useState<AssistantProfile | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const previewRef = useRef<HTMLVideoElement | null>(null)
  const transcriptScrollRef = useRef<HTMLDivElement | null>(null)
  const quietTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSuggestedKeyRef = useRef('')
  const suggestionInFlightRef = useRef(false)
  const [enableClaudeSuggestion, setEnableClaudeSuggestion] = useState(false)
  const [sessionSidebarOpen, setSessionSidebarOpen] = useState(false)
  const captureStartedAtRef = useRef<number | null>(null)
  const reportedCaptureSecondsRef = useRef(0)
  const usageTickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stopCaptureRef = useRef<(() => void) | null>(null)
  const SUGGEST_RECENT_LINES = 24
  const SUGGEST_SPLIT_PAUSE_MS = 4000

  const transcriptText = useMemo(
    () => `${transcriptLines.join('\n')}${partial ? `\n${partial}` : ''}`.trim(),
    [partial, transcriptLines]
  )

  const downloadTranscript = useCallback(() => {
    const text = transcriptText.trim()
    if (!text) return
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mode}-transcript-${stamp}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [mode, transcriptText])

  useEffect(() => {
    const el = transcriptScrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [partial, transcriptLines])

  const stopRealtime = () => {
    try {
      processorRef.current?.disconnect()
      sourceRef.current?.disconnect()
      audioCtxRef.current?.close()
    } catch {
      // ignore cleanup errors
    }
    processorRef.current = null
    sourceRef.current = null
    audioCtxRef.current = null
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'finish' }))
      wsRef.current.close()
    }
    wsRef.current = null
  }

  const flushCaptureUsage = useCallback(async (): Promise<boolean> => {
    if (captureStartedAtRef.current === null) return false
    const totalElapsed = Math.floor((Date.now() - captureStartedAtRef.current) / 1000)
    const delta = totalElapsed - reportedCaptureSecondsRef.current
    if (delta <= 0) return false

    const token = localStorage.getItem('auth_token') || ''
    if (!token) return false

    try {
      const response = await fetch(apiUrl('/api/usage/report'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seconds: delta }),
      })
      const payload = (await response.json().catch(() => ({}))) as { usage?: AssistantUsageQuota }
      reportedCaptureSecondsRef.current += delta
      if (response.ok && payload.usage) {
        setUsage(payload.usage)
        if (!payload.usage.unlimited && (payload.usage.remainingSeconds ?? 0) <= 0) {
          return true
        }
      }
    } catch {
      // ignore report errors
    }
    return false
  }, [setUsage])

  const clearUsageTick = useCallback(() => {
    if (usageTickRef.current) {
      clearInterval(usageTickRef.current)
      usageTickRef.current = null
    }
  }, [])

  const stopCapture = useCallback(() => {
    void (async () => {
      clearUsageTick()
      const limitReached = await flushCaptureUsage()
      captureStartedAtRef.current = null
      reportedCaptureSecondsRef.current = 0

      stopRealtime()
      if (quietTimerRef.current) {
        clearTimeout(quietTimerRef.current)
        quietTimerRef.current = null
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      mediaRecorderRef.current = null
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      streamRef.current = null
      if (previewRef.current) previewRef.current.srcObject = null
      setPartial('')
      setIsRunning(false)
      setStatus(
        limitReached
          ? PAID_SUBSCRIPTIONS_ENABLED
            ? 'Free plan limit reached (60 minutes). Upgrade to continue.'
            : 'Free plan limit reached (60 minutes). Paid upgrades are coming soon.'
          : 'Stopped'
      )
      void refresh()
    })()
  }, [clearUsageTick, flushCaptureUsage, refresh])

  stopCaptureRef.current = stopCapture

  const cleanupCaptureResources = useCallback(() => {
    stopRealtime()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    mediaRecorderRef.current = null
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    streamRef.current = null
    if (previewRef.current) previewRef.current.srcObject = null
    setPartial('')
    setIsRunning(false)
  }, [])

  const pushLine = (line: string) => {
    const clean = String(line || '').trim()
    if (!clean) return
    setTranscriptLines((prev) => [...prev, clean].slice(-500))
    setTranscriptLineTimestamps((prev) => [...prev, Date.now()].slice(-500))
  }

  const pushSuggestion = useCallback((history: string[], value: string, limit = 20) => {
    const clean = String(value || '').trim()
    if (!clean) return history
    if (history[0] === clean) return history
    return [clean, ...history].slice(0, limit)
  }, [])

  const getRecentSegmentBounds = useCallback(() => {
    if (transcriptLines.length === 0) return null
    const lastIdx = transcriptLines.length - 1
    let segmentStart = Math.max(0, lastIdx - (SUGGEST_RECENT_LINES - 1))
    for (let i = lastIdx; i > 0; i -= 1) {
      const currTs = transcriptLineTimestamps[i]
      const prevTs = transcriptLineTimestamps[i - 1]
      if (!currTs || !prevTs) continue
      if (currTs - prevTs >= SUGGEST_SPLIT_PAUSE_MS) {
        segmentStart = Math.max(i, segmentStart)
        break
      }
    }
    return { start: segmentStart, end: lastIdx }
  }, [transcriptLineTimestamps, transcriptLines.length])

  const extractLatestQuestionBlock = useCallback(() => {
    const bounds = getRecentSegmentBounds()
    if (!bounds) return null
    let questionIdx = -1
    for (let i = bounds.end; i >= bounds.start; i -= 1) {
      if (looksLikeQuestion(transcriptLines[i] || '')) {
        questionIdx = i
        break
      }
    }
    if (questionIdx < 0) return null
    const lineIndexes: number[] = []
    for (let i = bounds.start; i <= questionIdx; i += 1) {
      lineIndexes.push(i)
    }
    const payloadText = lineIndexes.map((idx) => transcriptLines[idx] || '').join('\n').trim()
    const questionText = String(transcriptLines[questionIdx] || '').trim()
    if (!payloadText || !questionText) return null
    return {
      payloadText,
      questionText,
      lineIndexes,
      key: questionText.toLowerCase(),
    }
  }, [getRecentSegmentBounds, transcriptLines])

  const runSuggestionForPayload = useCallback(async (questionText: string, body: {
    transcript: string
    resume_text: string
    scenario: string
    interview_role: string
    target_position: string
    role: string
    language: string
  }) => {
    const provider = enableClaudeSuggestion ? 'claude' : 'qwen'
    const timerLabel = `suggestion:${provider}:${Date.now()}`
    console.time(timerLabel)
    try {
      if (enableClaudeSuggestion) {
        const response = await fetch(apiUrl('/api/suggest-claude'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
          },
          body: JSON.stringify(body),
        })
        const payload = (await response.json().catch(() => ({}))) as { suggestion?: string; error?: string; details?: string }
        if (!response.ok) {
          throw new Error(payload.details || payload.error || 'Suggestion request failed')
        }
        setSuggestionClaudeHistory((prev) => pushSuggestion(prev, String(payload.suggestion || '').trim()))
        return
      }

      const response = await fetch(apiUrl('/api/suggest'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const payload = (await response.json().catch(() => ({}))) as { suggestion?: string; error?: string; details?: string }
      if (!response.ok) {
        throw new Error(payload.details || payload.error || 'Suggestion request failed')
      }
      setSuggestionPrimaryHistory((prev) => pushSuggestion(prev, String(payload.suggestion || '').trim()))
    } finally {
      console.timeEnd(timerLabel)
    }
  }, [enableClaudeSuggestion, pushSuggestion])

  const requestSuggestion = useCallback(async (source: 'manual' | 'quiet' = 'manual') => {
    if (suggestionInFlightRef.current) return
    const block = source === 'quiet' ? extractLatestQuestionBlock() : null
    if (source === 'quiet' && !block) {
      return
    }
    const transcriptForPayload = block
      ? block.payloadText
      : tailText(transcriptText ? transcriptText.split('\n') : [])
    if (!transcriptForPayload) return

    const body = {
      transcript: transcriptForPayload,
      resume_text: resumeText,
      scenario: mode === 'meetings' ? 'meeting' : 'job_interview',
      interview_role: role,
      target_position: targetPosition,
      role,
      language: primaryInterviewLanguage,
    }
    const key = block ? block.key : `${body.transcript}::manual::${body.language}`
    if (source === 'quiet' && lastSuggestedKeyRef.current === key) {
      return
    }

    if (block) {
      setSentLineIndexes((prev) => {
        const next = new Set(prev)
        block.lineIndexes.forEach((idx) => next.add(idx))
        return next
      })
    }

    suggestionInFlightRef.current = true
    setIsSuggesting(true)
    setStatus('Requesting suggestion...')
    try {
      await runSuggestionForPayload(block?.questionText || 'Current transcript', body)
      setStatus('Suggestion received')
      lastSuggestedKeyRef.current = key
    } catch (e) {
      setStatus(`Suggest error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      suggestionInFlightRef.current = false
      setIsSuggesting(false)
    }
  }, [extractLatestQuestionBlock, mode, primaryInterviewLanguage, resumeText, role, runSuggestionForPayload, targetPosition, transcriptText])

  const startHttp = async (audioStream: MediaStream) => {
    const mr = new MediaRecorder(audioStream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = mr
    mr.ondataavailable = async (ev) => {
      if (!ev.data || ev.data.size < 2048) return
      const form = new FormData()
      form.append('audio', ev.data, 'chunk.webm')
      form.append('language', transcriptLanguage)
      try {
        const response = await fetch(apiUrl('/api/transcribe'), { method: 'POST', body: form })
        const payload = (await response.json().catch(() => ({}))) as { text?: string; error?: string }
        if (!response.ok) throw new Error(payload.error || 'Transcribe failed')
        if (payload.text) {
          pushLine(payload.text)
        }
      } catch (e) {
        setStatus(`Transcribe error: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    mr.start(10000)
  }

  const startRealtime = async (audioStream: MediaStream) => {
    const wsBase = backendWsBase()
    const ws = new WebSocket(
      `${wsBase}/ws/realtime-asr?mode=${
        pipeline === 'realtime_translate' ? 'translate' : 'asr'
      }&source=${encodeURIComponent(transcriptLanguage || 'auto')}&target=${encodeURIComponent(
        translateTarget || DEFAULT_LANGUAGE_CODE
      )}`
    )
    wsRef.current = ws

    await new Promise<void>((resolve, reject) => {
      ws.onmessage = (ev) => {
        let data: any
        try {
          data = JSON.parse(ev.data)
        } catch {
          return
        }
        if (data.type === 'bridge_ready') {
          resolve()
          return
        }
        if (data.type === 'bridge_error') {
          reject(new Error(data.message || 'Bridge error'))
          return
        }
        if (data.type === 'conversation.item.input_audio_transcription.text') {
          setPartial([data.text, data.stash].filter(Boolean).join(''))
          return
        }
        if (data.type === 'conversation.item.input_audio_transcription.completed' && data.transcript) {
          setPartial('')
          pushLine(data.transcript)
          return
        }
        if (pipeline === 'realtime_translate' && data.type === 'response.text.done' && data.text) {
          pushLine(`[→${translateTarget}] ${String(data.text).trim()}`)
        }
      }
      ws.onerror = () => reject(new Error('WebSocket error'))
    })

    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new Ctx()
    audioCtxRef.current = ctx
    await ctx.resume()
    const source = ctx.createMediaStreamSource(audioStream)
    sourceRef.current = source
    const processor = ctx.createScriptProcessor(4096, 1, 1)
    processorRef.current = processor
    processor.onaudioprocess = (e) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
      const input = e.inputBuffer.getChannelData(0)
      const ratio = ctx.sampleRate / 16000
      const out = new Float32Array(Math.round(input.length / ratio))
      let o = 0
      let i = 0
      while (o < out.length) {
        const nextI = Math.round((o + 1) * ratio)
        let sum = 0
        let count = 0
        for (; i < nextI && i < input.length; i += 1) {
          sum += input[i] || 0
          count += 1
        }
        out[o] = count > 0 ? sum / count : 0
        o += 1
      }
      const buffer = new ArrayBuffer(out.length * 2)
      const view = new DataView(buffer)
      for (let idx = 0; idx < out.length; idx += 1) {
        const s = Math.max(-1, Math.min(1, out[idx] || 0))
        view.setInt16(idx * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      }
      const u8 = new Uint8Array(buffer)
      let binary = ''
      const chunk = 0x8000
      for (let c = 0; c < u8.length; c += chunk) {
        binary += String.fromCharCode(...u8.subarray(c, Math.min(c + chunk, u8.length)))
      }
      wsRef.current.send(JSON.stringify({ type: 'append', audio: btoa(binary) }))
    }
    const silent = ctx.createGain()
    silent.gain.value = 0
    source.connect(processor)
    processor.connect(silent)
    silent.connect(ctx.destination)
  }

  const startCapture = async () => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      setStatus('Sign in required to start capture.')
      router.push('/auth')
      return
    }
    const quota = await refresh()
    if (quota && !quota.unlimited && (quota.remainingSeconds ?? 0) <= 0) {
      setStatus(
        PAID_SUBSCRIPTIONS_ENABLED
          ? 'Free plan limit reached (60 minutes total). Upgrade your plan to continue.'
          : 'Free plan limit reached (60 minutes total). Paid upgrades are coming soon.'
      )
      return
    }
    try {
      setStatus('Starting capture...')
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      streamRef.current = stream
      if (previewRef.current) {
        previewRef.current.srcObject = stream
        previewRef.current.play().catch(() => {})
      }
      const audioTrack = stream.getAudioTracks()[0]
      if (!audioTrack) throw new Error('No tab audio track')
      const audioOnly = new MediaStream([audioTrack])

      if (pipeline === 'http') await startHttp(audioOnly)
      else await startRealtime(audioOnly)

      captureStartedAtRef.current = Date.now()
      reportedCaptureSecondsRef.current = 0
      clearUsageTick()
      usageTickRef.current = setInterval(() => {
        void (async () => {
          const limitReached = await flushCaptureUsage()
          if (limitReached) {
            stopCaptureRef.current?.()
          }
        })()
      }, 15000)

      setIsRunning(true)
      setStatus('Capture is running')
    } catch (e) {
      cleanupCaptureResources()
      setStatus(`Cannot start: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const saveSession = useCallback(async () => {
    const payload = {
      role,
      language: 'auto',
      transcript: transcriptText,
      suggestion: String(
        (enableClaudeSuggestion ? suggestionClaudeHistory[0] : suggestionPrimaryHistory[0]) || ''
      ).trim(),
      notes: '',
    }
    if (!payload.transcript && !payload.suggestion) {
      setStatus('Nothing to save yet.')
      return
    }
    try {
      setIsSessionSaving(true)
      const response = await fetch(apiUrl('/api/sessions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) throw new Error(data.error || 'Save failed')
      setStatus('Session saved.')
      await loadHistory()
    } catch (e) {
      setStatus(`Save error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsSessionSaving(false)
    }
  }, [enableClaudeSuggestion, role, suggestionClaudeHistory, suggestionPrimaryHistory, transcriptText])

  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true)
    try {
      const response = await fetch(apiUrl('/api/sessions'))
      if (!response.ok) throw new Error('Cannot load history')
      const data = (await response.json()) as {
        sessions?: Array<{ id: string; createdAt: string; role: string; language: string; transcript: string; suggestion: string }>
      }
      setHistory(data.sessions || [])
    } catch {
      setHistory([])
    } finally {
      setIsHistoryLoading(false)
    }
  }, [])

  const loadSession = (item: { role: string; transcript: string; suggestion: string }) => {
    setRole(item.role || 'general')
    const nextLines = String(item.transcript || '')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
    setTranscriptLines(nextLines)
    setTranscriptLineTimestamps(new Array(nextLines.length).fill(Date.now()))
    setPartial('')
    const loadedSuggestion = String(item.suggestion || '').trim()
    if (enableClaudeSuggestion) {
      setSuggestionClaudeHistory(loadedSuggestion ? [loadedSuggestion] : [])
      setSuggestionPrimaryHistory([])
    } else {
      setSuggestionPrimaryHistory(loadedSuggestion ? [loadedSuggestion] : [])
      setSuggestionClaudeHistory([])
    }
    setSentLineIndexes(new Set())
    lastSuggestedKeyRef.current = ''
    setStatus('Session loaded')
  }

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || ''
    const storedPlan = (localStorage.getItem('auth_plan') || '').toLowerCase()
    if (storedPlan === 'pro_claude') {
      setEnableClaudeSuggestion(true)
      return
    }
    if (!token) return
    void (async () => {
      try {
        const response = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = (await response.json().catch(() => ({}))) as {
          user?: { plan?: string }
          access?: { plan?: string }
        }
        if (!response.ok) return
        const plan = String(payload.user?.plan || payload.access?.plan || '').toLowerCase()
        setEnableClaudeSuggestion(plan === 'pro_claude')
      } catch {
        // ignore plan lookup errors
      }
    })()
  }, [])

  useEffect(() => {
    if (!isRunning) return
    const source = transcriptText.trim()
    if (!source) return
    if (quietTimerRef.current) clearTimeout(quietTimerRef.current)
    const quietMs = pipeline === 'http' ? 2400 : 1800
    quietTimerRef.current = setTimeout(() => {
      void requestSuggestion('quiet')
    }, quietMs)
    return () => {
      if (quietTimerRef.current) {
        clearTimeout(quietTimerRef.current)
        quietTimerRef.current = null
      }
    }
  }, [isRunning, pipeline, requestSuggestion, transcriptText])

  useEffect(() => {
    return () => {
      stopCapture()
    }
  }, [stopCapture])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const assistantId = String(
      settingsId ||
      searchParams?.get('settingsId') ||
      searchParams?.get('assistantId') ||
      searchParams?.get('assistant') ||
      ''
    )
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      setStatus('Unauthorized: redirecting to sign in.')
      router.replace('/auth')
      return
    }
    if (!assistantId) {
      setActiveAssistant(null)
      return
    }
    const run = async () => {
      setIsAssistantLoading(true)
      try {
        const base = mode === 'meetings' ? '/api/meeting-assistants' : '/api/assistants'
        const response = await fetch(
          apiUrl(`${base}/${encodeURIComponent(assistantId)}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const payload = (await response.json().catch(() => ({}))) as { assistant?: AssistantProfile }
        if (!response.ok || !payload.assistant) {
          if (response.status === 401) {
            setStatus('Unauthorized: sign in to load assistant settings.')
          } else if (response.status === 404) {
            setStatus('Assistant settings not found.')
          } else {
            setStatus('Failed to load assistant settings.')
          }
          return
        }
        const selected = payload.assistant
        setActiveAssistant(selected)
        if (selected) {
          const nextRole = String(selected.roleName || 'general').trim().toLowerCase()
          setRole(nextRole || 'general')
          setTargetPosition(String(selected.company || '').trim())
          setPipeline(selected.translateEnabled ? 'realtime_translate' : 'realtime_asr')
          if (selected.translateEnabled) {
            setTranslateTarget(
              toFormLanguageValue(String(selected.translateLanguage || DEFAULT_LANGUAGE_CODE)),
            )
          }
          const nextResumeText = (() => {
            if (mode === 'meetings') {
              const ctx = String(
                selected.contextText ?? selected.context_text ?? ''
              ).trim()
              if (ctx) return ctx
            }
            return String(selected.resumeText ?? selected.resume_text ?? '').trim()
          })()
          setResumeText(nextResumeText)
          setResumeStatus(
            mode === 'meetings'
              ? nextResumeText
                ? 'Meeting context loaded from assistant'
                : 'No meeting context'
              : nextResumeText
                ? 'Resume loaded from assistant settings'
                : 'No resume'
          )
          const interviewLanguage = normalizeInterviewLanguage(String(selected.language || ''))
          setPrimaryInterviewLanguage(interviewLanguage)
          setTranscriptLanguage(interviewLanguage)
        }
      } finally {
        setIsAssistantLoading(false)
      }
    }
    void run()
  }, [mode, router, searchParams, settingsId])

  const captureStatusLabel = isRunning
    ? 'Recording'
    : isAssistantLoading
      ? 'Loading assistant...'
      : isHistoryLoading
        ? 'Loading history...'
        : isSuggesting
          ? 'Requesting suggestion...'
          : status || 'Ready'

  return (
    <>
      <main
        className={cn(
          'mx-auto flex h-full min-h-0 w-full max-w-none flex-col gap-3 pr-14 transition-[padding] duration-200',
          sessionSidebarOpen && 'md:pr-[23.5rem]'
        )}
      >
            <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-landing-mint-soft px-3 py-2 text-sm text-heading">
              <p className="min-w-0 flex-1 truncate leading-snug">
                {activeAssistant ? (
                  <>
                    {mode === 'meetings' ? 'Meeting assistant' : 'Assistant'}:{' '}
                    <span className="font-semibold">{activeAssistant.name}</span>
                    {activeAssistant.interviewType
                      ? ` • ${mode === 'meetings' ? 'Type' : 'Interview'}: ${activeAssistant.interviewType}`
                      : ''}
                    {activeAssistant.roleName ? ` • Role: ${activeAssistant.roleName}` : ''}
                  </>
                ) : (
                  <span className="font-medium text-gray">
                    {mode === 'meetings' ? 'Meeting session' : 'Interview session'}
                  </span>
                )}
              </p>
              <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <span className="whitespace-nowrap font-medium text-gray">{captureStatusLabel}</span>
                <span className="text-gray-light" aria-hidden>
                  ·
                </span>
                <span className="whitespace-nowrap">{resumeStatus}</span>
              </div>
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:items-stretch">
              <div className="flex min-h-0 min-w-0 flex-col gap-3 overflow-hidden">
                <section className="shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                  <header className="flex items-center justify-between border-b border-border bg-light-gray px-3 py-2.5">
                    <span className="text-sm font-semibold text-heading">
                      {mode === 'meetings' ? 'Meeting conversation' : 'Interview conversation'}
                    </span>
                    <button
                      type="button"
                      className="rounded p-1 text-heading hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={!transcriptText.trim()}
                      aria-label="Download transcript"
                      title={
                        transcriptText.trim()
                          ? 'Download transcript as .txt'
                          : 'Transcript is empty'
                      }
                      onClick={downloadTranscript}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </header>
                  <div className="relative aspect-video w-full bg-dark-mid">
                    <video
                      ref={previewRef}
                      className={cn(
                        'absolute inset-0 h-full w-full object-contain',
                        !isRunning && 'pointer-events-none opacity-0'
                      )}
                      autoPlay
                      muted
                      playsInline
                    />
                    {!isRunning ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                        <Button
                          variant="teal"
                          onClick={() => void startCapture()}
                          disabled={
                            usage !== null &&
                            !usage.unlimited &&
                            (usage.remainingSeconds ?? 0) <= 0
                          }
                          className="gap-2.5"
                        >
                          <MonitorUp className="h-5 w-5" strokeWidth={2.25} />
                          {mode === 'meetings' ? 'Connect meeting' : 'Connect interview'}
                        </Button>
                        <p className="mt-3 text-xs text-slate-400">
                          Share your {mode === 'meetings' ? 'meeting' : 'interview'} or{' '}
                          <Link
                            href="/interview-assistant"
                            className="text-slate-300 underline underline-offset-2 hover:text-white"
                          >
                            sample interview
                          </Link>{' '}
                          to connect
                        </p>
                        <CircleHelp
                          className="mt-3 h-4 w-4 text-slate-500"
                          aria-label="Pick the browser tab with your call, then allow screen share"
                        />
                      </div>
                    ) : null}
                  </div>
                  {isRunning ? (
                    <div className="border-t border-border p-2">
                      <Button variant="soft" className="w-full" onClick={stopCapture}>
                        Stop
                      </Button>
                    </div>
                  ) : null}
                </section>
                <Button
                  variant="soft"
                  className="w-full shrink-0"
                  onClick={() => void saveSession()}
                  disabled={isSessionSaving || transcriptLines.length === 0}
                >
                  {isSessionSaving ? 'Saving...' : 'Save session'}
                </Button>
              <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
                <header className="flex shrink-0 items-center justify-between border-b border-border p-3 font-semibold">
                  <span>Live transcript</span>
                  <Button
                    variant="soft"
                    onClick={() => {
                      setTranscriptLines([])
                      setTranscriptLineTimestamps([])
                      setPartial('')
                      setSentLineIndexes(new Set())
                      lastSuggestedKeyRef.current = ''
                    }}
                  >
                    Clear
                  </Button>
                </header>
                <div
                  ref={transcriptScrollRef}
                  className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-3 text-sm"
                >
                  {transcriptLines.map((line, idx) => (
                    <div
                      key={`${idx}-${line.slice(0, 12)}`}
                      className={sentLineIndexes.has(idx) ? 'border-l-2 border-orange-500 bg-orange-50 pl-2' : ''}
                    >
                      {line}
                    </div>
                  ))}
                  {partial ? <div className="text-muted-foreground">... {partial}</div> : null}
                </div>
              </section>
              </div>
              <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
              {!enableClaudeSuggestion ? (
              <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border p-3 font-semibold">
                  <span>AI suggestions</span>
                  <div className="flex items-center gap-2">
                    <Button variant="soft" onClick={() => void requestSuggestion('manual')} disabled={isSuggesting || !transcriptText}>
                      {isSuggesting ? 'Thinking...' : 'Answer now'}
                    </Button>
                    <Button
                      variant="soft"
                      onClick={() => {
                        setSuggestionPrimaryHistory([])
                        setSentLineIndexes(new Set())
                        lastSuggestedKeyRef.current = ''
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap p-3 text-sm">
                  {suggestionPrimaryHistory.length === 0 ? (
                    <span className="text-muted-foreground">No suggestion yet.</span>
                  ) : (
                    suggestionPrimaryHistory.map((item, idx) => (
                      <div key={`${idx}-${item.slice(0, 12)}`} className="mb-4 border-b border-slate-100 pb-3 last:mb-0 last:border-b-0 last:pb-0">
                        <div dangerouslySetInnerHTML={{ __html: formatSuggestion(item) }} />
                      </div>
                    ))
                  )}
                </div>
              </section>
              ) : null}
              {enableClaudeSuggestion ? (
              <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border p-3 font-semibold">
                  <span>AI suggestions</span>
                  <div className="flex items-center gap-2">
                    <Button variant="soft" onClick={() => void requestSuggestion('manual')} disabled={isSuggesting || !transcriptText}>
                      {isSuggesting ? 'Thinking...' : 'Answer now'}
                    </Button>
                    <Button
                      variant="soft"
                      onClick={() => {
                        setSuggestionClaudeHistory([])
                        setSentLineIndexes(new Set())
                        lastSuggestedKeyRef.current = ''
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap p-3 text-sm">
                  {suggestionClaudeHistory.length === 0 ? (
                    <span className="text-muted-foreground">No suggestion yet.</span>
                  ) : (
                    suggestionClaudeHistory.map((item, idx) => (
                      <div key={`${idx}-${item.slice(0, 12)}`} className="mb-4 border-b border-slate-100 pb-3 last:mb-0 last:border-b-0 last:pb-0">
                        <div dangerouslySetInnerHTML={{ __html: formatSuggestion(item) }} />
                      </div>
                    ))
                  )}
                </div>
              </section>
              ) : null}
              </div>
            </div>
      </main>
      <div className="fixed right-0 top-16 z-20 flex h-[calc(100dvh-4rem)] border-l border-slate-200 bg-white">
        {sessionSidebarOpen ? (
          <aside className="hidden h-full w-80 shrink-0 flex-col md:flex">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Hide session history"
                  onClick={() => setSessionSidebarOpen(false)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                <h2 className="text-sm font-semibold text-slate-900">Session history</h2>
              </div>
              <Button variant="soft" onClick={() => void loadHistory()} disabled={isHistoryLoading}>
                {isHistoryLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {history.length === 0 ? (
                <div className="text-sm text-muted-foreground">No sessions yet.</div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-2 rounded border border-border p-2 text-sm">
                    <span className="text-muted-foreground">
                      {isHydrated
                        ? new Date(item.createdAt).toLocaleString()
                        : new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{item.role}</span>
                    <Button variant="soft" onClick={() => loadSession(item)}>
                      Load
                    </Button>
                    <a href={apiUrl(`/api/sessions/${item.id}/export`)} target="_blank" className="text-xs text-link underline hover:text-link-hover">
                      Export
                    </a>
                  </div>
                ))
              )}
            </div>
          </aside>
        ) : null}
        <div className="flex h-full w-14 shrink-0 flex-col items-center gap-2 py-3">
          <button
            type="button"
            aria-label="Session history"
            title="Session history"
            onClick={() => setSessionSidebarOpen((open) => !open)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
              sessionSidebarOpen
                ? 'border-primary/25 bg-primary-light text-primary'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-primary-light/60'
            )}
          >
            <FileText className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  )
}
