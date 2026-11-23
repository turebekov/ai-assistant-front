import type { PromptStyle } from './suggestion-preferences'

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
    if (variant === 'Concise') onConcise?.(suggestion)
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

  const suggestion = results.map((result, index) => {
    const text = result.status === 'fulfilled' ? result.value : 'Unable to generate this answer.'
    return `**${styles[index]}:**\n${text}`
  }).join('\n\n')

  return { suggestion, partialFailure: errors.length > 0 }
}
