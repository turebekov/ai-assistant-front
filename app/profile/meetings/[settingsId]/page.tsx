import { Suspense } from 'react'
import type { Metadata } from 'next'
import { InterviewClient } from '@/components/interview/interview-client'

export const metadata: Metadata = {
  title: 'Meetings Session',
  description: 'Meetings assistant session with live transcript and AI suggestions.',
}

interface MeetingsBySettingsPageProps {
  params: Promise<{ settingsId: string }> | { settingsId: string }
}

export default async function MeetingsBySettingsPage({ params }: MeetingsBySettingsPageProps) {
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
      <InterviewClient settingsId={settingsId} mode="meetings" />
    </Suspense>
  )
}
