import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jobtap.app'),
  title: {
    default: 'JobTap — Real-Time AI Interview Assistant',
    template: '%s | JobTap'
  },
  description: 'Ace your job interview with real-time AI coaching. Invisible to screen sharing. Works with Google Meet, Zoom, Teams.',
  keywords: [
    'AI interview assistant',
    'real-time interview help',
    'interview AI coach',
    'invisible interview assistant',
    'job interview preparation',
    'AI meeting translator',
    'interview answer suggestions'
  ],
  authors: [{ name: 'JobTap' }],
  creator: 'JobTap',
  publisher: 'JobTap',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.jobtap.app',
    siteName: 'JobTap',
    title: 'JobTap — Real-Time AI Interview Assistant',
    description: 'Real-time AI coaching during interviews. Invisible to screen sharing.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'JobTap — AI Interview Assistant'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobTap — Real-Time AI Interview Assistant',
    description: 'Ace your interview with AI coaching',
    images: ['/og-image.png'],
    creator: '@jobtap'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    }
  },
  alternates: {
    canonical: 'https://www.jobtap.app',
    languages: {
      'en': 'https://www.jobtap.app',
    }
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JobTap',
  applicationCategory: 'BusinessApplication',
  description: 'Real-time AI interview assistant that provides instant answer suggestions invisible to screen sharing.',
  operatingSystem: 'Web, iOS, Android, macOS, Windows',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '79',
    priceCurrency: 'USD',
    offerCount: 3,
  },
  author: {
    '@type': 'Organization',
    name: 'JobTap',
    url: 'https://www.jobtap.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} bg-background`}
      suppressHydrationWarning
    >
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
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
