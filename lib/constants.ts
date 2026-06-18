// JobTap Design System Constants (see lib/design-system for token source)

import { formatSupportedLanguagesList, SUPPORTED_LANGUAGES } from '@/lib/languages'

export const colors = {
  primary: '#FF8516',
  primaryHover: '#EA760E',
  primaryActive: '#CF680C',
  primaryLight: '#FFF5EC',
  accent: '#FFF5EC',
  success: '#10B981',
  warning: '#F59E0B',
  destructive: '#EF4444',
  /** Navy heading ink (`text-heading`), not `bg-dark` */
  heading: '#0F1724',
  /** Surface teal (`bg-dark`); matches globals `--dark` */
  dark: '#00756A',
  gray: '#4B5563',
  grayLight: '#9CA3AF',
  lightGray: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB',
} as const

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  24: '96px',
} as const

export const borderRadius = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  full: '9999px',
} as const

export const shadows = {
  card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  elevated: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  focus: '0 0 0 3px rgba(37,99,235,0.3)',
} as const

export const typography = {
  h1: {
    size: '56px',
    weight: 'bold',
    color: colors.heading,
  },
  h2: {
    size: '36px',
    weight: '600',
    color: colors.heading,
  },
  h3: {
    size: '24px',
    weight: '600',
    color: colors.heading,
  },
  body: {
    size: '16px',
    weight: '400',
    color: colors.gray,
  },
  small: {
    size: '14px',
    weight: '400',
    color: colors.grayLight,
  },
} as const

// Navigation links
export const navLinks = [
  { href: '/interview-assistant', label: 'Interview Assistant' },
  { href: '/meeting-translator', label: 'Meeting Translator' },
  { href: '/tutorial', label: 'Tutorial' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
] as const

/** Official JobTap product tutorial on YouTube. */
export const TUTORIAL_YOUTUBE_VIDEO_ID = 'kb21ejtbr-U'
export const TUTORIAL_YOUTUBE_URL = `https://youtu.be/${TUTORIAL_YOUTUBE_VIDEO_ID}`

// Company logos for social proof
export const companyLogos = [
  'Google',
  'Amazon',
  'Meta',
  'Apple',
  'Microsoft',
  'Netflix',
  'Airbnb',
  'ByteDance',
] as const

// Pricing plans
export const pricingPlans = [
  {
    name: 'Free Plan',
    price: 0,
    period: 'month',
    description: 'Start free with limited usage',
    features: [
      'Interview assistant: 60 minutes total',
      'Meetings assistant supported',
      'Live meeting translation',
      '1 AI assistant',
      'Basic context uploads',
    ],
    cta: 'Choose Free',
    highlighted: false,
  },
  {
    name: 'Monthly Plan',
    price: 17,
    period: 'month',
    description: 'Billed monthly',
    features: [
      'Interview assistant supported',
      'Meetings assistant supported',
      'Live meeting translation',
      'Unlimited AI assistants',
      'Real-time AI answer suggestions',
      'Additional files (up to 5MB each)',
    ],
    cta: 'Choose Monthly',
    highlighted: false,
  },
  {
    name: 'Premium Plan',
    price: 25,
    period: 'month',
    description: 'Billed monthly',
    features: [
      'Everything in Monthly Plan',
      'Advanced coaching for complex interview questions',
      'Sharper STAR-style answer framing',
      'Stronger reasoning on technical follow-ups',
      'Deeper, more detailed answer suggestions',
    ],
    cta: 'Choose Premium',
    highlighted: true,
    badge: 'Recommended',
  },
] as const

// FAQ items
export const faqItems = [
  {
    question: 'Is it really invisible during screen sharing?',
    answer: 'Yes! JobTap uses advanced overlay technology that is specifically designed to be invisible to screen sharing software like Zoom, Google Meet, and Microsoft Teams. The suggestions appear only on your screen and are not captured by any screen recording or sharing software.',
  },
  {
    question: 'Which platforms does it support?',
    answer: 'JobTap works with all major video conferencing platforms including Google Meet, Zoom, Microsoft Teams, and WebEx. Our web app works directly in your browser.',
  },
  {
    question: 'Does it record my voice?',
    answer: 'No, JobTap only captures and analyzes the interviewer\'s voice to provide relevant suggestions. Your voice is never recorded or stored. We prioritize your privacy and security.',
  },
  {
    question: 'Is my interview data private?',
    answer: 'Absolutely. We do not store any audio from your interviews. Questions are processed in real-time by our AI and immediately discarded. We are GDPR compliant and you can request deletion of all your data at any time.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no questions asked. If you cancel, you\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'What languages are supported?',
    answer: `JobTap supports ${formatSupportedLanguagesList()} — with real-time audio transcription and AI answer suggestions in each language.`,
  },
] as const

// Testimonials
export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'SC',
    rating: 5,
    quote: 'JobTap helped me ace my Google interview! The real-time suggestions were incredibly helpful for system design questions. I got the offer within a week.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'Amazon',
    avatar: 'MR',
    rating: 5,
    quote: 'I was skeptical at first, but the AI suggestions were spot-on for behavioral questions. It helped me structure my STAR responses perfectly. Highly recommend!',
  },
  {
    name: 'Emily Thompson',
    role: 'Data Scientist',
    company: 'Meta',
    avatar: 'ET',
    rating: 5,
    quote: 'The stealth mode is amazing - completely invisible during screen share. Got my dream job at Meta thanks to the confidence boost from having AI backup.',
  },
] as const

