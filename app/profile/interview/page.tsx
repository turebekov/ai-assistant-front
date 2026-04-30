import type { Metadata } from 'next'
import { AssistantManager } from '@/widgets/assistant-manager/ui/assistant-manager'

export const metadata: Metadata = {
  title: 'Interview Assistant - AssistantAI',
  description: 'Real-time interview assistant with live transcript and AI suggestions.',
}

export default function ProfileInterviewPage() {
  return (
    <div className="space-y-4">
      <AssistantManager routeBase="/profile/interview" />
    </div>
  )
}

