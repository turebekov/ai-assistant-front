'use client'

import { useCallback, useState } from 'react'
import type {
  AssistantFormFieldErrors,
  AssistantFormFieldErrorKey,
  AssistantProfile,
  AssistantSettingsForm,
} from '@/entities/assistant/model/types'
import { apiUrl } from '@/lib/api-url'
import { DEFAULT_FONT_SIZE, normalizeFontSize } from '@/lib/font-size'
import { DEFAULT_LANGUAGE_CODE, toFormLanguageValue } from '@/lib/languages'

function defaultForm(): AssistantSettingsForm {
  return {
    interviewType: 'Job Interview',
    roleName: '',
    companyName: '',
    details: '',
    interviewLanguage: DEFAULT_LANGUAGE_CODE,
    translateEnabled: false,
    translateLanguage: DEFAULT_LANGUAGE_CODE,
    profileName: '',
    suggestionTone: 'Friendly',
    promptStyle: 'Concise',
    fontSize: DEFAULT_FONT_SIZE,
    codingAssistant: false,
  }
}

type UseAssistantSettingsModalOptions = {
  assistantKind: 'interview' | 'meeting'
  /** After successful create — redirect to session URL */
  redirectOnCreate?: (assistantId: string) => void
  /** After successful edit/create (no redirect) */
  onSaved?: (assistant: AssistantProfile) => void
  onListRefresh?: () => void | Promise<void>
}

