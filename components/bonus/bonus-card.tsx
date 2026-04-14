'use client'

import { motion } from 'framer-motion'
import { useBonus } from '@/hooks/use-bonus'

export function BonusCard() {
  const { bonus, isLoading } = useBonus()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  if (!bonus?.hasBonus) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🎁</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Pas encore de bonus ?
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Abonnez-vous au plan Pro et recevez 2h offertes !
          </p>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Découvrir l'offre
          </button>
        </div>
      </div>
    )
  }

  const percentage = (bonus.remainingMinutes / bonus.totalMinutes) * 100
  const daysLeft = bonus.expiresAt
    ? Math.ceil((new Date(bonus.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎁</span>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Bonus de bienvenue
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Offerte après votre premier paiement
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-600">
            {bonus.remainingMinutes}
            <span className="text-sm font-normal text-gray-500">/120 min</span>
          </div>
          <p className="text-xs text-gray-400">
            expire dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="h-3 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-gray-500">Déjà utilisé</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {bonus.totalMinutes - bonus.remainingMinutes} min
          </div>
        </div>
        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-gray-500">Taux d'utilisation</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </div>
        </div>
      </div>

      {/* Message de motivation */}
      {bonus.remainingMinutes > 0 && (
        <p className="text-xs text-center text-amber-600 dark:text-amber-400 mt-4">
          ✨ Profitez de vos minutes offertes avant qu'elles n'expirent !
        </p>
      )}
    </motion.div>
  )
}