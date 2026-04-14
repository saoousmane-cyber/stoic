// AURA & LOGOS - Endpoints API (centralisés)

export const API_ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
    GOOGLE: '/api/auth/google'
  },

  // Génération de contenu
  GENERATION: {
    SCRIPT: '/api/generation/script',
    VOICE: '/api/generation/voice',
    IMAGES: '/api/generation/images',
    SUBTITLES: '/api/generation/subtitles',
    EXPORT: '/api/generation/export',
    STATUS: (id: string) => `/api/generation/status/${id}`,
    CANCEL: (id: string) => `/api/generation/cancel/${id}`
  },

  // Utilisateur & quota
  USER: {
    PROFILE: '/api/user/profile',
    QUOTA: '/api/user/quota',
    HISTORY: '/api/user/history',
    GENERATIONS: '/api/user/generations',
    DELETE_GENERATION: (id: string) => `/api/user/generations/${id}`
  },

  // Paiements (Stripe)
  PAYMENT: {
    CREATE_CHECKOUT: '/api/payment/create-checkout',
    CREATE_PORTAL: '/api/payment/create-portal',
    WEBHOOK: '/api/payment/webhook',
    SUBSCRIPTION: '/api/payment/subscription'
  },

  // Utilitaires
  UTILS: {
    HEALTH: '/api/health',
    CACHE_CLEAR: '/api/utils/cache-clear',
    METRICS: '/api/utils/metrics'
  }
} as const

// Webhooks externes
export const EXTERNAL_WEBHOOKS = {
  STRIPE: '/api/payment/webhook',
  RESEND: '/api/email/webhook'
} as const

// Rate limiting (par IP ou userId)
export const RATE_LIMITS = {
  GENERATION: {
    windowMs: 60 * 60 * 1000,  // 1 heure
    max: 5  // 5 générations par heure max
  },
  API: {
    windowMs: 60 * 1000,  // 1 minute
    max: 60  // 60 requêtes par minute
  }
} as const