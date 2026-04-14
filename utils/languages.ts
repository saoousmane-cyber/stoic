// AURA & LOGOS - Utilitaires pour les langues

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
  dateFormat: string
  pluralRules: (n: number) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
}

export const LANGUAGES: Language[] = [
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    pluralRules: (n) => n === 0 ? 'zero' : n === 1 ? 'one' : 'other'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    pluralRules: (n) => n === 1 ? 'one' : 'other'
  },
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    pluralRules: (n) => n === 1 ? 'one' : 'other'
  },
  {
    code: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
    dateFormat: 'dd.MM.yyyy',
    pluralRules: (n) => n === 1 ? 'one' : 'other'
  },
  {
    code: 'it',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    pluralRules: (n) => n === 1 ? 'one' : 'other'
  },
  {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português',
    flag: '🇵🇹',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    pluralRules: (n) => n === 1 ? 'one' : 'other'
  }
]

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find(lang => lang.code === code)
}

export function getDefaultLanguage(): Language {
  return LANGUAGES[0] // Français
}

export function isLanguageSupported(code: string): boolean {
  return LANGUAGES.some(lang => lang.code === code)
}

export function getLanguageName(code: string, native = false): string {
  const lang = getLanguage(code)
  if (!lang) return code
  return native ? lang.nativeName : lang.name
}

// Traduction des textes courants
export const COMMON_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    'generation.success': 'Génération réussie',
    'generation.failed': 'Échec de la génération',
    'quota.remaining': 'Minutes restantes',
    'upgrade.required': 'Passer au plan Pro',
    'download.ready': 'Téléchargement prêt',
    'processing': 'Traitement en cours...'
  },
  en: {
    'generation.success': 'Generation successful',
    'generation.failed': 'Generation failed',
    'quota.remaining': 'Minutes remaining',
    'upgrade.required': 'Upgrade to Pro',
    'download.ready': 'Download ready',
    'processing': 'Processing...'
  },
  es: {
    'generation.success': 'Generación exitosa',
    'generation.failed': 'Error en generación',
    'quota.remaining': 'Minutos restantes',
    'upgrade.required': 'Actualizar a Pro',
    'download.ready': 'Descarga lista',
    'processing': 'Procesando...'
  },
  de: {
    'generation.success': 'Generierung erfolgreich',
    'generation.failed': 'Generierung fehlgeschlagen',
    'quota.remaining': 'Verbleibende Minuten',
    'upgrade.required': 'Upgrade auf Pro',
    'download.ready': 'Download bereit',
    'processing': 'Verarbeitung...'
  },
  it: {
    'generation.success': 'Generazione riuscita',
    'generation.failed': 'Generazione fallita',
    'quota.remaining': 'Minuti rimanenti',
    'upgrade.required': 'Passa a Pro',
    'download.ready': 'Download pronto',
    'processing': 'Elaborazione...'
  },
  pt: {
    'generation.success': 'Geração bem-sucedida',
    'generation.failed': 'Falha na geração',
    'quota.remaining': 'Minutos restantes',
    'upgrade.required': 'Atualizar para Pro',
    'download.ready': 'Download pronto',
    'processing': 'Processando...'
  }
}

export function t(key: string, languageCode: string = 'fr'): string {
  const translations = COMMON_TRANSLATIONS[languageCode]
  if (!translations) return key
  return translations[key] || key
}

// Formatage des durées selon la langue
export function formatDuration(minutes: number, languageCode: string = 'fr'): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  const labels: Record<string, { hour: string; hours: string; minute: string; minutes: string }> = {
    fr: { hour: 'heure', hours: 'heures', minute: 'minute', minutes: 'minutes' },
    en: { hour: 'hour', hours: 'hours', minute: 'minute', minutes: 'minutes' },
    es: { hour: 'hora', hours: 'horas', minute: 'minuto', minutes: 'minutos' },
    de: { hour: 'Stunde', hours: 'Stunden', minute: 'Minute', minutes: 'Minuten' },
    it: { hour: 'ora', hours: 'ore', minute: 'minuto', minutes: 'minuti' },
    pt: { hour: 'hora', hours: 'horas', minute: 'minuto', minutes: 'minutos' }
  }
  
  const l = labels[languageCode] || labels.fr
  
  if (hours > 0) {
    const hourLabel = hours === 1 ? l.hour : l.hours
    if (mins > 0) {
      const minuteLabel = mins === 1 ? l.minute : l.minutes
      return `${hours} ${hourLabel} ${mins} ${minuteLabel}`
    }
    return `${hours} ${hourLabel}`
  }
  
  const minuteLabel = mins === 1 ? l.minute : l.minutes
  return `${mins} ${minuteLabel}`
}