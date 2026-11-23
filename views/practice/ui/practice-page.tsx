'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Flame, Snowflake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiUrl } from '@/lib/api-url'
import { readPracticeResponse } from '@/lib/practice/api-response'

type Question = {
  id: string
  category: string
  role: string
  level: string
  topic: string
  language: string
  question: string
  code: string
  options: string[]
  saved?: boolean
}
type Answer = { correctIndex: number; explanation: string }
type Rating = 'know' | 'unsure' | 'dont-know'
type Streak = { currentDays: number; completedToday: boolean; freezesRemaining: number; lastFrozenDay: string | null }
type PracticeLanguage = { code: string; label: string }
type QuestionSettings = Pick<Question, 'category' | 'role' | 'level' | 'topic' | 'language'>

function localTimeZone(): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!timeZone) throw new Error('Could not determine your time zone.')
  return timeZone
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token')
  if (!token) throw new Error('Please sign in again.')
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init?.headers },
  })
  return readPracticeResponse<T>(response)
}

const fieldClass = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm'

function QuestionBody({ question }: { question: Question }) {
  return (
    <>
      <p className="whitespace-pre-wrap font-medium">{question.question}</p>
      {question.code && (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
          <code>{question.code}</code>
        </pre>
      )}
    </>
  )
}

export function PracticePage() {
  const [category, setCategory] = useState('technical')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('junior')
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('en')
  const [languages, setLanguages] = useState<PracticeLanguage[]>([])
  const [languageError, setLanguageError] = useState('')
  const [languageRevision, setLanguageRevision] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [cards, setCards] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [cardAnswer, setCardAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [nextGenerated, setNextGenerated] = useState<Set<string>>(new Set())
  const [nextErrors, setNextErrors] = useState<Record<string, string>>({})
  const [revision, setRevision] = useState(0)
  const [streak, setStreak] = useState<Streak | null>(null)
  const [streakError, setStreakError] = useState('')
  const streakRequest = useRef(0)

  const refresh = useCallback(() => setRevision((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setLanguageError('')
    request<{ languages: PracticeLanguage[] }>('/api/practice/languages', { signal: controller.signal })
      .then((result) => {
        if (!Array.isArray(result.languages) || result.languages.length === 0) {
          throw new Error('Practice API returned an invalid language list.')
        }
        setLanguages(result.languages)
        setLanguageError('')
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setLanguageError(err instanceof Error ? err.message : 'Could not load languages.')
      })
    return () => controller.abort()
  }, [languageRevision])

  useEffect(() => {
    let active = true
    async function loadStreak() {
      const requestId = ++streakRequest.current
      try {
        const timeZone = localTimeZone()
        const result = await request<{ streak: Streak }>(`/api/practice/streak?${new URLSearchParams({ timeZone })}`)
        if (active && requestId === streakRequest.current) {
          setStreak(result.streak)
          setStreakError('')
        }
      } catch (err) {
        if (active && requestId === streakRequest.current) {
          setStreak(null)
          setStreakError(err instanceof Error ? err.message : 'Could not load streak.')
        }
      }
    }
    let timer: number
    const scheduleNextDay = () => {
      const nextDay = new Date()
      nextDay.setHours(24, 0, 1, 0)
      timer = window.setTimeout(() => {
        void loadStreak()
        scheduleNextDay()
      }, nextDay.getTime() - Date.now())
    }
    void loadStreak()
    scheduleNextDay()
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer)
        void loadStreak()
        scheduleNextDay()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const params = new URLSearchParams({ category, level, role: role.trim() })
    Promise.all([
      request<{ questions: Question[] }>(`/api/practice/questions?${params}`, { signal: controller.signal }),
      request<{ cards: Question[] }>('/api/practice/cards/due', { signal: controller.signal }),
    ]).then(([bank, due]) => {
      setQuestions(bank.questions)
      setCards(due.cards)
    }).catch((err: unknown) => {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Could not load practice.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [category, level, role, revision])

  async function generateQuestion(settings: QuestionSettings, afterId?: string) {
    setGenerating(true)
    try {
      const { question } = await request<{ question: Question }>('/api/practice/questions/generate', {
        method: 'POST',
        body: JSON.stringify(settings),
      })
      setQuestions((previous) => {
        const index = afterId ? previous.findIndex((item) => item.id === afterId) : -1
        if (index < 0) return [question, ...previous]
        return [...previous.slice(0, index + 1), question, ...previous.slice(index + 1)]
      })
      if (afterId) {
        setNextGenerated((previous) => new Set(previous).add(afterId))
        setNextErrors((previous) => {
          const next = { ...previous }
          delete next[afterId]
          return next
        })
      }
    } finally {
      setGenerating(false)
    }
  }

  async function generate() {
    if (!role.trim()) {
      setError('Enter a role before generating a question.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await generateQuestion({ category, role: role.trim(), level, topic: topic.trim(), language })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate question.')
    } finally {
      setBusy(false)
    }
  }

  async function generateNext(question: Question) {
    try {
      await generateQuestion({
        category: question.category,
        role: question.role,
        level: question.level,
        topic: question.topic,
        language: question.language,
      }, question.id)
    } catch (err) {
      setNextErrors((previous) => ({
        ...previous,
        [question.id]: err instanceof Error ? err.message : 'Could not generate the next question.',
      }))
    }
  }

  async function retryNext(question: Question) {
    setBusy(true)
    await generateNext(question)
    setBusy(false)
  }

  async function showAnswer(question: Question, card = false) {
    setBusy(true)
    setError('')
    try {
      if (card) {
        const answer = await request<Answer>(`/api/practice/questions/${question.id}/answer`)
        setCardAnswer(answer)
      } else {
        const answer = await request<Answer & { streak: Streak }>(`/api/practice/questions/${question.id}/answer`, {
          method: 'POST',
          body: JSON.stringify({ selectedIndex: selected[question.id], timeZone: localTimeZone() }),
        })
        streakRequest.current += 1
        setStreak(answer.streak)
        setStreakError('')
        setAnswers((previous) => ({ ...previous, [question.id]: answer }))
        if (!nextGenerated.has(question.id)) await generateNext(question)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load answer.')
    } finally {
      setBusy(false)
    }
  }

  async function saveCard(question: Question) {
    setBusy(true)
    setError('')
    try {
      await request(`/api/practice/questions/${question.id}/card`, { method: 'POST' })
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save card.')
    } finally {
      setBusy(false)
    }
  }

  async function rateCard(rating: Rating) {
    const card = cards[0]
    if (!card || !cardAnswer) return
    setBusy(true)
    setError('')
    try {
      await request(`/api/practice/cards/${card.id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating }),
      })
      setCardAnswer(null)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save rating.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Interview practice</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate questions with Groq and review your saved flashcards. AI answers can contain mistakes.
          A new question is generated automatically after each answer.
        </p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        {streak ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Flame className="h-7 w-7 text-orange-500" aria-hidden="true" />
              <div>
                <p className="font-semibold">{streak.currentDays} day streak</p>
                <p className="text-sm">{streak.completedToday ? 'Practice completed today!' : 'Answer a question to complete today.'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Snowflake className="h-4 w-4" aria-hidden="true" />
              <span>{streak.freezesRemaining} freeze left this month · applied automatically{streak.lastFrozenDay && ` · last used ${streak.lastFrozenDay}`}</span>
            </div>
          </div>
        ) : <p className="text-sm">{streakError ? 'Streak unavailable.' : 'Loading streak...'}</p>}
        {streakError && <p role="alert" className="mt-2 text-sm text-destructive">{streakError}</p>}
        <p className="mt-2 text-xs">Days follow your device&apos;s time zone. Flashcard reviews do not count.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Tabs defaultValue="bank">
        <TabsList>
          <TabsTrigger value="bank">Question Bank</TabsTrigger>
          <TabsTrigger value="cards">Flashcards</TabsTrigger>
        </TabsList>
        <TabsContent value="bank" className="space-y-5">
          <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1 text-sm">Category
              <select className={fieldClass} value={category} disabled={busy} onChange={(event) => setCategory(event.target.value)}>
                <option value="behavioral">Behavioral</option><option value="technical">Technical</option>
                <option value="system-design">System design</option><option value="coding">Coding</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">Role
              <input className={fieldClass} value={role} maxLength={100} disabled={busy} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Frontend developer" />
            </label>
            <label className="space-y-1 text-sm">Level
              <select className={fieldClass} value={level} disabled={busy} onChange={(event) => setLevel(event.target.value)}>
                <option value="junior">Junior</option><option value="middle">Middle</option><option value="senior">Senior</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">Topic (optional)
              <input className={fieldClass} value={topic} maxLength={150} disabled={busy} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. JavaScript event loop" />
            </label>
            <label className="space-y-1 text-sm">Question and answer language
              <select className={fieldClass} value={language} onChange={(event) => setLanguage(event.target.value)} disabled={busy || languages.length === 0}>
                {languages.length === 0 && <option value="en">{languageError ? 'Languages unavailable' : 'Loading languages...'}</option>}
                {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
              </select>
              {languageError && (
                <span className="block space-y-1">
                  <span role="alert" className="block text-destructive">{languageError}</span>
                  <button type="button" className="text-primary underline" onClick={() => setLanguageRevision((value) => value + 1)}>
                    Retry
                  </button>
                </span>
              )}
            </label>
            <div className="flex items-end">
              <Button type="button" onClick={() => void generate()} disabled={busy || languages.length === 0} className="w-full">
                {generating ? 'Generating question...' : 'Generate question'}
              </Button>
            </div>
          </div>
          {loading ? <p className="text-sm text-muted-foreground">Loading questions...</p> :
            questions.length === 0 ? <p className="text-sm text-muted-foreground">No questions match these filters. Enter a role and generate your first question.</p> :
              questions.map((question) => {
                const answer = answers[question.id]
                return (
                  <article key={question.id} className="rounded-xl border border-border bg-card p-5">
                    <p className="mb-3 text-xs text-muted-foreground">{question.role} · {question.level} · {question.category} {question.topic && `· ${question.topic}`}</p>
                    <QuestionBody question={question} />
                    <div className="mt-4 space-y-2">
                      {question.options.map((option, index) => (
                        <label key={index} className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-3 text-sm">
                          <input type="radio" name={`question-${question.id}`} checked={selected[question.id] === index} disabled={busy || Boolean(answer)} onChange={() => setSelected((previous) => ({ ...previous, [question.id]: index }))} />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {answer ? (
                      <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                        <p className="font-semibold">{selected[question.id] === answer.correctIndex ? 'Correct!' : 'Not quite.'} Correct answer: {question.options[answer.correctIndex]}</p>
                        <p className="mt-2 whitespace-pre-wrap">{answer.explanation}</p>
                        <Button type="button" variant="outline" className="mt-3" disabled={busy} onClick={() => {
                          setAnswers((previous) => {
                            const next = { ...previous }
                            delete next[question.id]
                            return next
                          })
                          setSelected((previous) => {
                            const next = { ...previous }
                            delete next[question.id]
                            return next
                          })
                        }}>Try again</Button>
                      </div>
                    ) : (
                      <Button type="button" className="mt-4" onClick={() => void showAnswer(question)} disabled={busy || selected[question.id] === undefined}>Check answer</Button>
                    )}
                    {answer && nextErrors[question.id] && (
                      <div className="mt-3 text-sm">
                        <p role="alert" className="text-destructive">Could not generate the next question: {nextErrors[question.id]}</p>
                        <Button type="button" variant="outline" className="mt-2" disabled={busy} onClick={() => void retryNext(question)}>Retry next question</Button>
                      </div>
                    )}
                    <div className="mt-4">
                      <Button type="button" variant="outline" onClick={() => void saveCard(question)} disabled={busy || question.saved}>
                        {question.saved ? 'Saved to flashcards' : 'Save as flashcard'}
                      </Button>
                    </div>
                  </article>
                )
              })}
        </TabsContent>
        <TabsContent value="cards">
          {loading ? <p className="text-sm text-muted-foreground">Loading flashcards...</p> : cards.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              No cards are due. Save questions from the bank or come back when a review is scheduled.
            </div>
          ) : (
            <article className="rounded-xl border border-border bg-card p-5">
              <p className="mb-3 text-xs text-muted-foreground">{cards.length} due · {cards[0].role} · {cards[0].level}</p>
              <QuestionBody question={cards[0]} />
              {cardAnswer ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="font-semibold">{cards[0].options[cardAnswer.correctIndex]}</p>
                    <p className="mt-2 whitespace-pre-wrap">{cardAnswer.explanation}</p>
                  </div>
                  <p className="text-sm">How well did you know the answer?</p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" disabled={busy} onClick={() => void rateCard('know')}>Know</Button>
                    <Button type="button" variant="outline" disabled={busy} onClick={() => void rateCard('unsure')}>Unsure</Button>
                    <Button type="button" variant="outline" disabled={busy} onClick={() => void rateCard('dont-know')}>Don&apos;t know</Button>
                  </div>
                </div>
              ) : <Button type="button" className="mt-4" disabled={busy} onClick={() => void showAnswer(cards[0], true)}>Reveal answer</Button>}
            </article>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
