import type { Metadata } from 'next'
import { ProfileHomePage } from '@/views/profile/ui/profile-home-page'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'JobTap profile dashboard',
}

export default function ProfilePage() {
  return <ProfileHomePage />
}

