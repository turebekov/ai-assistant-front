'use client'

interface ProfileHeaderProps {
  email: string
}

export function ProfileHeader({ email }: ProfileHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-xs text-muted-foreground">Main dashboard page</p>
      </div>
      <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
        {email || 'No email'}
      </div>
    </header>
  )
}

