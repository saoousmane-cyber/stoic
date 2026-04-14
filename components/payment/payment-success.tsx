'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BonusConfetti } from '@/p3_frontend_landing/components/bonus/bonus-confetti'
import { useBonus } from '@/hooks/use-bonus'

interface PaymentSuccessProps {
  sessionId?: string
  onContinue?: () => void
}

export function PaymentSuccess({ sessionId, onContinue }: PaymentSuccessProps) {
  const router = useRouter()
  const { bonus, refetch } = useBonus()
  const [showConfetti, setShowConfetti] = useState(true)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Rafraîchir les données du bonus
    refetch()

    // Compte à rebours
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [refetch])

  const handleContinue = () => {
    onContinue?.()
    router.push('/dashboard')
  }

  return (
    <>
      <BonusConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* En-tête avec icône de succès */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Paiement réussi !</h2>
          <p className="text-emerald-100 mt-1">Bienvenue sur le plan Pro</p>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Message de bonus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
              <span className="text-3xl">🎁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              2 heures offertes !
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Nous vous avons offert 120 minutes bonus à utiliser dans les 30 jours.
            </p>
          </motion.div>

          {/* Résumé du bonus */}
          {bonus?.hasBonus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 mb-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Votre bonus</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {bonus.remainingMinutes} / {bonus.totalMinutes} min
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Valable jusqu'au</div>
                  <div className="font-medium">
                    {bonus.expiresAt && new Date(bonus.expiresAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  style={{ width: `${(bonus.remainingMinutes / bonus.totalMinutes) * 100}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Accéder au dashboard
              {countdown > 0 && ` (${countdown})`}
            </button>
            <button
              onClick={() => router.push('/dashboard/generate')}
              className="w-full py-2 text-gray-500 hover:text-gray-700 transition text-sm"
            >
              Créer mon premier contenu →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 text-center">
          <p className="text-xs text-gray-400">
            Un email de confirmation vous a été envoyé avec les détails de votre abonnement.
          </p>
        </div>
      </motion.div>
    </>
  )
}