// AURA & LOGOS - Types pour le système d'emails

export interface EmailEvent {
  type: 'delivered' | 'bounced' | 'complained' | 'opened' | 'clicked'
  data: {
    to: string
    from: string
    subject: string
    timestamp: string
    reason?: string
    link?: string
  }
}

export interface EmailTemplate {
  name: string
  subject: string
  html: string
  variables: string[]
}

export interface EmailConfig {
  from: string
  support: string
  maxRetries: number
  retryDelay: number
}

// Templates d'emails
export interface WelcomeEmailParams {
  userName?: string
  userEmail: string
  bonusMinutes: number
  trialDays: number
  dashboardUrl: string
  supportUrl: string
}

export interface TrialReminderEmailParams {
  userName?: string
  userEmail: string
  remainingMinutes: number
  remainingDays: number
  dashboardUrl: string
  supportUrl: string
}

export interface ConversionEmailParams {
  userName?: string
  userEmail: string
  dashboardUrl: string
  supportUrl: string
}

export interface RefundEmailParams {
  userName?: string
  userEmail: string
  amount: number
  dashboardUrl: string
  supportUrl: string
}

export interface PaymentFailedEmailParams {
  userName?: string
  userEmail: string
  amount: number
  retryDate: string
  dashboardUrl: string
  supportUrl: string
}

// Résultat d'envoi
export interface EmailSendResult {
  success: boolean
  id?: string
  error?: string
}