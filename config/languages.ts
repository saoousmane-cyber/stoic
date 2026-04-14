// AURA & LOGOS - Langues supportées

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  openAIVoice?: string  // voix OpenAI TTS
  isDefault?: boolean
}

export const LANGUAGES: Language[] = [
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    openAIVoice: 'nova',  // voix féminine claire
    isDefault: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    openAIVoice: 'nova'
  },
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    openAIVoice: 'nova'
  },
  {
    code: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    openAIVoice: 'nova'
  },
  {
    code: 'it',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    openAIVoice: 'nova'
  },
  {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português',
    flag: '🇵🇹',
    openAIVoice: 'nova'
  }
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find(lang => lang.code === code)
}

export const getDefaultLanguage = (): Language => {
  return LANGUAGES.find(lang => lang.isDefault) || LANGUAGES[0]
}