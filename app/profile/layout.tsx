import { ProfileLayoutShell } from '@/widgets/profile-layout/ui/profile-layout-shell'

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ProfileLayoutShell>{children}</ProfileLayoutShell>
}

