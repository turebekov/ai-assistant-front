// AssistantAI Design System Constants

export const colors = {
  primary: '#2563EB',
  primaryHover: '#1E40AF',
  accent: '#DBEAFE',
  success: '#10B981',
  warning: '#F59E0B',
  destructive: '#EF4444',
  dark: '#111827',
  gray: '#6B7280',
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
    color: colors.dark,
  },
  h2: {
    size: '36px',
    weight: '600',
    color: colors.dark,
  },
  h3: {
    size: '24px',
    weight: '600',
    color: colors.dark,
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
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
] as const

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
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for trying out AssistantAI',
    features: [
      '5 interview sessions',
      'Web app only',
      'Basic AI suggestions',
      'English only',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 14,
    period: 'month',
    description: 'For serious job seekers',
    features: [
      'Unlimited sessions',
      'Stealth mode enabled',
      'Web + Mobile apps',
      'Advanced AI coaching',
      'Session history',
      'Multilingual support',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: 79,
    period: 'month',
    description: 'For career coaching teams',
    features: [
      'Everything in Pro',
      '10 team members',
      'Team analytics dashboard',
      'API access',
      'Custom branding',
      'Dedicated support',
      'Admin controls',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
] as const

// FAQ items
export const faqItems = [
  {
    question: 'Is it really invisible during screen sharing?',
    answer: 'Yes! AssistantAI uses advanced overlay technology that is specifically designed to be invisible to screen sharing software like Zoom, Google Meet, and Microsoft Teams. The suggestions appear only on your screen and are not captured by any screen recording or sharing software.',
  },
  {
    question: 'Which platforms does it support?',
    answer: 'AssistantAI works with all major video conferencing platforms including Google Meet, Zoom, Microsoft Teams, and WebEx. Our web app works directly in your browser, while our mobile app provides suggestions on a separate device.',
  },
  {
    question: 'Does it record my voice?',
    answer: 'No, AssistantAI only captures and analyzes the interviewer\'s voice to provide relevant suggestions. Your voice is never recorded or stored. We prioritize your privacy and security.',
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
    answer: 'Currently, AssistantAI supports English, Russian, and Kazakh. We are actively working on adding more languages including Spanish, French, German, and Mandarin Chinese.',
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
    quote: 'AssistantAI helped me ace my Google interview! The real-time suggestions were incredibly helpful for system design questions. I got the offer within a week.',
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
    title: 'Claude AI Powered',
    description: 'Powered by state-of-the-art Claude AI for intelligent, context-aware answer suggestions tailored to your interview.',
  },
  {
    icon: 'Eye',
    title: 'Stealth Mode',
    description: 'Completely invisible to Zoom, Meet, and Teams screen sharing. Only you can see the suggestions.',
  },
  {
    icon: 'Smartphone',
    title: 'Web + Mobile',
    description: 'Use our web app in-browser or get suggestions on your phone - no installation required for the web version.',
  },
  {
    icon: 'History',
    title: 'Session History',
    description: 'Review past interviews, track your progress, and learn from previous sessions to improve over time.',
  },
  {
    icon: 'Globe',
    title: 'Multilingual',
    description: 'Full support for English, Russian, and Kazakh with more languages coming soon.',
  },
  {
    icon: 'Languages',
    title: 'Live Meeting Translator',
    description: 'Translate any meeting in real-time. 50+ languages. Invisible overlay.',
    link: '/profile/interview',
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
    description: 'AssistantAI captures only the interviewer\'s voice and analyzes questions in real-time.',
    icon: 'Headphones',
  },
  {
    step: 3,
    title: 'Get Instant Hints',
    description: 'Smart suggestions appear in a stealth overlay that\'s invisible to others - only you can see them.',
    icon: 'Lightbulb',
  },
] as const

// Footer links
export const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Meeting Translator', href: '/profile/interview' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { label: 'Twitter', href: 'https://twitter.com/assistantai' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/assistantai' },
    { label: 'GitHub', href: 'https://github.com/assistantai' },
  ],
} as const
