import { Suspense } from 'react'
import type { Metadata } from 'next'
import { InterviewClient } from '@/components/interview/interview-client'

export const metadata: Metadata = {
  title: 'Interview Session',
  description: 'Interview assistant session by selected settings.',
}

interface InterviewBySettingsPageProps {
  params: Promise<{ settingsId: string }> | { settingsId: string }
}

export default async function InterviewBySettingsPage({ params }: InterviewBySettingsPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const { settingsId } = resolvedParams
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
          Loading session…
        </div>
      }
    >
      <InterviewClient settingsId={settingsId} />
    </Suspense>
  )
}
