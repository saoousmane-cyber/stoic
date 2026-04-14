'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface PrepaidTrialBannerProps {
  onRefund?: () => void
}

export function PrepaidTrialBanner({ onRefund }: PrepaidTrialBannerProps) {
  const { data: session } = useSession()
  const [trial, setTrial] = useState<{
    isActive: boolean
    remainingMinutes: number
    remainingDays: number
    endsAt: string | null
    canRefund: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefunding, setIsRefunding] = useState(false)
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)

  useEffect(() => {
    if (session) {
      fetchTrialStatus()
    }
  }, [session])

  const fetchTrialStatus = async () => {
    try {
      const response = await fetch('/api/trial/prepaid-status')
      const data = await response.json()
      setTrial(data)
    } catch (error) {
      console.error('Failed to fetch trial:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    setIsRefunding(true)
    try {
      const response = await fetch('/api/trial/refund', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        onRefund?.()
        window.location.href = '/'
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Erreur lors du remboursement')
    } finally {
      setIsRefunding(false)
      setShowRefundConfirm(false)
    }
  }

  if (isLoading || !trial?.isActive) return null

  const percentage = (trial.remainingMinutes / 120) * 100
  const isLow = trial.remainingMinutes <= 30
  const isVeryLow = trial.remainingMinutes <= 10

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl ${
        isVeryLow
          ? 'bg-gradient-to-r from-red-500 to-red-600'
          : isLow
          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
      } p-5 text-white shadow-lg`}
    >
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="trial-stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
            <circle cx="10" cy="10" r="0.5" fill="white" />
            <circle cx="18" cy="4" r="0.8" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#trial-stars)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏳</span>
            <div>
              <h4 className="font-bold">Période d'essai</h4>
              <p className="text-xs text-white/80">
                {trial.remainingDays} jour{trial.remainingDays > 1 ? 's' : ''} restants
              </p>
            </div>
          </div>
          {trial.canRefund && (
            <button
              onClick={() => setShowRefundConfirm(true)}
              className="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition"
            >
              Annuler et remboursement
            </button>
          )}
        </div>

        {/* Minutes restantes */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Minutes de création restantes</span>
            <span className="font-mono font-bold">{trial.remainingMinutes}/120</span>
          </div>
          <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                isVeryLow ? 'bg-red-300' : isLow ? 'bg-amber-300' : 'bg-white'
              }`}
            />
          </div>
        </div>

        {/* Message d'information */}
        <div className="text-xs text-white/80 space-y-1">
          <p>✓ Votre abonnement débutera automatiquement après la période d'essai</p>
          <p>✓ Aucun prélèvement supplémentaire pendant l'essai</p>
          {trial.canRefund && (
            <p className="text-white font-medium">
              🔄 Remboursement intégral possible jusqu'à la fin de l'essai
            </p>
          )}
        </div>
      </div>

      {/* Modal de confirmation de remboursement */}
      <AnimatePresence>
        {showRefundConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRefundConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Annuler l'essai ?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Vous allez perdre l'accès à votre contenu et être remboursé intégralement.
                  Cette action est irréversible.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRefundConfirm(false)}
                  className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
                >
                  Continuer l'essai
                </button>
                <button
                  onClick={handleRefund}
                  disabled={isRefunding}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isRefunding ? 'Annulation...' : 'Oui, annuler'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}