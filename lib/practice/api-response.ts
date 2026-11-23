export async function readPracticeResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    if (response.status === 404) {
      throw new Error('Practice API endpoint not found (HTTP 404). Update or restart the backend server and try again.')
    }
    throw new Error(`Practice API returned an unexpected response (HTTP ${response.status}). Check the backend connection.`)
  }

  let payload: T & { error?: string }
  try {
    payload = await response.json() as T & { error?: string }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Practice API returned invalid JSON (HTTP ${response.status}).`)
    }
    throw error
  }
  if (!response.ok) throw new Error(payload?.error || `Practice API request failed (HTTP ${response.status}).`)
  return payload
}
