import { Metadata } from 'next'
import { InterviewClient } from '@/components/interview/interview-client'

export const metadata: Metadata = {
  title: 'Interview Assistant - AssistantAI',
  description: 'Real-time interview assistant with live transcript and AI suggestions.',
}

export default function InterviewPage() {
  return <InterviewClient />
}
