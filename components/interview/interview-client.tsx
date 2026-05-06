'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { AssistantProfile } from '@/entities/assistant/model/types'

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

export function InterviewClient({ settingsId }: { settingsId?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const [translateTarget, setTranslateTarget] = useState('en')
  const [suggestionLanguage, setSuggestionLanguage] = useState('en')
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
  const quietTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSuggestedKeyRef = useRef('')
  const suggestionInFlightRef = useRef(false)
  const ENABLE_CLAUDE_SUGGESTION = false
  const SUGGEST_RECENT_LINES = 24
  const SUGGEST_SPLIT_PAUSE_MS = 4000

  const transcriptText = useMemo(
    () => `${transcriptLines.join('\n')}${partial ? `\n${partial}` : ''}`.trim(),
    [partial, transcriptLines]
  )

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

  const stopCapture = useCallback(() => {
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
    setStatus('Stopped')
  }, [])

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
    const primaryReq = fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async (response) => {
      const payload = (await response.json().catch(() => ({}))) as { suggestion?: string; error?: string; details?: string }
      if (!response.ok) throw new Error(payload.details || payload.error || 'Suggestion request failed')
      return String(payload.suggestion || '').trim()
    })
    const claudeReq = ENABLE_CLAUDE_SUGGESTION
      ? fetch('/api/suggest-claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then(async (response) => {
          const payload = (await response.json().catch(() => ({}))) as { suggestion?: string; error?: string; details?: string }
          if (!response.ok) throw new Error(payload.details || payload.error || 'Claude suggestion request failed')
          return String(payload.suggestion || '').trim()
        })
      : Promise.resolve('Claude suggestion is disabled.')

    const [primaryRes, claudeRes] = await Promise.allSettled([primaryReq, claudeReq])
    if (primaryRes.status === 'fulfilled') {
      setSuggestionPrimaryHistory((prev) => pushSuggestion(prev, primaryRes.value))
    } else {
      setSuggestionPrimaryHistory((prev) =>
        pushSuggestion(prev, `Suggestion error: ${primaryRes.reason instanceof Error ? primaryRes.reason.message : String(primaryRes.reason)}`)
      )
    }
    if (claudeRes.status === 'fulfilled') {
      const answer = ENABLE_CLAUDE_SUGGESTION ? claudeRes.value : `Question:\n${questionText}\n\nAnswer:\n${claudeRes.value}`
      setSuggestionClaudeHistory((prev) => pushSuggestion(prev, answer))
    } else {
      setSuggestionClaudeHistory((prev) =>
        pushSuggestion(prev, `Suggestion error: ${claudeRes.reason instanceof Error ? claudeRes.reason.message : String(claudeRes.reason)}`)
      )
    }
  }, [pushSuggestion])

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
      scenario: 'job_interview',
      interview_role: role,
      target_position: targetPosition,
      role,
      language: suggestionLanguage,
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
  }, [extractLatestQuestionBlock, resumeText, role, runSuggestionForPayload, suggestionLanguage, targetPosition, transcriptText])

  const startHttp = async (audioStream: MediaStream) => {
    const mr = new MediaRecorder(audioStream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = mr
    mr.ondataavailable = async (ev) => {
      if (!ev.data || ev.data.size < 2048) return
      const form = new FormData()
      form.append('audio', ev.data, 'chunk.webm')
      form.append('language', transcriptLanguage)
      try {
        const response = await fetch('/api/transcribe', { method: 'POST', body: form })
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
        translateTarget || 'en'
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
      setStatus('Not authorized. Capture can start, but save/suggest may be limited.')
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
      suggestion: String(suggestionPrimaryHistory[0] || '').trim(),
      notes: '',
    }
    if (!payload.transcript && !payload.suggestion) {
      setStatus('Nothing to save yet.')
      return
    }
    try {
      setIsSessionSaving(true)
      const response = await fetch('/api/sessions', {
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
  }, [role, suggestionPrimaryHistory, transcriptText])

  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true)
    try {
      const response = await fetch('/api/sessions')
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
    setSuggestionPrimaryHistory(loadedSuggestion ? [loadedSuggestion] : [])
    setSuggestionClaudeHistory(ENABLE_CLAUDE_SUGGESTION ? [] : ['Claude suggestion is disabled.'])
    setSentLineIndexes(new Set())
    lastSuggestedKeyRef.current = ''
    setStatus('Session loaded')
  }

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  useEffect(() => {
    if (!ENABLE_CLAUDE_SUGGESTION) {
      setSuggestionClaudeHistory(['Claude suggestion is disabled.'])
    }
  }, [])

  useEffect(() => {
    if (transcriptLanguage !== 'auto') {
      setSuggestionLanguage(transcriptLanguage)
    }
  }, [transcriptLanguage])

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
        const response = await fetch(`/api/assistants/${encodeURIComponent(assistantId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
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
            setTranslateTarget(String(selected.translateLanguage || 'en').trim() || 'en')
          }
          const nextResumeText = String(selected.resumeText || selected.resume_text || '').trim()
          setResumeText(nextResumeText)
          setResumeStatus(nextResumeText ? 'Resume loaded from assistant settings' : 'No resume')
          const lang = String(selected.language || '').trim()
          if (lang) {
            const normalized = lang.toLowerCase().includes('russian')
              ? 'ru'
              : lang.toLowerCase().includes('kazakh')
                ? 'kk'
                : lang.toLowerCase().includes('german')
                  ? 'de'
                  : lang.toLowerCase().includes('french')
                    ? 'fr'
                    : 'en'
            setTranscriptLanguage(normalized)
            setSuggestionLanguage(normalized)
          }
        }
      } finally {
        setIsAssistantLoading(false)
      }
    }
    void run()
  }, [router, searchParams, settingsId])

  return (
    <main className="mx-auto max-w-7xl space-y-4">
            {activeAssistant ? (
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
                Assistant: <span className="font-semibold">{activeAssistant.name}</span>{' '}
                {activeAssistant.roleName ? `• Role: ${activeAssistant.roleName}` : ''}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
              <Button onClick={startCapture} disabled={isRunning}>Start capture</Button>
              <Button variant="outline" onClick={stopCapture} disabled={!isRunning}>Stop</Button>
              <Button variant="outline" onClick={() => void saveSession()} disabled={isSessionSaving}>
                {isSessionSaving ? 'Saving session...' : 'Save session'}
              </Button>
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm">{status}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {isAssistantLoading ? 'Loading assistant settings... ' : ''}
              {isHistoryLoading ? 'Loading history... ' : ''}
              {isSuggesting ? 'Requesting suggestion... ' : ''}
            </div>
            <div className="text-xs text-muted-foreground">{resumeStatus}</div>

            <div className="grid gap-4 lg:grid-cols-3">
              <section className="rounded-xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border p-3 font-semibold">
                  <span>Live transcript</span>
                  <Button
                    size="sm"
                    variant="outline"
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
                <div className="h-[380px] overflow-auto whitespace-pre-wrap p-3 text-sm">
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
              <section className="rounded-xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border p-3 font-semibold">
                  <span>AI suggestion (Qwen)</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => void requestSuggestion('manual')} disabled={isSuggesting || !transcriptText}>
                      {isSuggesting ? 'Sending...' : 'Send'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
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
                <div className="h-[380px] overflow-auto whitespace-pre-wrap p-3 text-sm">
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
              <section className="rounded-xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border p-3 font-semibold">
                  <span>AI suggestion (Claude)</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSuggestionClaudeHistory(ENABLE_CLAUDE_SUGGESTION ? [] : ['Claude suggestion is disabled.'])
                    }}
                  >
                    Clear
                  </Button>
                </header>
                <div className="h-[380px] overflow-auto whitespace-pre-wrap p-3 text-sm">
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
            </div>

            <section className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 text-sm font-semibold">Tab preview</div>
              <video ref={previewRef} className="h-[260px] w-full rounded-md border border-border bg-black object-contain" autoPlay muted playsInline />
            </section>

            <section className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-semibold">Session history</div>
                <Button size="sm" variant="outline" onClick={() => void loadHistory()} disabled={isHistoryLoading}>
                  {isHistoryLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
              <div className="max-h-64 space-y-2 overflow-auto">
                {history.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No sessions yet.</div>
                ) : history.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-2 rounded border border-border p-2 text-sm">
                    <span className="text-muted-foreground">
                      {isHydrated
                        ? new Date(item.createdAt).toLocaleString()
                        : new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{item.role}</span>
                    <Button size="sm" variant="outline" onClick={() => loadSession(item)}>Load</Button>
                    <a href={`/api/sessions/${item.id}/export`} target="_blank" className="text-xs text-orange-600 underline">
                      Export
                    </a>
                  </div>
                ))}
              </div>
            </section>
    </main>
  )
}
