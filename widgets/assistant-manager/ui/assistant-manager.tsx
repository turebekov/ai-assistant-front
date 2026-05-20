'use client'

import { useEffect, useMemo, useState } from 'react'
import { AssistantSettingsModal } from '@/features/assistant-settings/ui/assistant-settings-modal'
import type {
  AssistantFormFieldErrors,
  AssistantFormFieldErrorKey,
  AssistantProfile,
  AssistantSettingsForm,
} from '@/entities/assistant/model/types'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'

interface AssistantManagerProps {
  routeBase: '/profile/interview' | '/profile/meetings'
}

export function AssistantManager({ routeBase }: AssistantManagerProps) {
  const isMeetings = routeBase === '/profile/meetings'
  const [assistants, setAssistants] = useState<AssistantProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [existingResumeText, setExistingResumeText] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeStatus, setResumeStatus] = useState(isMeetings ? 'No file selected' : 'No resume selected')
  const [saveError, setSaveError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<AssistantFormFieldErrors>({})
  const [form, setForm] = useState<AssistantSettingsForm>({
    interviewType: 'Job Interview',
    roleName: '',
    companyName: '',
    details: '',
    interviewLanguage: 'English (USA)',
    translateEnabled: false,
    translateLanguage: 'en',
    profileName: '',
    suggestionTone: 'Friendly',
    promptStyle: 'Concise',
    codingAssistant: false,
  })

  const title = useMemo(
    () => (routeBase === '/profile/interview' ? 'Interview Assistants' : 'Meetings Assistants'),
    [routeBase]
  )
  const buildAssistantLink = (assistantId: string) =>
    routeBase === '/profile/interview'
      ? `/profile/interview/${encodeURIComponent(assistantId)}`
      : routeBase === '/profile/meetings'
        ? `/profile/meetings/${encodeURIComponent(assistantId)}`
        : `${routeBase}?settingsId=${encodeURIComponent(assistantId)}`
  const resetForm = () => {
    setForm({
      interviewType: 'Job Interview',
      roleName: '',
      companyName: '',
      details: '',
      interviewLanguage: 'English (USA)',
      translateEnabled: false,
      translateLanguage: 'en',
      profileName: '',
      suggestionTone: 'Friendly',
      promptStyle: 'Concise',
      codingAssistant: false,
    })
    setResumeFile(null)
    setExistingResumeText('')
    setResumeStatus(isMeetings ? 'No file selected' : 'No resume selected')
    setSaveError('')
    setFieldErrors({})
  }

  const loadAssistants = async () => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      setAssistants([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetch(apiUrl(isMeetings ? '/api/meeting-assistants' : '/api/assistants'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = (await response.json().catch(() => ({}))) as { assistants?: AssistantProfile[] }
      if (!response.ok) {
        setAssistants([])
      } else {
        setAssistants(Array.isArray(payload.assistants) ? payload.assistants : [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAssistants()
  }, [isMeetings])

  const clearFieldError = (key: AssistantFormFieldErrorKey) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validateCreateFields = (): boolean => {
    if (mode !== 'create') return true
    const t = (s: string) => String(s || '').trim()
    const required = 'This field is required.'
    const next: AssistantFormFieldErrors = {}
    if (!t(form.profileName)) next.profileName = required
    if (!t(form.interviewType)) next.interviewType = required
    if (!t(form.roleName)) next.roleName = required
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const onSave = async () => {
    setSaveError('')
    if (mode === 'create' && !validateCreateFields()) {
      return
    }
    setIsSaving(true)
    const token = localStorage.getItem('auth_token') || ''
    const name = String(form.profileName || '').trim()
    if (!token) {
      setSaveError('Not authorized. Please sign in again.')
      setIsSaving(false)
      return
    }
    let resumeText = existingResumeText
    if (resumeFile) {
      setResumeStatus(isMeetings ? 'Parsing file...' : 'Parsing resume...')
      const formData = new FormData()
      formData.append('resume', resumeFile, resumeFile.name)
      const parseResponse = await fetch(apiUrl(isMeetings ? '/api/context/parse' : '/api/resume/parse'), {
        method: 'POST',
        body: formData,
      })
      const parsePayload = (await parseResponse.json().catch(() => ({}))) as { text?: string; error?: string; details?: string }
      if (!parseResponse.ok) {
        setResumeStatus(`File error: ${parsePayload.details || parsePayload.error || 'Parse failed'}`)
        setIsSaving(false)
        return
      }
      resumeText = String(parsePayload.text || '').trim()
      setResumeStatus(
        resumeText
          ? `${isMeetings ? 'File' : 'Resume'} loaded (${resumeFile.name})`
          : `${isMeetings ? 'File' : 'Resume'} empty (${resumeFile.name})`
      )
    }

    const baseEndpoint = isMeetings ? '/api/meeting-assistants' : '/api/assistants'
    const endpoint = mode === 'edit' && editingId
      ? `${baseEndpoint}/${encodeURIComponent(editingId)}`
      : baseEndpoint
    const method = mode === 'edit' ? 'PATCH' : 'POST'
    const response = await fetch(apiUrl(endpoint), {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        interviewType: form.interviewType,
        roleName: form.roleName,
        company: form.companyName,
        details: form.details,
        language: form.interviewLanguage,
        translateEnabled: form.translateEnabled,
        translate_enabled: form.translateEnabled,
        translateLanguage: form.translateLanguage,
        translate_language: form.translateLanguage,
        resumeText: isMeetings ? '' : resumeText,
        resume_text: isMeetings ? '' : resumeText,
        contextText: isMeetings ? resumeText : '',
        context_text: isMeetings ? resumeText : '',
        tone: form.suggestionTone,
        promptStyle: form.promptStyle,
        codingAssistant: form.codingAssistant,
      }),
    })
    if (response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { assistant?: AssistantProfile }
      const createdId = String(payload.assistant?.id || '').trim()
      if (mode === 'create' && createdId) {
        window.location.href = buildAssistantLink(createdId)
        return
      }
      await loadAssistants()
      resetForm()
      setOpen(false)
      setEditingId(null)
      setMode('create')
      setIsSaving(false)
      return
    }
    const errorPayload = (await response.json().catch(() => ({}))) as { error?: string; details?: string }
    setSaveError(errorPayload.details || errorPayload.error || 'Assistant save failed')
    setIsSaving(false)
  }

  const openCreate = () => {
    setMode('create')
    setEditingId(null)
    resetForm()
    setOpen(true)
  }

  const openEdit = (assistant: AssistantProfile) => {
    setMode('edit')
    setEditingId(assistant.id)
    setExistingResumeText(
      String(
        isMeetings
          ? assistant.contextText || assistant.context_text || ''
          : assistant.resumeText || assistant.resume_text || ''
      ).trim()
    )
    setResumeFile(null)
    setResumeStatus(
      isMeetings
        ? assistant.contextText || assistant.context_text
          ? 'Context file already saved'
          : 'No file selected'
        : assistant.resumeText || assistant.resume_text
          ? 'Resume already saved'
          : 'No resume selected'
    )
    setSaveError('')
    setFieldErrors({})
    setForm({
      interviewType: String(assistant.interviewType || 'Job Interview'),
      roleName: String(assistant.roleName || ''),
      companyName: String(assistant.company || ''),
      details: String(assistant.details || ''),
      interviewLanguage: String(assistant.language || 'English (USA)'),
      translateEnabled: Boolean(assistant.translateEnabled),
      translateLanguage: String(assistant.translateLanguage || 'en'),
      profileName: String(assistant.name || ''),
      suggestionTone: String(assistant.tone || 'Friendly'),
      promptStyle: String(assistant.promptStyle || 'Concise'),
      codingAssistant: Boolean(assistant.codingAssistant),
    })
    setOpen(true)
  }

  const onDelete = async (assistantId: string) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) return
    const ok = window.confirm('Delete this assistant?')
    if (!ok) return
    setDeletingId(assistantId)
    try {
      const response = await fetch(apiUrl(`${isMeetings ? '/api/meeting-assistants' : '/api/assistants'}/${encodeURIComponent(assistantId)}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        setSaveError('Failed to delete assistant')
        return
      }
      await loadAssistants()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <Button size="sm" variant="outline" onClick={openCreate}>
          Create assistant
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading assistants...</p>
      ) : assistants.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assistants yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {assistants.map((assistant, idx) => {
            const link = buildAssistantLink(assistant.id)
            const percent = Math.min(95, 20 + ((idx * 17) % 55))
            return (
              <article key={assistant.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                  <span>{percent}% Personalized</span>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs">{assistant.roleName || 'General'}</span>
                </div>
                <div className="mb-1 text-3xl font-semibold text-slate-300">{assistant.name}</div>
                <div className="h-1 w-full overflow-hidden rounded bg-slate-100">
                  <div className="h-full rounded bg-violet-500" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">An Assistant for</div>
                    <div className="text-lg font-medium text-slate-900">
                      {(assistant.roleName || 'General')}@{assistant.company || 'No Company'}
                    </div>
                  </div>
                  <div className="text-sm text-violet-500">● Ready</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(assistant)}>
                      Settings
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === assistant.id}
                      onClick={() => void onDelete(assistant.id)}
                    >
                      {deletingId === assistant.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                  <a href={link}>
                    <Button size="sm" variant="outline">
                      Activate
                    </Button>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}
      <AssistantSettingsModal
        open={open}
        form={form}
        onChange={setForm}
        fieldErrors={fieldErrors}
        onClearFieldError={clearFieldError}
        resumeStatus={resumeStatus}
        isSaving={isSaving}
        mode={mode}
        assistantKind={isMeetings ? 'meeting' : 'interview'}
        onResumeFileChange={(file) => {
          setResumeFile(file)
          setResumeStatus(
            file
              ? `Selected: ${file.name}`
              : isMeetings
                ? 'No file selected'
                : 'No resume selected'
          )
        }}
        onClose={() => {
          setOpen(false)
          setMode('create')
          setEditingId(null)
          resetForm()
        }}
        onSave={() => void onSave()}
      />
      {saveError ? <p className="mt-2 text-sm text-red-600">{saveError}</p> : null}
    </section>
  )
}