export function useAssistantSettingsModal({
  assistantKind,
  redirectOnCreate,
  onSaved,
  onListRefresh,
}: UseAssistantSettingsModalOptions) {
  const isMeetings = assistantKind === 'meeting'
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [existingResumeText, setExistingResumeText] = useState('')
  const [existingStorageKey, setExistingStorageKey] = useState('')
  const [existingFileName, setExistingFileName] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeStatus, setResumeStatus] = useState(
    isMeetings ? 'No file selected' : 'No resume selected',
  )
  const [saveError, setSaveError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<AssistantFormFieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<AssistantSettingsForm>(defaultForm)

  const resetForm = useCallback(() => {
    setForm(defaultForm())
    setResumeFile(null)
    setExistingResumeText('')
    setExistingStorageKey('')
    setExistingFileName('')
    setResumeStatus(isMeetings ? 'No file selected' : 'No resume selected')
    setSaveError('')
    setFieldErrors({})
  }, [isMeetings])

  const close = useCallback(() => {
    setOpen(false)
    setMode('create')
    setEditingId(null)
    resetForm()
  }, [resetForm])

  const clearFieldError = useCallback((key: AssistantFormFieldErrorKey) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const openCreate = useCallback(() => {
    setMode('create')
    setEditingId(null)
    resetForm()
    setOpen(true)
  }, [resetForm])

  const openEdit = useCallback(
    (assistant: AssistantProfile) => {
      setMode('edit')
      setEditingId(assistant.id)
      setExistingResumeText(
        String(
          isMeetings
            ? assistant.contextText || assistant.context_text || ''
            : assistant.resumeText || assistant.resume_text || '',
        ).trim(),
      )
      setExistingStorageKey(
        String(isMeetings ? assistant.contextStorageKey || '' : assistant.resumeStorageKey || ''),
      )
      setExistingFileName(
        String(isMeetings ? assistant.contextFileName || '' : assistant.resumeFileName || ''),
      )
      setResumeFile(null)
      setResumeStatus(
        isMeetings
          ? assistant.contextStorageKey
            ? `Uploaded: ${assistant.contextFileName || 'context file'}`
            : assistant.contextText || assistant.context_text
              ? 'Context text already saved'
            : 'No file selected'
          : assistant.resumeStorageKey
            ? `Uploaded: ${assistant.resumeFileName || 'resume'}`
            : assistant.resumeText || assistant.resume_text
              ? 'Resume text already saved'
            : 'No resume selected',
      )
      setSaveError('')
      setFieldErrors({})
      setForm({
        interviewType: String(assistant.interviewType || 'Job Interview'),
        roleName: String(assistant.roleName || ''),
        companyName: String(assistant.company || ''),
        details: String(assistant.details || ''),
        interviewLanguage: toFormLanguageValue(String(assistant.language || DEFAULT_LANGUAGE_CODE)),
        translateEnabled: Boolean(assistant.translateEnabled),
        translateLanguage: toFormLanguageValue(
          String(assistant.translateLanguage || DEFAULT_LANGUAGE_CODE),
        ),
        profileName: String(assistant.name || ''),
        suggestionTone: String(assistant.tone || 'Friendly'),
        promptStyle: String(assistant.promptStyle || 'Concise'),
        fontSize: normalizeFontSize(assistant.fontSize ?? assistant.font_size),
        codingAssistant: Boolean(assistant.codingAssistant),
      })
      setOpen(true)
    },
    [isMeetings],
  )

  const onResumeFileChange = useCallback(
    (file: File | null) => {
      setResumeFile(file)
      setResumeStatus(
        file
            ? `Selected: ${file.name}`
          : isMeetings
            ? 'No file selected'
            : 'No resume selected',
      )
    },
    [isMeetings],
  )

  const onDownloadResume = useCallback(async () => {
    if (!editingId) return
    const token = localStorage.getItem('auth_token') || ''
    const endpoint = isMeetings
      ? `/api/meeting-assistants/${encodeURIComponent(editingId)}/context/download`
      : `/api/assistants/${encodeURIComponent(editingId)}/resume/download`
    const response = await fetch(apiUrl(endpoint), {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      setResumeStatus('Download failed')
      return
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = isMeetings ? 'meeting-context' : 'resume'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }, [editingId, isMeetings])

  const onSave = useCallback(async () => {
    setSaveError('')
    if (mode === 'create') {
      const t = (s: string) => String(s || '').trim()
      const required = 'This field is required.'
      const next: AssistantFormFieldErrors = {}
      if (!t(form.profileName)) next.profileName = required
      if (!t(form.interviewType)) next.interviewType = required
      if (!t(form.roleName)) next.roleName = required
      setFieldErrors(next)
      if (Object.keys(next).length > 0) return
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
    let storageKey = existingStorageKey
    let fileName = existingFileName
    if (resumeFile) {
      setResumeStatus(isMeetings ? 'Parsing file...' : 'Parsing resume...')
      const formData = new FormData()
      formData.append('resume', resumeFile, resumeFile.name)
      let parseResponse: Response
      try {
        parseResponse = await fetch(
          apiUrl(isMeetings ? '/api/context/parse' : '/api/resume/parse'),
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        )
      } catch (error) {
        setResumeStatus(
          `File error: ${error instanceof Error ? error.message : 'Upload request failed'}`,
        )
        setIsSaving(false)
        return
      }
      const parsePayload = (await parseResponse.json().catch(() => ({}))) as {
        text?: string
        storageKey?: string | null
        originalName?: string
        error?: string
        details?: string
      }
      if (!parseResponse.ok) {
        setResumeStatus(`File error: ${parsePayload.details || parsePayload.error || 'Parse failed'}`)
        setIsSaving(false)
        return
      }
      resumeText = String(parsePayload.text || '').trim()
      storageKey = String(parsePayload.storageKey || '').trim()
      fileName = String(parsePayload.originalName || resumeFile.name).trim()
      setExistingFileName(fileName)
      setResumeStatus(
        resumeText
          ? `${isMeetings ? 'File' : 'Resume'} loaded (${resumeFile.name})`
          : `${isMeetings ? 'File' : 'Resume'} empty (${resumeFile.name})`,
      )
    }

    const baseEndpoint = isMeetings ? '/api/meeting-assistants' : '/api/assistants'
    const endpoint =
      mode === 'edit' && editingId
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
        resumeStorageKey: isMeetings ? '' : storageKey,
        resume_storage_key: isMeetings ? '' : storageKey,
        resumeFileName: isMeetings ? '' : fileName,
        resume_file_name: isMeetings ? '' : fileName,
        contextText: isMeetings ? resumeText : '',
        context_text: isMeetings ? resumeText : '',
        contextStorageKey: isMeetings ? storageKey : '',
        context_storage_key: isMeetings ? storageKey : '',
        contextFileName: isMeetings ? fileName : '',
        context_file_name: isMeetings ? fileName : '',
        tone: form.suggestionTone,
        promptStyle: form.promptStyle,
        fontSize: form.fontSize,
        codingAssistant: form.codingAssistant,
      }),
    })

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => ({}))) as {
        error?: string
        details?: string
      }
      setSaveError(errorPayload.details || errorPayload.error || 'Assistant save failed')
      setIsSaving(false)
      return
    }

    const payload = (await response.json().catch(() => ({}))) as { assistant?: AssistantProfile }
    const saved = payload.assistant
    const createdId = String(saved?.id || '').trim()

    if (mode === 'create' && createdId && redirectOnCreate) {
      redirectOnCreate(createdId)
      return
    }

    if (saved) {
      onSaved?.(saved)
    }
    await onListRefresh?.()
    close()
    setIsSaving(false)
  }, [
    close,
    editingId,
    existingStorageKey,
    existingFileName,
    existingResumeText,
    form,
    isMeetings,
    mode,
    onListRefresh,
    onSaved,
    redirectOnCreate,
    resumeFile,
  ])

  return {
    open,
    mode,
    form,
    setForm,
    fieldErrors,
    clearFieldError,
    resumeStatus,
    resumeFileName: existingFileName,
    isSaving,
    saveError,
    openCreate,
    openEdit,
    close,
    onSave,
    onResumeFileChange,
    onDownloadResume,
  }
}
