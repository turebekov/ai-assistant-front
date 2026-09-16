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
      name: 'Free',
    },
    {
      '@type': 'Offer',
      price: '17',
      priceCurrency: 'USD',
      name: 'Standard',
      billingDuration: 'P1M',
    },
    {
      '@type': 'Offer',
      price: '25',
      priceCurrency: 'USD',
      name: 'Premium',
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5X62NW86');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5X62NW86"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <GoogleAnalytics />
        <YandexMetrika />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
