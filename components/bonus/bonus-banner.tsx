'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBonus } from '@/hooks/use-bonus'

interface BonusBannerProps {
  onDismiss?: () => void
}

export function BonusBanner({ onDismiss }: BonusBannerProps) {
  const { bonus, isLoading, refetch } = useBonus()
  const [isVisible, setIsVisible] = useState(true)
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    if (bonus?.expiresAt) {
      const days = Math.ceil((new Date(bonus.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      setDaysLeft(Math.max(0, days))
    }
  }, [bonus?.expiresAt])

  if (isLoading || !bonus?.hasBonus || !isVisible) return null

  const percentage = (bonus.remainingMinutes / bonus.totalMinutes) * 100
  const isLow = bonus.remainingMinutes <= 30
  const isVeryLow = bonus.remainingMinutes <= 10

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`relative overflow-hidden rounded-xl ${
          isVeryLow
            ? 'bg-gradient-to-r from-red-500 to-red-600'
            : isLow
            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
        } p-4 text-white shadow-lg`}
      >
        {/* Pattern de fond */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
              <circle cx="10" cy="10" r="0.5" fill="white" />
              <circle cx="18" cy="4" r="0.8" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#stars)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Icône et texte */}
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">
              {isVeryLow ? '⚡' : isLow ? '🎁' : '✨'}
            </div>
            <div>
              <h4 className="font-bold text-lg">
                {bonus.remainingMinutes} minutes offertes restantes
              </h4>
              <p className="text-sm text-white/80">
                Offert après votre premier paiement • Valable encore {daysLeft} jour{daysLeft > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span>Progression</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isVeryLow
                    ? 'bg-red-300'
                    : isLow
                    ? 'bg-amber-300'
                    : 'bg-white'
                }`}
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            {isLow && (
              <button
                onClick={() => window.location.href = '/pricing'}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
              >
                Profiter de l'offre
              </button>
            )}
            <button
              onClick={() => {
                setIsVisible(false)
                onDismiss?.()
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Effet de particules (confetti léger) */}
        {!isVeryLow && (
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-200" />
            <div className="absolute top-6 right-3 w-0.5 h-0.5 bg-white rounded-full animate-ping animation-delay-500" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}