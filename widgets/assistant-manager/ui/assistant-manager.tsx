'use client'

import { useEffect, useMemo, useState } from 'react'
import { AssistantSettingsModal } from '@/features/assistant-settings/ui/assistant-settings-modal'
import { useAssistantSettingsModal } from '@/features/assistant-settings/model/use-assistant-settings-modal'
import type { AssistantProfile } from '@/entities/assistant/model/types'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api-url'

interface AssistantManagerProps {
  routeBase: '/profile/interview' | '/profile/meetings'
}

export function AssistantManager({ routeBase }: AssistantManagerProps) {
  const isMeetings = routeBase === '/profile/meetings'
  const [assistants, setAssistants] = useState<AssistantProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const title = useMemo(
    () => (routeBase === '/profile/interview' ? 'Interview Assistants' : 'Meetings Assistants'),
    [routeBase],
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

  const {
    open,
    mode,
    form,
    setForm,
    fieldErrors,
    clearFieldError,
    resumeStatus,
    isSaving,
    saveError,
    openCreate,
    openEdit,
    close,
    onSave,
    onResumeFileChange,
  } = useAssistantSettingsModal({
    assistantKind: isMeetings ? 'meeting' : 'interview',
    redirectOnCreate: (id) => {
      window.location.href = buildAssistantLink(id)
    },
    onListRefresh: loadAssistants,
  })

  useEffect(() => {
    void loadAssistants()
  }, [isMeetings])

  const onDelete = async (assistantId: string) => {
    const token = localStorage.getItem('auth_token') || ''
    if (!token) return
    const ok = window.confirm('Delete this assistant?')
    if (!ok) return
    setDeletingId(assistantId)
    try {
      const response = await fetch(
        apiUrl(`${isMeetings ? '/api/meeting-assistants' : '/api/assistants'}/${encodeURIComponent(assistantId)}`),
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!response.ok) return
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
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs">
                    {assistant.roleName || 'General'}
                  </span>
                </div>
                <div className="mb-1 text-3xl font-semibold text-slate-300">{assistant.name}</div>
                <div className="h-1 w-full overflow-hidden rounded bg-slate-100">
                  <div className="h-full rounded bg-primary" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">An Assistant for</div>
                    <div className="text-lg font-medium text-slate-900">
                      {(assistant.roleName || 'General')}@{assistant.company || 'No Company'}
                    </div>
                  </div>
                  <div className="text-sm text-primary">● Ready</div>
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
        onResumeFileChange={onResumeFileChange}
        onClose={close}
        onSave={() => void onSave()}
      />
      {saveError ? <p className="mt-2 text-sm text-red-600">{saveError}</p> : null}
    </section>
  )
}
