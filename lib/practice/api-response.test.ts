import assert from 'node:assert/strict'
import test from 'node:test'
import { readPracticeResponse } from './api-response'

test('reports an HTML 404 as a missing API route instead of a JSON error', async () => {
  const response = new Response('<!DOCTYPE html>', { status: 404, headers: { 'Content-Type': 'text/html' } })
  await assert.rejects(readPracticeResponse(response), /HTTP 404.*restart the backend/)
})

test('reports invalid JSON and preserves API errors', async () => {
  const invalid = new Response('{', { headers: { 'Content-Type': 'application/json' } })
  await assert.rejects(readPracticeResponse(invalid), /invalid JSON/)
  const denied = new Response(JSON.stringify({ error: 'Unauthorized.' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  await assert.rejects(readPracticeResponse(denied), /Unauthorized/)
})

test('returns a valid JSON response', async () => {
  const response = new Response(JSON.stringify({ languages: [{ code: 'en', label: 'English' }] }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
  assert.deepEqual(await readPracticeResponse(response), { languages: [{ code: 'en', label: 'English' }] })
})
