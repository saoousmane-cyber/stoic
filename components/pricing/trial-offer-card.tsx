'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface TrialOfferCardProps {
  onTrialStarted?: () => void
  variant?: 'default' | 'compact' | 'hero'
}

export function TrialOfferCard({ onTrialStarted, variant = 'default' }: TrialOfferCardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleStartTrial = async () => {
    if (status !== 'authenticated') {
      router.push('/api/auth/signin')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Appeler l'API pour démarrer l'essai
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/payment/success?trial_started=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
      
      onTrialStarted?.()
    } catch (error) {
      console.error('Failed to start trial:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Variante compact (pour sidebar)
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎁</div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">2 heures offertes</h4>
            <p className="text-xs text-indigo-100">Testez Pro pendant 7 jours</p>
          </div>
          <button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            {isLoading ? '...' : 'Essai'}
          </button>
        </div>
      </motion.div>
    )
  }

  // Variante hero (pour page d'accueil)
  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl max-w-md mx-auto"
      >
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
            🎁 Offre limitée
          </div>
        </div>

        <div className="text-center">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-2xl font-bold mb-2">2 heures gratuites</h3>
          <p className="text-indigo-100 mb-4">
            Testez toutes les fonctionnalités Pro pendant 7 jours, sans engagement.
          </p>
          
          <div className="space-y-2 mb-6 text-left bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-300">✓</span>
              <span>2 heures de génération (120 minutes)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-300">✓</span>
              <span>Valable 7 jours</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-300">✓</span>
              <span>Toutes les niches et langues</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-300">✓</span>
              <span>Voix HD, images, sous-titres</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-300">✓</span>
              <span>Sans filigrane</span>
            </div>
          </div>
          
          <button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Initialisation...
              </span>
            ) : (
              'Commencer mon essai gratuit'
            )}
          </button>
          
          <p className="text-center text-xs text-indigo-200 mt-4">
            🔄 À la fin des 2h, votre abonnement Pro (49€/mois) démarre automatiquement.<br />
            Vous pouvez annuler à tout moment pendant l'essai.
          </p>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-center text-xs text-indigo-200 hover:text-white mt-3 underline"
          >
            {showDetails ? 'Masquer les détails' : 'En savoir plus'}
          </button>
          
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 bg-white/10 rounded-lg text-xs space-y-1 text-left"
            >
              <p>• Aucun paiement initial requis - carte bancaire demandée pour l'abonnement</p>
              <p>• Vous serez prélevé uniquement après les 7 jours d'essai (49€/mois)</p>
              <p>• Si vous utilisez moins de 2h pendant l'essai, l'abonnement démarre quand même</p>
              <p>• Annulez à tout moment depuis votre dashboard ou via Stripe</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Variante par défaut
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="absolute top-4 right-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
          🎁 Offre limitée
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="text-center md:text-left">
          <div className="text-4xl mb-2">✨</div>
          <h3 className="text-xl font-bold">2 heures gratuites</h3>
          <p className="text-indigo-100 text-sm">
            Testez toutes les fonctionnalités Pro pendant 7 jours
          </p>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-green-300">✓</span>
            <span>2h de création</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-300">✓</span>
            <span>7 jours d'essai</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-300">✓</span>
            <span>Toutes les niches</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-300">✓</span>
            <span>Sans filigrane</span>
          </div>
        </div>
        
        <button
          onClick={handleStartTrial}
          disabled={isLoading}
          className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition whitespace-nowrap disabled:opacity-50"
        >
          {isLoading ? '...' : 'Commencer l\'essai'}
        </button>
      </div>
      
      <p className="text-center text-xs text-indigo-200 mt-4">
        🔄 Après l'essai, l'abonnement Pro (49€/mois) démarre automatiquement.
        <button onClick={() => setShowDetails(!showDetails)} className="underline ml-1">
          En savoir plus
        </button>
      </p>
      
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-white/10 rounded-lg text-xs space-y-1"
        >
          <p>• Carte bancaire requise pour l'abonnement</p>
          <p>• Prélèvement uniquement après l'essai</p>
          <p>• Annulation possible à tout moment</p>
          <p>• Remboursement intégral pendant l'essai</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TrialOfferCard