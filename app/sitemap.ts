import { MetadataRoute } from 'next'
import { SITE_URL, SITEMAP_PAGES } from '@/lib/seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return SITEMAP_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.sitemapPriority,
  }))
}
