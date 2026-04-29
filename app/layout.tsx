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
  metadataBase: new URL('https://assistantai.io'),
  title: {
    default: 'AssistantAI — Real-Time AI Interview Assistant',
    template: '%s | AssistantAI'
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
  authors: [{ name: 'AssistantAI' }],
  creator: 'AssistantAI',
  publisher: 'AssistantAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://assistantai.io',
    siteName: 'AssistantAI',
    title: 'AssistantAI — Real-Time AI Interview Assistant',
    description: 'Real-time AI coaching during interviews. Invisible to screen sharing.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AssistantAI — AI Interview Assistant'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AssistantAI — Real-Time AI Interview Assistant',
    description: 'Ace your interview with AI coaching',
    images: ['/og-image.png'],
    creator: '@assistantai'
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
    canonical: 'https://assistantai.io',
    languages: {
      'en': 'https://assistantai.io',
      'ru': 'https://assistantai.io/ru',
    }
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
  name: 'AssistantAI',
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '50000',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: 'AssistantAI',
    url: 'https://assistantai.io',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
