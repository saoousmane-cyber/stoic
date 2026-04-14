// AURA & LOGOS - Types globaux

// Types utilisateur de base (non liés à NextAuth)
export interface AppUser {
  id: string
  email: string
  name: string | null
  image: string | null
  plan: 'free' | 'pro' | 'trial'
  quotaUsed: number
  quotaLimit: number
  quotaResetDate: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  trialId: string | null
  trialExpiresAt: string | null
  createdAt: string
  updatedAt: string
}

// Types génération
export interface Generation {
  id: string
  userId: string
  topic: string
  niche: string
  language: string
  duration: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  script?: string
  audioUrl?: string
  srtUrl?: string
  zipUrl?: string
  seoTitle?: string
  seoDescription?: string
  metadata?: {
    wordCount?: number
    audioDuration?: number
    imagesCount?: number
    estimatedCost?: number
    modelUsed?: string
  }
  createdAt: string
  completedAt?: string
}

// Types paiement
export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
}

// Types niche
export interface Niche {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  keywords: string[]
  exampleTopics: string[]
}

// Types langue
export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
}

// Types API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Types quota
export interface QuotaInfo {
  plan: 'free' | 'pro' | 'trial'
  used: number
  limit: number
  remaining: number
  resetDate: string
}

// Types génération request
export interface GenerationRequest {
  topic: string
  niche: string
  language: string
  duration: number
  includeSoundEffects?: boolean
  soundEffectIntensity?: 'light' | 'moderate' | 'rich'
}

// Types génération response
export interface GenerationResponse {
  success: boolean
  generationId?: string
  downloadUrl?: string
  metadata?: {
    title: string
    description: string
    tags: string[]
    seoScore: number
  }
  stats?: {
    wordCount: number
    audioDuration: number
    imagesFound: number
    estimatedCost: number
  }
  error?: string
}