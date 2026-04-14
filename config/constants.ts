// AURA & LOGOS - Constantes globales

export const APP_NAME = 'AURA & LOGOS'
export const APP_NAME_SHORT = 'AURA_AND_LOGOS'
export const APP_DESCRIPTION = 'Générateur automatisé de contenu vidéo/audio pour créateurs'

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

// Quotas
export const FREE_TIER_MINUTES_PER_MONTH = 5  // 5 minutes gratuites
export const FREE_TIER_GENERATIONS_PER_MONTH = 1  // 1 génération de 5 min max
export const PRO_TIER_HOURS_PER_MONTH = 20  // 20 heures = 1200 minutes
export const PRO_TIER_MINUTES_PER_MONTH = 1200

// Limites techniques
export const MAX_AUDIO_DURATION_MINUTES = 60  // 1 heure max par génération
export const MAX_AUDIO_SIZE_MB = 100
export const MAX_SCRIPT_CHARS = 15000
export const CACHE_TTL_SECONDS = 3600  // 1 heure

// File d'attente (si utilisation future)
export const MAX_CONCURRENT_GENERATIONS = 3
export const GENERATION_TIMEOUT_SECONDS = 300  // 5 minutes

// API retry
export const MAX_RETRIES = 3
export const RETRY_DELAY_MS = 1000

// Ducking audio (musique de fond)
export const DUCKING_DB_REDUCTION = 6  // -6dB sur la voix
export const BACKGROUND_MUSIC_VOLUME = 0.3  // 30%

// Formats supportés
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav'] as const
export const SUPPORTED_SUBTITLE_FORMATS = ['srt', 'vtt'] as const
export const DEFAULT_AUDIO_FORMAT = 'mp3'
export const DEFAULT_SUBTITLE_FORMAT = 'srt'

// Limites fichiers export
export const MAX_ZIP_SIZE_MB = 500
export const EXPORT_EXPIRY_HOURS = 24  // lien de téléchargement valide 24h