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
import { whyDoYouWantToWorkHereInterviewAnswer } from './posts/why-do-you-want-to-work-here-interview-answer'
import { metaFacebookInterviewQuestions2026 } from './posts/meta-facebook-interview-questions-2026'
import { aiMeetingTranslatorCompleteGuide2026 } from './posts/ai-meeting-translator-complete-guide-2026'
import { meetingTranslationSaveYourJob2026 } from './posts/meeting-translation-save-your-job-2026'
import { isUsingAiInInterviewsCheating } from './posts/is-using-ai-in-interviews-cheating'
import { top50CommonInterviewQuestions2026 } from './posts/top-50-common-interview-questions-2026'
import { howToPrepareTechnicalInterview24Hours2026 } from './posts/how-to-prepare-technical-interview-24-hours-2026'
import { howToNegotiateSalaryAfterJobOffer2026 } from './posts/how-to-negotiate-salary-after-job-offer-2026'
import { howToWriteAResumeThatGetsInterviewsIn2026 } from './posts/how-to-write-a-resume-that-gets-interviews-in-2026'
import { howToAnswerWhereDoYouSeeYourselfIn5Years2026 } from './posts/how-to-answer-where-do-you-see-yourself-in-5-years-2026'
import { aiToolsForJobSeekersComplete2026Guide } from './posts/ai-tools-for-job-seekers-complete-2026-guide'
import { howToGetAJobAtAppleInterviewProcessTips2026 } from './posts/how-to-get-a-job-at-apple-interview-process-tips-2026'
import { howToGetAJobAtNetflixInterviewProcessTips2026 } from './posts/how-to-get-a-job-at-netflix-interview-process-tips-2026'
import { howToFollowUpAfterAnInterviewEmailTemplates2026 } from './posts/how-to-follow-up-after-an-interview-email-templates-2026'
import { remoteJobInterviewTipsHowToImpressOnVideo2026 } from './posts/remote-job-interview-tips-how-to-impress-on-video-2026'
import { howToAnswerWhatAreYourSalaryExpectations2026 } from './posts/how-to-answer-what-are-your-salary-expectations-2026'
import { aiTranslatorForMicrosoftTeamsRealTimeTranslationCompleteGuide2026 } from './posts/ai-translator-for-microsoft-teams-real-time-translation-complete-guide-2026'
import { howNonNativeSpeakersCanCompeteEquallyInEnglishInterviews2026 } from './posts/how-non-native-speakers-can-compete-equally-in-english-interviews-2026'
import { howToPrepareCaseInterviewConsulting2026 } from './posts/how-to-prepare-case-interview-consulting-2026'
import { howToGetAJobAtAirbnbInterviewProcessTips2026 } from './posts/how-to-get-a-job-at-airbnb-interview-process-tips-2026'
import { howToHandleIllegalInterviewQuestions2026 } from './posts/how-to-handle-illegal-interview-questions-2026'

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
  whyDoYouWantToWorkHereInterviewAnswer,
  metaFacebookInterviewQuestions2026,
  aiMeetingTranslatorCompleteGuide2026,
  meetingTranslationSaveYourJob2026,
  isUsingAiInInterviewsCheating,
  top50CommonInterviewQuestions2026,
  howToPrepareTechnicalInterview24Hours2026,
  howToNegotiateSalaryAfterJobOffer2026,
  howToWriteAResumeThatGetsInterviewsIn2026,
  howToAnswerWhereDoYouSeeYourselfIn5Years2026,
  aiToolsForJobSeekersComplete2026Guide,
  howToGetAJobAtAppleInterviewProcessTips2026,
  howToGetAJobAtNetflixInterviewProcessTips2026,
  howToFollowUpAfterAnInterviewEmailTemplates2026,
  remoteJobInterviewTipsHowToImpressOnVideo2026,
  howToAnswerWhatAreYourSalaryExpectations2026,
  aiTranslatorForMicrosoftTeamsRealTimeTranslationCompleteGuide2026,
  howNonNativeSpeakersCanCompeteEquallyInEnglishInterviews2026,
  howToPrepareCaseInterviewConsulting2026,
  howToGetAJobAtAirbnbInterviewProcessTips2026,
  howToHandleIllegalInterviewQuestions2026,
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug)
}
