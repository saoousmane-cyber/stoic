'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PricingTier {
  name: string
  price: number
  interval: 'month' | 'year'
  description: string
  features: string[]
  limitations?: string[]
  isPopular?: boolean
  ctaText: string
}

const tiers: PricingTier[] = [
  {
    name: 'L\'Éveil',
    price: 0,
    interval: 'month',
    description: 'Pour découvrir la plateforme',
    features: [
      '1 génération par mois',
      'Jusqu\'à 5 minutes par vidéo',
      'Accès aux 8 niches',
      'Bundle SEO inclus',
      'Export MP3 + SRT',
    ],
    limitations: [
      'Filigrane sonore',
      'Qualité audio standard',
      'Support communautaire',
    ],
    ctaText: 'Commencer gratuitement',
  },
  {
    name: 'Pro',
    price: 49,
    interval: 'month',
    description: 'Pour les créateurs sérieux',
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
      'Suppression du filigrane',
      'Support prioritaire',
    ],
    isPopular: true,
    ctaText: 'Passer à Pro',
  },
]

export function PricingTable() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  return (
    <div className="py-12">
      {/* Bascule annuel/mensuel */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              billingInterval === 'month'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              billingInterval === 'year'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Annuel <span className="text-xs text-green-600">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, index) => {
          const annualPrice = tier.price * 12 * 0.8
          const displayPrice = billingInterval === 'month' ? tier.price : Math.round(annualPrice / 12)
          
          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.isPopular
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-500'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-medium">
                    Populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{tier.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {displayPrice === 0 ? 'Gratuit' : `${displayPrice}€`}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-500">/mois</span>
                  )}
                </div>
                {tier.price > 0 && billingInterval === 'year' && (
                  <p className="text-xs text-green-600 mt-1">
                    Économisez 20% avec l'engagement annuel
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                {tier.limitations?.map((limitation) => (
                  <div key={limitation} className="flex items-center gap-2 text-sm opacity-60">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-400">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (tier.price === 0) {
                    window.location.href = '/api/auth/signin'
                  } else {
                    window.location.href = '/api/payment/create-checkout'
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  tier.isPopular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {tier.ctaText}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}