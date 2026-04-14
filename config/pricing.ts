// AURA & LOGOS - Plans tarifaires

export interface Plan {
  id: string
  name: string
  slug: 'free' | 'pro'
  price: number
  priceId?: string  // Stripe Price ID
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limitations: string[]
  minutesPerMonth: number
  watermark: boolean
  maxDurationMinutes: number
  languages: number
  niches: string[]
  exportFormats: string[]
  prioritySupport: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'free_awakening',
    name: 'L\'Éveil',
    slug: 'free',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      '1 génération par mois',
      'Jusqu\'à 5 minutes par vidéo',
      'Accès aux 8 niches',
      'Bundle SEO inclus',
      'Export MP3 + SRT'
    ],
    limitations: [
      'Filigrane sonore en fin d\'audio',
      'Qualité audio standard',
      'Support communautaire'
    ],
    minutesPerMonth: 5,
    watermark: true,
    maxDurationMinutes: 5,
    languages: 6,
    niches: ['all'],
    exportFormats: ['mp3', 'srt'],
    prioritySupport: false
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    slug: 'pro',
    price: 49,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
    currency: 'EUR',
    interval: 'month',
    features: [
      '20 heures de génération par mois',
      'Jusqu\'à 60 minutes par vidéo',
      'Accès aux 8 niches',
      'Bundle SEO inclus',
      'Export MP3 + SRT + JSON',
      'Toutes les langues (6)',
      'Ducking audio professionnel',
      'Pack images intégré',
      'Assistant de réécriture IA',
      'Suppression du filigrane'
    ],
    limitations: [],
    minutesPerMonth: 1200,  // 20 heures
    watermark: false,
    maxDurationMinutes: 60,
    languages: 6,
    niches: ['all'],
    exportFormats: ['mp3', 'srt', 'vtt', 'json'],
    prioritySupport: true
  }
]

export const getPlanBySlug = (slug: 'free' | 'pro'): Plan => {
  const plan = PLANS.find(p => p.slug === slug)
  if (!plan) throw new Error(`Plan ${slug} not found`)
  return plan
}

export const isPro = (planSlug: string): boolean => {
  return planSlug === 'pro'
}

export const getMinutesRemaining = (planSlug: string, usedMinutes: number): number => {
  const plan = getPlanBySlug(planSlug as 'free' | 'pro')
  return Math.max(0, plan.minutesPerMonth - usedMinutes)
}

export const canGenerate = (planSlug: string, usedMinutes: number, requestedMinutes: number): boolean => {
  const remaining = getMinutesRemaining(planSlug, usedMinutes)
  return remaining >= requestedMinutes
}