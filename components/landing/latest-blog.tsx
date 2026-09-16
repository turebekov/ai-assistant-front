import Link from 'next/link'
import { BlogCard } from '@/components/blog/blog-card'
import { BLOG_POSTS } from '@/lib/blog/registry'

const latestPosts = [...BLOG_POSTS]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 3)

export function LatestBlog() {
  return (
    <section id="latest-blog" className="border-y border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">JobTap Blog</p>
            <h2 className="mt-2 text-3xl font-bold text-heading sm:text-4xl">Latest from Blog</h2>
            <p className="mt-3 max-w-2xl text-lg text-gray">
              Practical guides for stronger interviews and clearer meetings.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-link hover:underline">
            View all articles →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
