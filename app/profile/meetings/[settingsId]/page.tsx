import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meetings Session - AssistantAI',
  description: 'Meetings assistant session by selected settings.',
}

interface MeetingsBySettingsPageProps {
  params: Promise<{ settingsId: string }> | { settingsId: string }
}

export default async function MeetingsBySettingsPage({ params }: MeetingsBySettingsPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const { settingsId } = resolvedParams

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h1 className="text-xl font-semibold">Meetings Assistant</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Opened by settings id: <span className="font-mono">{settingsId}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Meetings assistant workspace is ready for integration.
      </p>
    </section>
  )
}
