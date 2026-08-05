import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell'
import { ArticleBody } from '@/components/blog/article-body'
import { BLOG_POSTS, getAllBlogSlugs, getBlogPost } from '@/lib/blog/registry'
import { buildBlogPostMetadata } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return buildBlogPostMetadata(post)
}

function buildArticleJsonLd(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: 'en',
    keywords: post.keywords.join(', '),
    articleSection: 'Blog',
    author: {
      '@type': 'Organization',
      name: 'JobTap',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JobTap',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)
  const jsonLd = buildArticleJsonLd(post)

  return (
    <MarketingPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="border-b border-border bg-background pt-28 pb-16 lg:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-sm font-medium text-nav hover:text-nav-text-hover hover:underline dark:text-slate-300 dark:hover:text-white">
            ← Back to blog
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.updatedAt ?? post.publishedAt}>
              {new Date(post.updatedAt ?? post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.updatedAt && post.updatedAt !== post.publishedAt ? (
              <>
                <span className="text-xs">(updated)</span>
              </>
            ) : null}
            <span>·</span>
            <span>{post.readingTimeMinutes} min read</span>
            <span>·</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
              {post.intent}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-nav sm:text-4xl text-balance dark:text-slate-100">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray">{post.description}</p>
        </div>
      </article>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ArticleBody blocks={post.blocks} />

        <aside className="mt-16 border-t border-border pt-10">
          <p className="text-sm font-semibold text-heading">Explore JobTap</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/interview-assistant" className="text-link hover:underline">
                AI Interview Assistant
              </Link>
            </li>
            <li>
              <Link href="/meeting-translator" className="text-link hover:underline">
                Live Meeting Translator
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-link hover:underline">
                Pricing
              </Link>
            </li>
          </ul>
        </aside>

        {related.length > 0 ? (
          <aside className="mt-12">
            <h2 className="text-lg font-bold text-heading">More from the blog</h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="font-medium text-nav hover:text-nav-text-hover hover:underline dark:text-slate-200 dark:hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </MarketingPageShell>
  )
}
