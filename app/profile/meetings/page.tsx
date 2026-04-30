import type { Metadata } from 'next'
import { AssistantManager } from '@/widgets/assistant-manager/ui/assistant-manager'

export const metadata: Metadata = {
  title: 'Meetings Assistant - AssistantAI',
  description: 'Meetings assistant workspace.',
}

export default function ProfileMeetingsPage() {
  return (
    <div className="space-y-4">
      <AssistantManager routeBase="/profile/meetings" />
    </div>
  )
}

