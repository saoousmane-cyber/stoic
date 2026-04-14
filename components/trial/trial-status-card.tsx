'use client'

import { motion } from 'framer-motion'

interface TrialStatusCardProps {
  remainingMinutes: number
  remainingDays: number
  totalMinutes: number
  onRefund: () => void
}

export function TrialStatusCard({
  remainingMinutes,
  remainingDays,
  totalMinutes,
  onRefund,
}: TrialStatusCardProps) {
  const percentage = (remainingMinutes / totalMinutes) * 100
  const usedMinutes = totalMinutes - remainingMinutes
  const isLow = remainingMinutes <= 30

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        Statut de l'essai
      </h3>

      {/* Minutes restantes */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Minutes restantes</span>
          <span className={`font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
            {remainingMinutes} / {totalMinutes} min
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              isLow
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
          />
        </div>
      </div>

      {/* Jours restants */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Jours restants</span>
          <span className="font-bold text-amber-600">{remainingDays} / 7 jours</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            style={{ width: `${(remainingDays / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
          <div className="text-gray-500">Déjà utilisé</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {usedMinutes} min
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
          <div className="text-gray-500">Taux d'utilisation</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {Math.round((usedMinutes / totalMinutes) * 100)}%
          </div>
        </div>
      </div>

      {/* Bouton de remboursement */}
      <button
        onClick={onRefund}
        className="w-full py-2.5 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition"
      >
        Annuler et être remboursé
      </button>
      <p className="text-xs text-center text-gray-400 mt-2">
        Remboursement intégral possible jusqu'à la fin de l'essai
      </p>
    </motion.div>
  )
}