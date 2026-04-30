'use client'

import { useEffect, useMemo, useState } from 'react'
import { AssistantSettingsModal } from '@/features/assistant-settings/ui/assistant-settings-modal'
import type { AssistantProfile, AssistantSettingsForm } from '@/entities/assistant/model/types'
import { Button } from '@/components/ui/button'

interface AssistantManagerProps {
  routeBase: '/profile/interview' | '/profile/meetings'
}

export function AssistantManager({ routeBase }: AssistantManagerProps) {
  const [assistants, setAssistants] = useState<AssistantProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeStatus, setResumeStatus] = useState('No resume selected')
  const [saveError, setSaveError] = useState('')
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

  const loadAssistants = async () => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) {
      setAssistants([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/assistants', {
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
  }, [])

  const onSave = async () => {
    setIsSaving(true)
    setSaveError('')
    const token = localStorage.getItem('auth_token') || ''
    const name = String(form.profileName || '').trim()
    if (!token) {
      setSaveError('Not authorized. Please sign in again.')
      setIsSaving(false)
      return
    }
    if (!name) {
      setSaveError('Assistant name is required.')
      setIsSaving(false)
      return
    }
    let resumeText = ''
    if (resumeFile) {
      setResumeStatus('Parsing resume...')
      const formData = new FormData()
      formData.append('resume', resumeFile, resumeFile.name)
      const parseResponse = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      })
      const parsePayload = (await parseResponse.json().catch(() => ({}))) as { text?: string; error?: string; details?: string }
      if (!parseResponse.ok) {
        setResumeStatus(`Resume error: ${parsePayload.details || parsePayload.error || 'Parse failed'}`)
        setIsSaving(false)
        return
      }
      resumeText = String(parsePayload.text || '').trim()
      setResumeStatus(resumeText ? `Resume loaded (${resumeFile.name})` : `Resume empty (${resumeFile.name})`)
    }

    const response = await fetch('/api/assistants', {
      method: 'POST',
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
        resumeText,
        resume_text: resumeText,
        tone: form.suggestionTone,
        promptStyle: form.promptStyle,
        codingAssistant: form.codingAssistant,
      }),
    })
    if (response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { assistant?: AssistantProfile }
      const createdId = String(payload.assistant?.id || '').trim()
      if (createdId) {
        window.location.href = buildAssistantLink(createdId)
        return
      }
      await loadAssistants()
      setResumeFile(null)
      setResumeStatus('No resume selected')
      setOpen(false)
      setIsSaving(false)
      return
    }
    const errorPayload = (await response.json().catch(() => ({}))) as { error?: string; details?: string }
    setSaveError(errorPayload.details || errorPayload.error || 'Assistant save failed')
    setIsSaving(false)
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          Create assistant
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading assistants...</p>
      ) : assistants.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assistants yet.</p>
      ) : (
        <div className="space-y-2">
          {assistants.map((assistant) => {
            const link = buildAssistantLink(assistant.id)
            return (
              <div key={assistant.id} className="rounded-lg border border-border p-3">
                <div className="font-medium">{assistant.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {(assistant.roleName || 'general')} • {assistant.company || 'No company'}
                </div>
                <a href={link} className="mt-2 inline-block text-xs text-violet-600 underline">
                  {link}
                </a>
              </div>
            )
          })}
        </div>
      )}
      <AssistantSettingsModal
        open={open}
        form={form}
        onChange={setForm}
        resumeStatus={resumeStatus}
        isSaving={isSaving}
        onResumeFileChange={(file) => {
          setResumeFile(file)
          setResumeStatus(file ? `Selected: ${file.name}` : 'No resume selected')
        }}
        onClose={() => setOpen(false)}
        onSave={() => void onSave()}
      />
      {saveError ? <p className="mt-2 text-sm text-red-600">{saveError}</p> : null}
    </section>
  )
}

