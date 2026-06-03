import Link from 'next/link'
import type { BlogBlock } from '@/lib/blog/types'
import { Button } from '@/components/ui/button'

export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="prose prose-slate article-body-prose max-w-none prose-headings:text-heading prose-p:text-gray prose-li:text-gray">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={index}
                id={block.id}
                className="mt-10 scroll-mt-28 text-2xl font-bold text-heading first:mt-0"
              >
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={index} className="mt-8 text-xl font-semibold text-heading">
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
          case 'toc':
            return (
              <nav key={index} aria-label="Table of contents" className="not-prose mt-4">
                <ol className="list-decimal space-y-2 pl-6 text-base">
                  {block.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="font-medium text-link hover:text-link-hover hover:underline"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )
          case 'table':
            return (
              <div key={index} className="not-prose mt-6 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {block.headers.map((header) => (
                        <th key={header} className="px-4 py-3 font-semibold text-heading">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-gray">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'links':
            return (
              <div key={index} className="not-prose mt-10">
                <p className="text-sm font-semibold text-heading">{block.title}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {block.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-link hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'cta':
            return (
              <div
                key={index}
                className="not-prose mt-10 rounded-2xl border border-primary/20 bg-accent/50 p-6 sm:p-8"
              >
                <h3 className="text-lg font-bold text-heading">{block.title}</h3>
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
