'use client'

import { Button } from '@/components/ui/button'
import type { AssistantSettingsForm } from '@/entities/assistant/model/types'

interface AssistantSettingsModalProps {
  open: boolean
  form: AssistantSettingsForm
  onChange: (next: AssistantSettingsForm) => void
  resumeStatus: string
  isSaving: boolean
  onResumeFileChange: (file: File | null) => void
  onClose: () => void
  onSave: () => void
}

export function AssistantSettingsModal({
  open,
  form,
  onChange,
  resumeStatus,
  isSaving,
  onResumeFileChange,
  onClose,
  onSave,
}: AssistantSettingsModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Assistant Setting</h2>
          <button className="text-slate-500" onClick={onClose}>X</button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Interview</p>
            <input className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="Interview Type" value={form.interviewType} onChange={(e) => onChange({ ...form, interviewType: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="Role Name" value={form.roleName} onChange={(e) => onChange({ ...form, roleName: e.target.value })} />
              <input className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="Company Name" value={form.companyName} onChange={(e) => onChange({ ...form, companyName: e.target.value })} />
            </div>
            <textarea className="min-h-[92px] w-full rounded-md border border-slate-200 p-3" placeholder="Details about the background and situation of your interview" value={form.details} onChange={(e) => onChange({ ...form, details: e.target.value })} />
            <select
              className="h-10 w-full rounded-md border border-slate-200 px-3"
              value={form.interviewLanguage}
              onChange={(e) => onChange({ ...form, interviewLanguage: e.target.value })}
            >
              <option value="English (USA)">English (USA)</option>
              <option value="Russian">Russian</option>
              <option value="Kazakh">Kazakh</option>
              <option value="German">German</option>
              <option value="French">French</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.translateEnabled}
                onChange={(e) => onChange({ ...form, translateEnabled: e.target.checked })}
              />
              Enable Translate (Qwen Translate WebSocket)
            </label>
            {form.translateEnabled ? (
              <select
                className="h-10 w-full rounded-md border border-slate-200 px-3"
                value={form.translateLanguage}
                onChange={(e) => onChange({ ...form, translateLanguage: e.target.value })}
              >
                <option value="en">Translate to English</option>
                <option value="ru">Translate to Russian</option>
                <option value="kk">Translate to Kazakh</option>
                <option value="de">Translate to German</option>
                <option value="fr">Translate to French</option>
              </select>
            ) : null}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.codingAssistant} onChange={(e) => onChange({ ...form, codingAssistant: e.target.checked })} />
              Coding Assistant
            </label>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Answer Suggestions</p>
            <input className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="My Profile / Assistant name" value={form.profileName} onChange={(e) => onChange({ ...form, profileName: e.target.value })} />
            <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              <p className="mb-2">Upload resume to create a new profile</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="block w-full text-xs"
                onChange={(e) => onResumeFileChange(e.target.files?.[0] || null)}
              />
              <p className="mt-2 text-xs text-slate-500">{resumeStatus}</p>
            </div>
            <input className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="Suggestions Tone" value={form.suggestionTone} onChange={(e) => onChange({ ...form, suggestionTone: e.target.value })} />
            <input className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="Prompt Style" value={form.promptStyle} onChange={(e) => onChange({ ...form, promptStyle: e.target.value })} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

