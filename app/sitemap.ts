import { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/lib/blog/registry'
import { SITE_URL, SITEMAP_PAGES } from '@/lib/seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries = SITEMAP_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.sitemapPriority,
  }))

  const blogPosts = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...blogPosts]
}
