import Link from 'next/link'
import type { BlogPost } from '@/lib/blog/types'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-primary">{post.week}</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-dark">
        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray">{post.description}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        <span className="font-medium text-primary">{post.primaryKeyword}</span>
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 text-sm font-semibold text-primary hover:underline"
      >
        Read article →
      </Link>
    </article>
  )
}
