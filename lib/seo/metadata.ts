import type { Metadata } from 'next'
import { SITE_URL, type PageSeoConfig } from './site'

const defaultOgImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'JobTap — AI Interview Assistant',
}

export function buildPageMetadata(page: PageSeoConfig): Metadata {
  const canonical = `${SITE_URL}${page.path}`

  return {
    title: page.title,
    description: page.description,
    keywords: [...page.keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: 'JobTap',
      title: page.openGraphTitle,
      description: page.description,
      images: [defaultOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.openGraphTitle,
      description: page.description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
