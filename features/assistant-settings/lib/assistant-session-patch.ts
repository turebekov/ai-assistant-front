import type { AssistantProfile } from '@/entities/assistant/model/types'
import { DEFAULT_FONT_SIZE, normalizeFontSize, type FontSizePx } from '@/lib/font-size'
import {
  DEFAULT_LANGUAGE_CODE,
  normalizeInterviewLanguage,
  toFormLanguageValue,
  type SupportedLanguageCode,
} from '@/lib/languages'
import {
  DEFAULT_PROMPT_STYLE,
  DEFAULT_SUGGESTION_TONE,
  normalizePromptStyle,
  normalizeSuggestionTone,
  type PromptStyle,
  type SuggestionTone,
} from '@/lib/suggestion-preferences'

export type AssistantSessionPatch = {
  role: string
  targetPosition: string
  pipeline: 'realtime_asr' | 'realtime_translate'
  translateTarget: SupportedLanguageCode
  resumeText: string
  resumeStatus: string
  primaryInterviewLanguage: SupportedLanguageCode
  transcriptLanguage: string
  suggestionTone: SuggestionTone
  promptStyle: PromptStyle
  panelFontSize: FontSizePx
}

export function getAssistantSessionPatch(
  selected: AssistantProfile,
  mode: 'interview' | 'meetings',
): AssistantSessionPatch {
  const nextRole = String(selected.roleName || 'general').trim().toLowerCase() || 'general'
  const nextResumeText = (() => {
    if (mode === 'meetings') {
      const ctx = String(selected.contextText ?? selected.context_text ?? '').trim()
      if (ctx) return ctx
    }
    return String(selected.resumeText ?? selected.resume_text ?? '').trim()
  })()

  return {
    role: nextRole,
    targetPosition: String(selected.company || '').trim(),
    pipeline: selected.translateEnabled ? 'realtime_translate' : 'realtime_asr',
    translateTarget: toFormLanguageValue(
      String(selected.translateLanguage || DEFAULT_LANGUAGE_CODE),
    ),
    resumeText: nextResumeText,
    resumeStatus:
      mode === 'meetings'
        ? nextResumeText
          ? 'Meeting context loaded from assistant'
          : 'No meeting context'
        : nextResumeText
          ? 'Resume loaded from assistant settings'
          : 'No resume',
    primaryInterviewLanguage: normalizeInterviewLanguage(String(selected.language || '')),
    transcriptLanguage: normalizeInterviewLanguage(String(selected.language || '')),
    suggestionTone: normalizeSuggestionTone(selected.tone || DEFAULT_SUGGESTION_TONE),
    promptStyle: normalizePromptStyle(selected.promptStyle || DEFAULT_PROMPT_STYLE),
    panelFontSize: normalizeFontSize(selected.fontSize ?? selected.font_size ?? DEFAULT_FONT_SIZE),
  }
}
