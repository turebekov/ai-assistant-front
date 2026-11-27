'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Flame, Layers, Loader2, RotateCcw, Snowflake, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiUrl } from '@/lib/api-url'
import { readPracticeResponse } from '@/lib/practice/api-response'
import { cn } from '@/lib/utils'

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
type PracticeUsage = { generated: number; limit: number | null; remaining: number | null; reachedLimit: boolean }

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

const fieldClass = 'mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function Loading({ children }: { children: React.ReactNode }) {
  return <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{children}</div>
}

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
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null)
  const [nextQuestions, setNextQuestions] = useState<Record<string, Question>>({})
  const [tab, setTab] = useState('practice')
  const [historyCategory, setHistoryCategory] = useState('')
  const [historyLevel, setHistoryLevel] = useState('')
  const [historyRole, setHistoryRole] = useState('')
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [nextErrors, setNextErrors] = useState<Record<string, string>>({})
  const [revision, setRevision] = useState(0)
  const [streak, setStreak] = useState<Streak | null>(null)
  const [streakError, setStreakError] = useState('')
  const streakRequest = useRef(0)
  const [usage, setUsage] = useState<PracticeUsage | null>(null)
  const [usageLoading, setUsageLoading] = useState(true)
  const [usageError, setUsageError] = useState('')
  const [usageRevision, setUsageRevision] = useState(0)

  const refresh = useCallback(() => setRevision((value) => value + 1), [])
  const practiceEnabled = !usageLoading && usage !== null && !usage.reachedLimit

  useEffect(() => {
    const controller = new AbortController()
    setUsageLoading(true)
    setUsageError('')
    request<PracticeUsage>('/api/practice/usage', { signal: controller.signal })
      .then((result) => {
        if (!Number.isInteger(result.generated) || typeof result.reachedLimit !== 'boolean') {
          throw new Error('Practice API returned invalid usage information.')
        }
        setUsage(result)
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setUsageError(err instanceof Error ? err.message : 'Could not verify practice access.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setUsageLoading(false)
      })
    return () => controller.abort()
  }, [usageRevision])

  useEffect(() => {
    if (!practiceEnabled) return
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
  }, [languageRevision, practiceEnabled])

  useEffect(() => {
    if (!practiceEnabled) return
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
  }, [practiceEnabled])

  useEffect(() => {
    if (!practiceEnabled) return
    const controller = new AbortController()
    setLoading(true)
    setLoadError('')
    const params = new URLSearchParams({ category: historyCategory, level: historyLevel, role: historyRole.trim() })
    Promise.all([
      request<{ questions: Question[] }>(`/api/practice/questions?${params}`, { signal: controller.signal }),
      request<{ cards: Question[] }>('/api/practice/cards/due', { signal: controller.signal }),
    ]).then(([bank, due]) => {
      if (controller.signal.aborted) return
      setQuestions(bank.questions)
      setCards(due.cards)
    }).catch((err: unknown) => {
      if (!controller.signal.aborted) setLoadError(err instanceof Error ? err.message : 'Could not load practice.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [historyCategory, historyLevel, historyRole, revision, practiceEnabled])

  async function generateQuestion(settings: QuestionSettings, afterId?: string) {
    setGenerating(true)
    try {
      const { question, usage: nextUsage } = await request<{ question: Question; usage: { generated: number; limit: number } | null }>('/api/practice/questions/generate', {
        method: 'POST',
        body: JSON.stringify(settings),
      })
      if (nextUsage) {
        setUsage({
          ...nextUsage,
          remaining: Math.max(0, nextUsage.limit - nextUsage.generated),
          reachedLimit: nextUsage.generated >= nextUsage.limit,
        })
      }
      if (afterId) {
        setNextQuestions((previous) => ({ ...previous, [afterId]: question }))
        setNextErrors((previous) => {
          const next = { ...previous }
          delete next[afterId]
          return next
        })
      } else {
        setActiveQuestion(question)
      }
      refresh()
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
        if (!nextQuestions[question.id]) {
          setBusy(false)
          void generateNext(question)
        }
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
      setActiveQuestion((previous) => previous?.id === question.id ? { ...previous, saved: true } : previous)
      setNextQuestions((previous) => Object.fromEntries(
        Object.entries(previous).map(([id, next]) => [id, next.id === question.id ? { ...next, saved: true } : next])
      ))
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
      setCards((previous) => previous.filter((item) => item.id !== card.id))
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
          Build confidence one question at a time. AI answers can contain mistakes.
        </p>
      </div>
      {usageLoading ? (
        <Loading>Checking practice access...</Loading>
      ) : usageError ? (
        <div className="rounded-xl border bg-card p-6 text-center">
          <p role="alert" className="text-sm text-destructive">{usageError}</p>
          <Button type="button" className="mt-4" onClick={() => setUsageRevision((value) => value + 1)}>
            Retry
          </Button>
        </div>
      ) : usage?.reachedLimit ? (
        <div className="mx-auto max-w-xl rounded-xl border bg-card p-6 text-center">
          <h3 className="text-xl font-semibold">Free practice limit reached</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;ve used all 20 free practice questions. Connect a paid plan to continue using Practice.
          </p>
          <Button asChild className="mt-4">
            <Link href="/profile/subscription">View plans</Link>
          </Button>
        </div>
      ) : !usage ? (
        <p role="alert" className="text-sm text-destructive">Unable to verify practice access.</p>
      ) : (
      <>
      {usage.limit !== null && (
        <p className="text-sm text-muted-foreground">
          {usage.remaining} of {usage.limit} free question generations remaining.
        </p>
      )}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
        {streak ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
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
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="practice"><Sparkles /> Practice</TabsTrigger>
          <TabsTrigger value="history"><BookOpen /> Question Bank</TabsTrigger>
          <TabsTrigger value="cards"><Layers /> Flashcards{cards.length > 0 ? ` (${cards.length})` : ''}</TabsTrigger>
        </TabsList>
        <TabsContent value="practice" className="space-y-5 pt-3">
          {!activeQuestion ? (
            <div className="rounded-xl border bg-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Set up your practice</h3>
              <p className="mt-1 text-sm text-muted-foreground">Choose what you want to practice. We&apos;ll generate one question at a time.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-sm font-medium">Role <span className="text-destructive">*</span>
                  <input className={fieldClass} value={role} maxLength={100} disabled={busy} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Frontend developer" />
                </label>
                <label className="text-sm font-medium">Category
                  <select className={fieldClass} value={category} disabled={busy} onChange={(event) => setCategory(event.target.value)}>
                    <option value="behavioral">Behavioral</option><option value="technical">Technical</option>
                    <option value="system-design">System design</option><option value="coding">Coding</option>
                  </select>
                </label>
                <label className="text-sm font-medium">Experience level
                  <select className={fieldClass} value={level} disabled={busy} onChange={(event) => setLevel(event.target.value)}>
                    <option value="junior">Junior</option><option value="middle">Middle</option><option value="senior">Senior</option>
                  </select>
                </label>
                <label className="text-sm font-medium">Language
                  <select className={fieldClass} value={language} onChange={(event) => setLanguage(event.target.value)} disabled={busy || languages.length === 0}>
                    {languages.length === 0 && <option value="en">{languageError ? 'Languages unavailable' : 'Loading languages...'}</option>}
                    {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                  </select>
                  {languageError && (
                    <span className="mt-1 block">
                      <span role="alert" className="block text-destructive">{languageError}</span>
                      <button type="button" className="text-primary underline" onClick={() => setLanguageRevision((value) => value + 1)}>Retry</button>
                    </span>
                  )}
                </label>
                <label className="text-sm font-medium sm:col-span-2">Topic <span className="font-normal text-muted-foreground">(optional)</span>
                  <input className={fieldClass} value={topic} maxLength={150} disabled={busy} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. JavaScript event loop" />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button type="button" onClick={() => void generate()} disabled={busy || generating || languages.length === 0}>
                  {generating ? <><Loader2 className="animate-spin" /> Generating question...</> : <><Sparkles /> Start practice</>}
                </Button>
                {generating && <span role="status" className="text-sm text-muted-foreground">Preparing your first question. This may take a moment.</span>}
              </div>
            </div>
          ) : (() => {
            const question = activeQuestion
            const answer = answers[question.id]
            const next = nextQuestions[question.id]
            return (
              <article className="rounded-xl border bg-card p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium text-muted-foreground">{question.role} · {question.level} · {question.category.replace('-', ' ')}{question.topic && ` · ${question.topic}`}</p>
                  <Button type="button" variant="outline" size="sm" disabled={busy || generating} onClick={() => { setActiveQuestion(null); setError('') }}>
                    Change settings
                  </Button>
                </div>
                <div className="mt-5 text-lg"><QuestionBody question={question} /></div>
                <fieldset className="mt-5 space-y-2">
                  <legend className="mb-2 text-sm text-muted-foreground">Select one answer</legend>
                  {question.options.map((option, index) => {
                    const isSelected = selected[question.id] === index
                    const isCorrect = answer?.correctIndex === index
                    const isWrong = Boolean(answer) && isSelected && !isCorrect
                    return (
                      <label key={index} className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm transition-colors',
                        !answer && isSelected && 'border-primary bg-primary/5',
                        !answer && !isSelected && 'hover:border-primary/50 hover:bg-muted/50',
                        isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-950',
                        isWrong && 'border-red-400 bg-red-50 text-red-950',
                        answer && 'cursor-default'
                      )}>
                        <input className="mt-0.5 accent-primary" type="radio" name={`question-${question.id}`} checked={isSelected} disabled={busy || Boolean(answer)} onChange={() => setSelected((previous) => ({ ...previous, [question.id]: index }))} />
                        <span className="flex-1">{option}</span>
                        {isCorrect && <span className="font-semibold">Correct</span>}
                        {isWrong && <span className="font-semibold">Your answer</span>}
                      </label>
                    )
                  })}
                </fieldset>
                {answer ? (
                  <>
                    <div role="status" className="mt-5 rounded-lg bg-muted p-4 text-sm">
                      <p className="font-semibold">{selected[question.id] === answer.correctIndex ? 'Correct!' : 'Not quite — the correct answer is highlighted above.'}</p>
                      <p className="mt-2 whitespace-pre-wrap">{answer.explanation}</p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Button type="button" disabled={busy || !next} onClick={() => { if (next) { setActiveQuestion(next); setError('') } }}>
                        Next question <ArrowRight />
                      </Button>
                      <Button type="button" variant="outline" disabled={busy || question.saved} onClick={() => void saveCard(question)}>
                        {question.saved ? <><CheckCircle2 /> Saved to flashcards</> : <><Layers /> Save as flashcard</>}
                      </Button>
                      <Button type="button" variant="outline" disabled={busy || generating} onClick={() => {
                        setAnswers((previous) => { const updated = { ...previous }; delete updated[question.id]; return updated })
                        setSelected((previous) => { const updated = { ...previous }; delete updated[question.id]; return updated })
                      }}><RotateCcw /> Try again</Button>
                    </div>
                    {!next && generating && <div className="mt-4"><Loading>Preparing your next question... You can read the explanation while you wait.</Loading></div>}
                    {nextErrors[question.id] && !next && (
                      <div className="mt-4 text-sm">
                        <p role="alert" className="text-destructive">Could not generate the next question: {nextErrors[question.id]}</p>
                        <Button type="button" variant="outline" className="mt-2" disabled={busy || generating} onClick={() => void retryNext(question)}>Retry generation</Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button type="button" onClick={() => void showAnswer(question)} disabled={busy || generating || selected[question.id] === undefined}>
                      {busy ? <><Loader2 className="animate-spin" /> Checking answer...</> : 'Check answer'}
                    </Button>
                    {selected[question.id] === undefined && <span className="text-sm text-muted-foreground">Choose an answer to continue.</span>}
                  </div>
                )}
              </article>
            )
          })()}
        </TabsContent>
        <TabsContent value="history" className="space-y-4 pt-3">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-lg font-semibold">Question Bank</h3>
            <p className="mt-1 text-sm text-muted-foreground">Review previously generated questions. Showing up to 100 matching questions.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-medium">Role
                <input className={fieldClass} value={historyRole} maxLength={100} onChange={(event) => setHistoryRole(event.target.value)} placeholder="All roles" />
              </label>
              <label className="text-sm font-medium">Category
                <select className={fieldClass} value={historyCategory} onChange={(event) => setHistoryCategory(event.target.value)}>
                  <option value="">All categories</option><option value="behavioral">Behavioral</option><option value="technical">Technical</option><option value="system-design">System design</option><option value="coding">Coding</option>
                </select>
              </label>
              <label className="text-sm font-medium">Level
                <select className={fieldClass} value={historyLevel} onChange={(event) => setHistoryLevel(event.target.value)}>
                  <option value="">All levels</option><option value="junior">Junior</option><option value="middle">Middle</option><option value="senior">Senior</option>
                </select>
              </label>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Role filter matches the full role name.</p>
          </div>
          {loading ? <Loading>Loading questions...</Loading> : loadError ? (
            <div className="rounded-xl border p-5"><p role="alert" className="text-sm text-destructive">{loadError}</p><Button type="button" variant="outline" className="mt-3" onClick={refresh}>Retry</Button></div>
          ) : questions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No questions match these filters. Generate a question in Practice to get started.</div>
          ) : questions.map((question) => (
            <article key={question.id} className="rounded-xl border bg-card p-5">
              <p className="mb-2 text-xs text-muted-foreground">{question.role} · {question.level} · {question.category.replace('-', ' ')}{question.topic && ` · ${question.topic}`}</p>
              <QuestionBody question={question} />
              <Button type="button" variant="outline" className="mt-4" disabled={busy || generating} onClick={() => { setActiveQuestion(question); setError(''); setTab('practice') }}>Open question <ArrowRight /></Button>
            </article>
          ))}
        </TabsContent>
        <TabsContent value="cards" className="pt-3">
          {loading ? <Loading>Loading flashcards...</Loading> : loadError ? (
            <div className="rounded-xl border p-5"><p role="alert" className="text-sm text-destructive">{loadError}</p><Button type="button" variant="outline" className="mt-3" onClick={refresh}>Retry</Button></div>
          ) : cards.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <h3 className="font-semibold">No cards to review right now</h3>
              <p className="mt-2 text-sm text-muted-foreground">Save a question as a flashcard, or come back when your next review is due.</p>
              <Button type="button" variant="outline" className="mt-4" onClick={() => setTab('practice')}>Go to practice</Button>
            </div>
          ) : (
            <article className="rounded-xl border bg-card p-5 sm:p-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground">{cards.length} {cards.length === 1 ? 'card' : 'cards'} due · {cards[0].role} · {cards[0].level}</p>
              <div className="text-lg"><QuestionBody question={cards[0]} /></div>
              {cardAnswer ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p className="font-semibold">{cards[0].options[cardAnswer.correctIndex]}</p>
                    <p className="mt-2 whitespace-pre-wrap">{cardAnswer.explanation}</p>
                  </div>
                  <p className="text-sm font-medium">How well did you know the answer?</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Button type="button" variant="outline" disabled={busy} onClick={() => void rateCard('dont-know')}>Don&apos;t know</Button>
                    <Button type="button" variant="outline" disabled={busy} onClick={() => void rateCard('unsure')}>Unsure</Button>
                    <Button type="button" variant="outline" disabled={busy} onClick={() => void rateCard('know')}>Know</Button>
                  </div>
                  {busy && <Loading>Saving your rating...</Loading>}
                </div>
              ) : <Button type="button" className="mt-5" disabled={busy} onClick={() => void showAnswer(cards[0], true)}>{busy ? <><Loader2 className="animate-spin" /> Loading answer...</> : 'Reveal answer'}</Button>}
            </article>
          )}
        </TabsContent>
      </Tabs>
      </>
      )}
    </section>
  )
}
