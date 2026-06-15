import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { YandexMetrika } from '@/components/analytics/yandex-metrika'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { SEO_PAGES, SITE_URL } from '@/lib/seo/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const homeSeo = SEO_PAGES.home

export const metadata: Metadata = {
  ...buildPageMetadata(homeSeo),
  metadataBase: new URL(SITE_URL),
  title: {
    default: homeSeo.title,
    template: '%s | JobTap',
  },
  verification: {
    google: 'SbWOqEhGWzInpRTLiUNpbMxQ3AQXzH_V1fK5vFIyb_A',
  },
  authors: [{ name: 'JobTap' }],
  creator: 'JobTap',
  publisher: 'JobTap',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6FAFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1724' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JobTap',
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  description:
    'Real-time AI interview assistant and meeting translator. Instant answer suggestions invisible to screen sharing.',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      name: 'Free Plan',
    },
    {
      '@type': 'Offer',
      price: '17',
      priceCurrency: 'USD',
      name: 'Monthly Plan',
      billingDuration: 'P1M',
    },
    {
      '@type': 'Offer',
      price: '25',
      priceCurrency: 'USD',
      name: 'Premium Plan',
      billingDuration: 'P1M',
    },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'JobTap',
    url: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <GoogleAnalytics />
        <YandexMetrika />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
