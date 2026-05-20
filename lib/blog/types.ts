export type BlogBlock =
  | { type: 'h2'; text: string; id?: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'toc'; items: { label: string; href: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'links'; title: string; items: { label: string; href: string }[] }
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
