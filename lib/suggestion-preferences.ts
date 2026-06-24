export const SUGGESTION_TONES = [
  'Friendly',
  'Formal',
  'Confident',
  'Humble',
] as const

export const PROMPT_STYLES = [
  'Concise',
  'Detailed',
  'Plain Text',
  'Bullet Points Only',
  'Custom',
] as const

export type SuggestionTone = (typeof SUGGESTION_TONES)[number]
export type PromptStyle = (typeof PROMPT_STYLES)[number]

export const DEFAULT_SUGGESTION_TONE: SuggestionTone = 'Friendly'
export const DEFAULT_PROMPT_STYLE: PromptStyle = 'Concise'

export function normalizeSuggestionTone(value: string | undefined | null): SuggestionTone {
  const match = SUGGESTION_TONES.find(
    (tone) => tone.toLowerCase() === String(value || '').trim().toLowerCase(),
  )
  return match ?? DEFAULT_SUGGESTION_TONE
}

export function normalizePromptStyle(value: string | undefined | null): PromptStyle {
  const raw = String(value || '').trim().toLowerCase()
  const match = PROMPT_STYLES.find((style) => style.toLowerCase() === raw)
  return match ?? DEFAULT_PROMPT_STYLE
}