// Features
export const features = [
  {
    icon: 'Mic',
    title: 'Real-Time Audio Capture',
    description: 'Our AI listens only to your interviewer\'s voice, analyzing questions instantly to provide relevant suggestions.',
  },
  {
    icon: 'Brain',
    title: 'Smart Answer Coaching',
    description: 'Context-aware suggestions tailored to your interview, resume, and role — not generic scripts.',
  },
  {
    icon: 'Eye',
    title: 'Stealth Mode',
    description: 'Completely invisible to Zoom, Meet, and Teams screen sharing. Only you can see the suggestions.',
  },
  {
    icon: 'History',
    title: 'Session History',
    description: 'Review past interviews, track your progress, and learn from previous sessions to improve over time.',
  },
  {
    icon: 'Globe',
    title: 'Multilingual',
    description: `Audio and text support for ${SUPPORTED_LANGUAGES.length} languages including ${formatSupportedLanguagesList()}.`,
  },
  {
    icon: 'Languages',
    title: 'Live Meeting Translator',
    description: `Translate any meeting in real-time across ${SUPPORTED_LANGUAGES.length} supported languages. Invisible overlay.`,
    link: '/meeting-translator',
  },
] as const

// How it works steps
export const howItWorksSteps = [
  {
    step: 1,
    title: 'Open Your Interview',
    description: 'Start your Google Meet, Zoom, or Teams interview in your browser as you normally would.',
    icon: 'Video',
  },
  {
    step: 2,
    title: 'AI Listens & Analyzes',
    description: 'JobTap captures only the interviewer\'s voice and analyzes questions in real-time.',
    icon: 'Headphones',
  },
  {
    step: 3,
    title: 'Get Instant Hints',
    description: 'Smart suggestions appear in a stealth overlay that\'s invisible to others - only you can see them.',
    icon: 'Lightbulb',
  },
] as const

export const CONTACT_EMAIL = 'support@jobtap.app'

/** Official JobTap social profiles (footer, legal, contact). */
export const SOCIAL_LINKS = [
  {
    id: 'x',
    label: 'X',
    handle: '@JobTapApp',
    href: 'https://x.com/JobTapApp',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@jobtapapp',
    href: 'https://www.youtube.com/@jobtapapp',
  },
] as const

// Footer links
export const footerLinks = {
  product: [
    { label: 'Interview Assistant', href: '/interview-assistant' },
    { label: 'Meeting Translator', href: '/meeting-translator' },
    { label: 'Tutorial', href: '/tutorial' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
  ],
  company: [
    { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    ...SOCIAL_LINKS.map((link) => ({
      label: `${link.label} — ${link.handle}`,
      href: link.href,
      external: true as const,
    })),
  ],
  legal: [
    { label: 'Privacy Policy', href: '/document/policy' },
    { label: 'Terms and Conditions', href: '/document/terms' },
  ],
  social: SOCIAL_LINKS,
} as const
