import Link from 'next/link'
import type { BlogBlock } from '@/lib/blog/types'
import { Button } from '@/components/ui/button'

export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-dark prose-p:text-gray prose-li:text-gray">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={index} className="mt-10 text-2xl font-bold text-dark first:mt-0">
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={index} className="mt-8 text-xl font-semibold text-dark">
                {block.text}
              </h3>
            )
          case 'p':
            return (
              <p key={index} className="mt-4 text-base leading-relaxed text-gray">
                {block.text}
              </p>
            )
          case 'ul':
            return (
              <ul key={index} className="mt-4 list-disc space-y-2 pl-6">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={index} className="mt-4 list-decimal space-y-2 pl-6">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )
          case 'cta':
            return (
              <div
                key={index}
                className="not-prose mt-10 rounded-2xl border border-primary/20 bg-accent/50 p-6 sm:p-8"
              >
                <h3 className="text-lg font-bold text-dark">{block.title}</h3>
                <p className="mt-2 text-sm text-gray">{block.body}</p>
                <Button asChild className="mt-4 rounded-full">
                  <Link href={block.href}>{block.label}</Link>
                </Button>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
