import type { Metadata } from 'next'
import { ProfileHomePage } from '@/views/profile/ui/profile-home-page'

export const metadata: Metadata = {
  title: 'Profile - AssistantAI',
  description: 'Main profile dashboard',
}

export default function ProfilePage() {
  return <ProfileHomePage />
}

