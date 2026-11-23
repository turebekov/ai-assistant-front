import type { Metadata } from 'next'
import { PracticePage } from '@/views/practice/ui/practice-page'

export const metadata: Metadata = {
  title: 'Practice',
  description: 'Prepare for interviews with questions and flashcards',
}

export default function Page() {
  return <PracticePage />
}
