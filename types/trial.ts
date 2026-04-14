// AURA & LOGOS - Types pour le système d'essai gratuit (2h offertes après paiement)

export type TrialStatus = 'active' | 'exhausted' | 'expired' | 'converted' | 'cancelled' | 'grace'

export interface Trial {
  id: string
  userId: string
  userEmail: string
  status: TrialStatus
  startedAt: string
  expiresAt: string
  convertedAt?: string
  quotaUsed: number
  quotaLimit: number // 120 minutes (2h)
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  stripeCheckoutSessionId?: string
  createdAt: string
  updatedAt: string
}

export interface TrialConfig {
  FREE_TRIAL_MINUTES: number // 120 minutes (2h)
  FREE_TRIAL_DAYS: number // 7 jours
  GRACE_PERIOD_MINUTES: number // 5 minutes de grâce après expiration
}

export interface TrialCheckoutSession {
  sessionId: string
  url: string
  trialEndsAt: string
  willAutoConvert: boolean
}

export interface TrialStatusResponse {
  hasTrial: boolean
  trial?: {
    status: TrialStatus
    remainingMinutes: number
    remainingDays: number
    expiresAt: string
    willAutoConvert: boolean
  }
  subscription?: {
    isActive: boolean
    currentPeriodEnd?: string
  }
}

export interface TrialQuotaUpdate {
  success: boolean
  trialExhausted: boolean
  remainingMinutes: number
  subscriptionActivated: boolean
}

// Bonus utilisateur (2h offertes)
export interface UserBonus {
  id: string
  userId: string
  type: 'welcome_bonus' | 'referral_bonus' | 'promo_bonus'
  minutes: number
  minutesUsed: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface UserBonusInfo {
  hasWelcomeBonus: boolean
  welcomeBonusRemaining: number
  welcomeBonusTotal: number
  welcomeBonusExpiresAt: Date | null
  trialActive: boolean
  trialRemainingMinutes: number
  trialRemainingDays: number
}