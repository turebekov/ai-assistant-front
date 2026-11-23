import type { PromptStyle } from './suggestion-preferences'

export function suggestionEndpoint(useClaude: boolean, style: PromptStyle, variant: PromptStyle): string {
  if (style === 'Detailed') {
    if (variant === 'Concise') return '/api/suggest'
    return useClaude ? '/api/suggest-claude' : '/api/suggest-qwen-max'
  }
  return useClaude ? '/api/suggest-claude' : '/api/suggest'
}

function splitQuestion(suggestion: string): { question: string; answer: string } {
  const match = suggestion.match(/^\s*(\*\*Question(?:\s*\d+)?(?:\s*\/\s*topic)?:\*\*[ \t]*[^\r\n]+|Question:[ \t]*[^\r\n]+)(?:\r?\n|$)/i)
  if (!match) return { question: '', answer: suggestion.trim() }
  return { question: match[1], answer: suggestion.slice(match[0].length).trim() }
}

function formatDetailedAnswers(concise: string, detailed?: string): string {
  const short = splitQuestion(concise)
  const long = detailed === undefined ? undefined : splitQuestion(detailed)
  return [
    short.question || long?.question,
    `**Concise:**\n${short.answer}`,
    long && `**Detailed:**\n${long.answer}`,
  ].filter(Boolean).join('\n\n')
}

export async function requestSuggestions(
  style: PromptStyle,
  request: (style: PromptStyle) => Promise<string>,
  onConcise?: (suggestion: string) => void,
): Promise<{ suggestion: string; partialFailure: boolean }> {
  if (style !== 'Detailed') {
    return { suggestion: await request(style), partialFailure: false }
  }

  const styles = ['Concise', 'Detailed'] as const
  const results = await Promise.allSettled(styles.map((variant) => request(variant).then((suggestion) => {
    if (variant === 'Concise') onConcise?.(formatDetailedAnswers(suggestion))
    return suggestion
  })))
  const errors = results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return []
    const message = result.reason instanceof Error ? result.reason.message : String(result.reason)
    console.error(`[suggestion:${styles[index]}] failed`, message)
    return [`${styles[index]}: ${message}`]
  })

  if (errors.length === styles.length) {
    throw new Error(errors.join('; '))
  }

  const answers = results.map((result) =>
    result.status === 'fulfilled' ? result.value : 'Unable to generate this answer.',
  )
  const suggestion = formatDetailedAnswers(answers[0], answers[1])

  return { suggestion, partialFailure: errors.length > 0 }
}
