export type BlogBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | {
      type: 'cta'
      title: string
      body: string
      href: string
      label: string
    }

export type BlogPost = {
  slug: string
  title: string
  description: string
  keywords: string[]
  publishedAt: string
  updatedAt?: string
  readingTimeMinutes: number
  locale: 'en'
  week: string
  primaryKeyword: string
  intent: 'Informational' | 'Commercial' | 'Transactional'
  blocks: BlogBlock[]
}
