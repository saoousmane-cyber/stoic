'use client'

import { motion } from 'framer-motion'

interface TrialUsageChartProps {
  usedMinutes: number
  totalMinutes: number
}

export function TrialUsageChart({ usedMinutes, totalMinutes }: TrialUsageChartProps) {
  const remainingMinutes = totalMinutes - usedMinutes
  const usedPercentage = (usedMinutes / totalMinutes) * 100
  const remainingPercentage = (remainingMinutes / totalMinutes) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📈</span>
        Utilisation des 2h offertes
      </h3>

      {/* Graphique en anneau */}
      <div className="flex justify-center mb-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Cercle de fond */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              className="dark:stroke-gray-700"
            />
            {/* Cercle utilisé */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${usedPercentage * 2.827} 282.7`}
              strokeLinecap="round"
              className="dark:stroke-emerald-600"
            />
            {/* Cercle restant */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeDasharray={`${remainingPercentage * 2.827} 282.7`}
              strokeDashoffset={`-${usedPercentage * 2.827}`}
              strokeLinecap="round"
              className="dark:stroke-amber-600"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(usedPercentage)}%
            </span>
            <span className="text-xs text-gray-500">utilisé</span>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">Utilisé</span>
          </div>
          <span className="font-medium">{usedMinutes} min</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">Restant</span>
          </div>
          <span className="font-medium">{remainingMinutes} min</span>
        </div>
        <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total offert</span>
            <span className="font-bold text-gray-900 dark:text-white">{totalMinutes} min</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}