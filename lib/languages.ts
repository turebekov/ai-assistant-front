export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', audio: true, text: true },
  { code: 'zh', label: 'Chinese', audio: true, text: true },
  { code: 'ru', label: 'Russian', audio: true, text: true },
  { code: 'fr', label: 'French', audio: true, text: true },
  { code: 'de', label: 'German', audio: true, text: true },
  { code: 'pt', label: 'Portuguese', audio: true, text: true },
  { code: 'es', label: 'Spanish', audio: true, text: true },
  { code: 'it', label: 'Italian', audio: true, text: true },
  { code: 'ko', label: 'Korean', audio: true, text: true },
  { code: 'ja', label: 'Japanese', audio: true, text: true },
  { code: 'yue', label: 'Cantonese', audio: true, text: true },
] as const

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

/** Languages supported by the realtime ASR / translation model (audio + text). */
export type SupportedLanguage = {
  code: SupportedLanguageCode
  label: string
  audio: boolean
  text: boolean
}

export const DEFAULT_LANGUAGE_CODE: SupportedLanguageCode = 'ru'

const LANGUAGE_BY_CODE = new Map(
  SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang] as const),
)

/** Comma-separated labels for marketing copy (FAQ, features, SEO). */
export function formatSupportedLanguagesList(
  conjunction: 'and' | 'or' = 'and',
): string {
  const labels = SUPPORTED_LANGUAGES.map((l) => l.label)
  if (labels.length <= 1) return labels[0] ?? ''
  const head = labels.slice(0, -1).join(', ')
  const last = labels[labels.length - 1]
  return `${head}, ${conjunction} ${last}`
}

export function getLanguageByCode(code: string): SupportedLanguage | undefined {
  return LANGUAGE_BY_CODE.get(code as SupportedLanguageCode)
}

export function getLanguageLabel(code: string): string {
  return getLanguageByCode(code)?.label ?? code
}

/** Map stored assistant / session language values to a supported ISO code. */
export function normalizeInterviewLanguage(language: string): SupportedLanguageCode {
  const raw = String(language || '').trim()
  if (!raw) return DEFAULT_LANGUAGE_CODE

  const lower = raw.toLowerCase()
  const direct = getLanguageByCode(lower)
  if (direct) return direct.code

  for (const lang of SUPPORTED_LANGUAGES) {
    if (lower.includes(lang.label.toLowerCase())) return lang.code
  }

  // Legacy values from older assistants
  if (lower.includes('english') || lower === 'en' || lower.startsWith('en-')) return 'en'
  if (lower.includes('kazakh') || lower === 'kk') return 'ru'

  return DEFAULT_LANGUAGE_CODE
}

/** Normalize legacy DB label or code to a value valid for form selects. */
export function toFormLanguageValue(language: string): SupportedLanguageCode {
  return normalizeInterviewLanguage(language)
}
