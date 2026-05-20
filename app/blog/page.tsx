import type { Metadata } from 'next'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { BlogCard } from '@/components/blog/blog-card'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES } from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata(SEO_PAGES.blog)

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <MarketingPageShell>
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background pt-28 pb-12 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">JobTap Blog</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-heading sm:text-5xl">
            Interview & meeting AI guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray">
            Practical SEO guides on AI interview assistants, STAR answers, FAANG prep, and live meeting
            translation. New articles from our 8-week content plan.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}
