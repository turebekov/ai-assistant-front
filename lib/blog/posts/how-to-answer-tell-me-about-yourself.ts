import type { BlogPost } from '../types'

export const howToAnswerTellMeAboutYourself: BlogPost = {
  slug: 'how-to-answer-tell-me-about-yourself',
  title: "How to Answer 'Tell Me About Yourself' — AI-Powered Guide",
  description:
    "Structure a compelling 'tell me about yourself' answer with the Present-Past-Future framework, examples, and how JobTap helps you refine your pitch in real time.",
  keywords: [
    'how to answer tell me about yourself',
    'tell me about yourself interview',
    'interview introduction answer',
    'STAR interview',
  ],
  publishedAt: '2026-05-15',
  readingTimeMinutes: 8,
  locale: 'en',
  week: 'Week 3',
  primaryKeyword: 'how to answer tell me about yourself',
  intent: 'Informational',
  blocks: [
    {
      type: 'p',
      text: '"Tell me about yourself" opens a huge share of interviews — yet many strong candidates ramble or recite their resume. Interviewers use it to hear how you prioritize, communicate, and connect experience to the role. A tight 90–120 second answer sets the tone for everything that follows.',
    },
    {
      type: 'h2',
      text: 'The Present → Past → Future framework',
    },
    {
      type: 'ol',
      items: [
        'Present: Current role, scope, and one recent win relevant to this job.',
        'Past: Brief arc — how you got here, 1–2 milestones that prove fit.',
        'Future: Why this company and role, and what you want to contribute next.',
      ],
    },
    {
      type: 'h2',
      text: 'Example outline (software engineer)',
    },
    {
      type: 'p',
      text: '"I am a backend engineer at a fintech startup, where I own payments APIs used by 200k monthly users. Before that I spent three years at a larger e-commerce company, where I led a migration to event-driven architecture that cut checkout latency by 30%. I am excited about this role because your platform scale and reliability goals match what I have been building toward — and I want to deepen my work on distributed systems with a product-focused team."',
    },
    {
      type: 'h2',
      text: 'Common mistakes',
    },
    {
      type: 'ul',
      items: [
        'Starting from childhood or education unless you are a new grad',
        'Listing every job without a narrative thread',
        'Going over two minutes without checking interviewer engagement',
        'Forgetting to tie the story to this specific role',
      ],
    },
    {
      type: 'h2',
      text: 'Using AI to refine your pitch',
    },
    {
      type: 'p',
      text: 'Paste your resume and target job description into JobTap before the interview. When a similar opener appears in a mock or live call, suggestions can remind you of metrics and projects you might skip under pressure. Use AI as a prompt for your own words — not a script to read aloud.',
    },
    {
      type: 'h2',
      text: 'Practice checklist',
    },
    {
      type: 'ul',
      items: [
        'Record yourself and stay under 2 minutes',
        'Prepare a version for phone screens vs. on-site loops',
        'Have one metric-backed win ready for each phase',
        'End with a clear why-this-company sentence',
      ],
    },
    {
      type: 'cta',
      title: 'Practice your opener with JobTap',
      body: 'Run a mock interview and get real-time reminders when you drift off structure.',
      href: '/auth?mode=register',
      label: 'Start For Free',
    },
  ],
}
