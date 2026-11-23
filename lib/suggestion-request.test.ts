import assert from 'node:assert/strict'
import test from 'node:test'
import { requestSuggestions, suggestionEndpoint } from './suggestion-request'
import type { PromptStyle } from './suggestion-preferences'

test('Detailed starts both requests and shows the concise result before detailed finishes', async () => {
  const calls: PromptStyle[] = []
  let resolveDetailed: (value: string) => void = () => { throw new Error('Detailed was not requested') }
  const previews: string[] = []
  const resultPromise = requestSuggestions('Detailed', (style) => {
    calls.push(style)
    if (style === 'Concise') return Promise.resolve('Short answer')
    return new Promise<string>((resolve) => { resolveDetailed = resolve })
  }, (suggestion) => previews.push(suggestion))

  assert.deepEqual(calls, ['Concise', 'Detailed'])
  await Promise.resolve()
  assert.deepEqual(previews, ['**Concise:**\nShort answer'])
  resolveDetailed('Long answer')
  assert.deepEqual(await resultPromise, {
    suggestion: '**Concise:**\nShort answer\n\n**Detailed:**\nLong answer',
    partialFailure: false,
  })
})

test('Detailed preserves order when the detailed request finishes first', async () => {
  let resolveConcise: (value: string) => void = () => { throw new Error('Concise was not requested') }
  const resultPromise = requestSuggestions('Detailed', (style) => {
    if (style === 'Detailed') return Promise.resolve('Long answer')
    return new Promise<string>((resolve) => { resolveConcise = resolve })
  })
  await Promise.resolve()
  resolveConcise('Short answer')
  assert.equal((await resultPromise).suggestion, '**Concise:**\nShort answer\n\n**Detailed:**\nLong answer')
})

test('Detailed keeps the successful answer when the other request fails', async () => {
  const result = await requestSuggestions('Detailed', async (style) => {
    if (style === 'Concise') throw new Error('unavailable')
    return 'Long answer'
  })
  assert.equal(result.partialFailure, true)
  assert.equal(result.suggestion, '**Concise:**\nUnable to generate this answer.\n\n**Detailed:**\nLong answer')
})

test('Detailed reports an error if both requests fail', async () => {
  await assert.rejects(
    requestSuggestions('Detailed', async (style) => { throw new Error(`${style} unavailable`) }),
    /Concise: Concise unavailable; Detailed: Detailed unavailable/,
  )
})

test('other styles make one unchanged request', async () => {
  const calls: PromptStyle[] = []
  const result = await requestSuggestions('Bullet Points Only', async (style) => {
    calls.push(style)
    return 'One answer'
  })

  assert.deepEqual(calls, ['Bullet Points Only'])
  assert.deepEqual(result, { suggestion: 'One answer', partialFailure: false })
})

test('Detailed uses Groq first and the selected provider second', () => {
  assert.equal(suggestionEndpoint(false, 'Detailed', 'Concise'), '/api/suggest')
  assert.equal(suggestionEndpoint(false, 'Detailed', 'Detailed'), '/api/suggest-qwen-max')
  assert.equal(suggestionEndpoint(true, 'Detailed', 'Concise'), '/api/suggest')
  assert.equal(suggestionEndpoint(true, 'Detailed', 'Detailed'), '/api/suggest-claude')
  assert.equal(suggestionEndpoint(false, 'Concise', 'Concise'), '/api/suggest')
  assert.equal(suggestionEndpoint(true, 'Concise', 'Concise'), '/api/suggest-claude')
})

test('Detailed shows one question above both answers, including in the preview', async () => {
  let preview = ''
  const result = await requestSuggestions('Detailed', async (style) =>
    style === 'Concise'
      ? '**Question:** Explain the event loop.\n\nShort answer'
      : '**Question:** Explain the event loop in JavaScript.\n\nLong answer',
  (suggestion) => { preview = suggestion })

  assert.equal(preview, '**Question:** Explain the event loop.\n\n**Concise:**\nShort answer')
  assert.equal(
    result.suggestion,
    '**Question:** Explain the event loop.\n\n**Concise:**\nShort answer\n\n**Detailed:**\nLong answer',
  )
})

test('Detailed keeps the question from the successful response on partial failure', async () => {
  const result = await requestSuggestions('Detailed', async (style) => {
    if (style === 'Concise') throw new Error('unavailable')
    return '**Question / topic:** Next steps?\n\nLong answer'
  })
  assert.equal(
    result.suggestion,
    '**Question / topic:** Next steps?\n\n**Concise:**\nUnable to generate this answer.\n\n**Detailed:**\nLong answer',
  )
})

test('Detailed keeps a question when only the detailed answer includes one', async () => {
  const result = await requestSuggestions('Detailed', async (style) =>
    style === 'Concise' ? 'Short answer' : 'Question: How?\n\nLong answer',
  )
  assert.equal(result.suggestion, 'Question: How?\n\n**Concise:**\nShort answer\n\n**Detailed:**\nLong answer')
})
