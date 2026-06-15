import type { BlogPost } from './types'
import { howToUseAiDuringJobInterview } from './posts/how-to-use-ai-during-job-interview'
import { bestAiInterviewTools2025 } from './posts/best-ai-interview-tools-2025'
import { howToAnswerTellMeAboutYourself } from './posts/how-to-answer-tell-me-about-yourself'
import { translateZoomMeetingRealTime2025 } from './posts/translate-zoom-meeting-real-time-2025'
import { starMethodInterviewAnswersAiExamples } from './posts/star-method-interview-answers-ai-examples'
import { googleInterviewQuestions2025AiTips } from './posts/google-interview-questions-2025-ai-tips'
import { englishJobInterviewAiTranslator } from './posts/english-job-interview-ai-translator'
import { amazonLeadershipPrinciplesInterviewAi } from './posts/amazon-leadership-principles-interview-ai'
import { whatIsYourGreatestWeaknessInterviewAnswer } from './posts/what-is-your-greatest-weakness-interview-answer'

export const BLOG_POSTS: BlogPost[] = [
  howToUseAiDuringJobInterview,
  bestAiInterviewTools2025,
  howToAnswerTellMeAboutYourself,
  translateZoomMeetingRealTime2025,
  starMethodInterviewAnswersAiExamples,
  googleInterviewQuestions2025AiTips,
  englishJobInterviewAiTranslator,
  amazonLeadershipPrinciplesInterviewAi,
  whatIsYourGreatestWeaknessInterviewAnswer,
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug)
}
