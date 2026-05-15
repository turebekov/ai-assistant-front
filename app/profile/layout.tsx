import type { Metadata } from 'next'
import { ProfileLayoutShell } from '@/widgets/profile-layout/ui/profile-layout-shell'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ProfileLayoutShell>{children}</ProfileLayoutShell>
}

