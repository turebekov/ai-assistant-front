'use client'

import { Button } from '@/components/ui/button'
import type {
  AssistantFormFieldErrors,
  AssistantFormFieldErrorKey,
  AssistantSettingsForm,
} from '@/entities/assistant/model/types'
import { cn } from '@/lib/utils'

interface AssistantSettingsModalProps {
  open: boolean
  form: AssistantSettingsForm
  onChange: (next: AssistantSettingsForm) => void
  fieldErrors?: AssistantFormFieldErrors
  /** Clear server/client error for one field after user edits it */
  onClearFieldError?: (key: AssistantFormFieldErrorKey) => void
  resumeStatus: string
  isSaving: boolean
  mode: 'create' | 'edit'
  assistantKind: 'interview' | 'meeting'
  onResumeFileChange: (file: File | null) => void
  onClose: () => void
  onSave: () => void
}

function fieldLabel(text: string, required: boolean) {
  return (
    <label className="block text-xs font-medium text-slate-700">
      {text}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  )
}

export function AssistantSettingsModal({
  open,
  form,
  onChange,
  fieldErrors = {},
  onClearFieldError,
  resumeStatus,
  isSaving,
  mode,
  assistantKind,
  onResumeFileChange,
  onClose,
  onSave,
}: AssistantSettingsModalProps) {
  if (!open) return null

  const req = mode === 'create'

  const inputCn = (key: AssistantFormFieldErrorKey) =>
    cn(
      'h-10 w-full rounded-md border px-3',
      fieldErrors[key] ? 'border-red-500 ring-1 ring-red-500/30' : 'border-slate-200',
    )

  const textareaCn = (key: AssistantFormFieldErrorKey) =>
    cn(
      'min-h-[92px] w-full rounded-md border p-3',
      fieldErrors[key] ? 'border-red-500 ring-1 ring-red-500/30' : 'border-slate-200',
    )

  const Err = ({ field }: { field: AssistantFormFieldErrorKey }) =>
    fieldErrors[field] ? <p className="text-xs font-medium text-red-600">{fieldErrors[field]}</p> : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            {mode === 'edit' ? 'Edit Assistant' : 'Create Assistant'}
          </h2>
          <button type="button" className="text-slate-500 hover:text-slate-800" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {assistantKind === 'meeting' ? 'Meeting Setup' : 'Interview'}
            </p>
            <div className="space-y-1">
              {fieldLabel(
                assistantKind === 'meeting' ? 'Meeting Type' : 'Interview Type',
                req,
              )}
              <input
                className={inputCn('interviewType')}
                placeholder={assistantKind === 'meeting' ? 'Meeting Type' : 'Interview Type'}
                value={form.interviewType}
                onChange={(e) => {
                  onClearFieldError?.('interviewType')
                  onChange({ ...form, interviewType: e.target.value })
                }}
              />
              <Err field="interviewType" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                {fieldLabel('Role Name', req)}
                <input
                  className={inputCn('roleName')}
                  placeholder="Role Name"
                  value={form.roleName}
                  onChange={(e) => {
                    onClearFieldError?.('roleName')
                    onChange({ ...form, roleName: e.target.value })
                  }}
                />
                <Err field="roleName" />
              </div>
              <div className="space-y-1">
                {fieldLabel('Company Name', false)}
                <input
                  className={inputCn('companyName')}
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={(e) => {
                    onClearFieldError?.('companyName')
                    onChange({ ...form, companyName: e.target.value })
                  }}
                />
                <Err field="companyName" />
              </div>
            </div>
            <div className="space-y-1">
              {fieldLabel(
                assistantKind === 'meeting'
                  ? 'Meeting context & goals'
                  : 'Interview background',
                false,
              )}
              <textarea
                className={textareaCn('details')}
                placeholder={
                  assistantKind === 'meeting'
                    ? 'Details about your meeting context and goals'
                    : 'Details about the background and situation of your interview'
                }
                value={form.details}
                onChange={(e) => {
                  onClearFieldError?.('details')
                  onChange({ ...form, details: e.target.value })
                }}
              />
              <Err field="details" />
            </div>
            <div className="space-y-1">
              {fieldLabel('Interview / session language', false)}
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
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.translateEnabled}
                onChange={(e) => onChange({ ...form, translateEnabled: e.target.checked })}
              />
              Enable Translate
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
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {assistantKind === 'meeting' ? 'Meeting Context' : 'Answer Suggestions'}
            </p>
            <div className="space-y-1">
              {fieldLabel('Assistant name', req)}
              <input
                className={inputCn('profileName')}
                placeholder="My Profile / Assistant name"
                value={form.profileName}
                onChange={(e) => {
                  onClearFieldError?.('profileName')
                  onChange({ ...form, profileName: e.target.value })
                }}
              />
              <Err field="profileName" />
            </div>
            <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              <p className="mb-2">
                {assistantKind === 'meeting'
                  ? 'Upload context file for meeting assistant'
                  : 'Upload resume to create a new profile'}
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="block w-full text-xs"
                onChange={(e) =>
                  onResumeFileChange(e.target.files?.[0] || null)
                }
              />
              <p className="mt-2 text-xs text-slate-500">{resumeStatus}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="neutral" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : mode === 'edit' ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
