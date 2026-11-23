import assert from 'node:assert/strict'
import test from 'node:test'
import { requestSuggestions } from './suggestion-request'
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
  assert.deepEqual(previews, ['Short answer'])
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
