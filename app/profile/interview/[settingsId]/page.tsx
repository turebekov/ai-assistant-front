import type { Metadata } from 'next'
import { InterviewClient } from '@/components/interview/interview-client'

export const metadata: Metadata = {
  title: 'Interview Session - AssistantAI',
  description: 'Interview assistant session by selected settings.',
}

interface InterviewBySettingsPageProps {
  params: { settingsId: string }
}

export default function InterviewBySettingsPage({ params }: InterviewBySettingsPageProps) {
  const { settingsId } = params
  return <InterviewClient settingsId={settingsId} />
}
