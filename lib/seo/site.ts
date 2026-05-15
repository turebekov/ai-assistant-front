/** Canonical site URL for SEO (www). */
export const SITE_URL = 'https://www.jobtap.app'

export type PageSeoConfig = {
  path: string
  title: string
  description: string
  keywords: string[]
  openGraphTitle: string
  sitemapPriority: number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
}

/** Stage 1 — meta tags & public landing URLs from SEO guide. */
export const SEO_PAGES = {
  home: {
    path: '',
    title: 'JobTap — AI Interview Assistant & Meeting Translator',
    description:
      'Ace your job interview with real-time AI coaching. JobTap listens to your interviewer and delivers instant answer suggestions — invisible to screen sharing. Translate any meeting live in 50+ languages.',
    keywords: [
      'AI interview assistant',
      'real-time interview help',
      'meeting translator',
      'interview AI coach',
    ],
    openGraphTitle: 'JobTap — Real-Time AI for Interviews & Meetings',
    sitemapPriority: 1,
    changeFrequency: 'weekly',
  },
  interviewAssistant: {
    path: '/interview-assistant',
    title: 'AI Interview Assistant — Real-Time Answer Suggestions | JobTap',
    description:
      "Get instant AI-powered hints during your job interview. JobTap captures interviewer's audio and suggests perfect answers in seconds. Works with Google Meet, Zoom, Teams. Stealth mode — invisible to screen sharing.",
    keywords: [
      'AI interview assistant',
      'invisible interview AI',
      'interview coaching real-time',
      'interview hints AI',
    ],
    openGraphTitle: 'AI Interview Assistant — Invisible Real-Time Coaching',
    sitemapPriority: 0.95,
    changeFrequency: 'weekly',
  },
  meetingTranslator: {
    path: '/meeting-translator',
    title: 'Live Meeting Translator — Translate Zoom, Meet, Teams in Real-Time | JobTap',
    description:
      "Translate any online meeting, call or interview live in 50+ languages. JobTap's AI meeting translator works with Google Meet, Zoom Web and Microsoft Teams. Instant captions in your language.",
    keywords: [
      'AI meeting translator',
      'translate zoom meeting live',
      'real-time meeting translation',
      'live call translator',
    ],
    openGraphTitle: 'Translate Any Meeting Live — 50+ Languages',
    sitemapPriority: 0.95,
    changeFrequency: 'weekly',
  },
  pricing: {
    path: '/pricing',
    title: 'Pricing — Free, Pro & Team Plans | JobTap',
    description:
      'Start free with 60 minutes of assistant time. Upgrade to Pro from $17/mo for unlimited interviews, stealth mode and meeting translation.',
    keywords: ['JobTap pricing', 'AI interview assistant cost', 'interview AI subscription'],
    openGraphTitle: 'Simple Pricing — Start Free, Upgrade When Ready',
    sitemapPriority: 0.8,
    changeFrequency: 'monthly',
  },
  auth: {
    path: '/auth',
    title: 'Sign In',
    description: 'Sign in or create your JobTap account.',
    keywords: ['JobTap sign in', 'JobTap register'],
    openGraphTitle: 'Sign In to JobTap',
    sitemapPriority: 0.5,
    changeFrequency: 'monthly',
  },
  privacy: {
    path: '/document/policy',
    title: 'Privacy Policy',
    description: 'Privacy Policy for JobTap interview and meeting assistant.',
    keywords: ['JobTap privacy policy'],
    openGraphTitle: 'JobTap Privacy Policy',
    sitemapPriority: 0.3,
    changeFrequency: 'yearly',
  },
  terms: {
    path: '/document/terms',
    title: 'Terms and Conditions',
    description: 'Terms and Conditions for JobTap interview and meeting assistant.',
    keywords: ['JobTap terms'],
    openGraphTitle: 'JobTap Terms and Conditions',
    sitemapPriority: 0.3,
    changeFrequency: 'yearly',
  },
} as const satisfies Record<string, PageSeoConfig>

export const SITEMAP_PAGES: PageSeoConfig[] = [
  SEO_PAGES.home,
  SEO_PAGES.interviewAssistant,
  SEO_PAGES.meetingTranslator,
  SEO_PAGES.pricing,
  SEO_PAGES.auth,
  SEO_PAGES.privacy,
  SEO_PAGES.terms,
]
