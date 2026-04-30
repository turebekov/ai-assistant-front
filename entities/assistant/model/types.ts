export type AssistantProfile = {
  id: string
  name: string
  interviewType?: string
  roleName?: string
  company: string
  details: string
  language: string
  translateEnabled?: boolean
  translateLanguage?: string
  resumeText?: string
  resume_text?: string
  tone: string
  promptStyle: string
  codingAssistant: boolean
  createdAt?: string
}

export type AssistantSettingsForm = {
  interviewType: string
  roleName: string
  companyName: string
  details: string
  interviewLanguage: string
  translateEnabled: boolean
  translateLanguage: string
  profileName: string
  suggestionTone: string
  promptStyle: string
  codingAssistant: boolean
}

