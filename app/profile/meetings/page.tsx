import type { Metadata } from 'next'
import { AssistantManager } from '@/widgets/assistant-manager/ui/assistant-manager'

export const metadata: Metadata = {
  title: 'Meetings Assistant',
  description: 'Meetings assistant workspace.',
}

export default function ProfileMeetingsPage() {
  return (
    <div className="space-y-4">
      <AssistantManager routeBase="/profile/meetings" />
      <section className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        AI assistant for any meeting, sales, internal syncs, client calls, or project reviews, just upload your context and go.
      </section>
    </div>
  )
}

