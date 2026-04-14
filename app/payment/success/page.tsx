// AURA & LOGOS - Page de succès après paiement
// /payment/success?session_id={sessionId}

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [countdown, setCountdown] = useState(5)
  const [bonus, setBonus] = useState<{
    hasBonus: boolean
    remainingMinutes: number
    expiresAt: string | null
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Lancer les confettis
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#d946ef', '#f59e0b'],
    })

    // Deuxième vague
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5, x: 0.3 },
        colors: ['#10b981', '#34d399'],
      })
    }, 200)

    // Troisième vague
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5, x: 0.7 },
        colors: ['#f59e0b', '#fbbf24'],
      })
    }, 400)

    // Récupérer les informations du bonus
    const fetchBonus = async () => {
      try {
        const response = await fetch('/api/user/bonus')
        const data = await response.json()
        setBonus(data)
      } catch (error) {
        console.error('Failed to fetch bonus:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBonus()

    // Compte à rebours avant redirection
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  const handleCreateNow = () => {
    router.push('/dashboard/generate')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full mx-auto"
      >
        {/* Carte principale */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête avec succès */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                className="w-10 h-10 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Paiement réussi !</h1>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                2 heures offertes !
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Nous vous avons offert 120 minutes bonus à utiliser dans les 30 jours.
              </p>
            </motion.div>

            {/* Résumé du bonus */}
            {!isLoading && bonus?.hasBonus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 mb-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Votre bonus
                  </span>
                  <span className="text-sm font-medium text-amber-600">
                    {bonus.remainingMinutes} / 120 min
                  </span>
                </div>
                <div className="h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{
                      width: `${((120 - bonus.remainingMinutes) / 120) * 100}%`,
                    }}
                  />
                </div>
                {bonus.expiresAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    ⏰ Expire le{' '}
                    {new Date(bonus.expiresAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCreateNow}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                ✨ Créer mon premier contenu
              </button>
              <button
                onClick={handleContinue}
                className="w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition text-sm"
              >
                Accéder au dashboard {countdown > 0 && `(${countdown})`}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 text-center">
            <p className="text-xs text-gray-400">
              Un email de confirmation vous a été envoyé avec les détails de votre abonnement
              et vos 2h offertes.
            </p>
          </div>
        </div>

        {/* Carte d'information sur l'essai */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">⏳</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Période d'essai de 7 jours
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Vous disposez de 7 jours pour tester toutes les fonctionnalités Pro
                avec vos 2h offertes. L'abonnement débutera automatiquement après
                cette période ou après épuisement de vos 2h.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <span>✓</span> 2h de création
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <span>✓</span> 7 jours d'essai
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                  <span>🔄</span> Remboursable
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Validation de votre paiement...
            </p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}