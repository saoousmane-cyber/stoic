// AURA & LOGOS - Types globaux

// Extension des types NextAuth
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id?: string
    plan?: 'free' | 'pro'
    quotaUsed?: number
    quotaLimit?: number
    quotaResetDate?: string
  }
  
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: 'free' | 'pro'
      quotaUsed?: number
      quotaLimit?: number
      quotaResetDate?: string
    }
  }
}

// Types utilisateur
export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  plan: 'free' | 'pro'
  quotaUsed: number
  quotaLimit: number
  quotaResetDate: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
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
  status: 'pending' | 'processing' | 'completed' | 'failed'
  script?: string
  audioUrl?: string
  srtUrl?: string
  zipUrl?: string
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  completedAt?: string
}

// Types paiement
export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  status: 'active' | 'past_due' | 'canceled' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
}