'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface QuotaDisplayProps {
  used: number
  limit: number
  plan: 'free' | 'pro'
  onUpgrade?: () => void
}

export function QuotaDisplay({ used, limit, plan, onUpgrade }: QuotaDisplayProps) {
  const [percentage, setPercentage] = useState(0)
  const remaining = Math.max(0, limit - used)

  useEffect(() => {
    setPercentage((used / limit) * 100)
  }, [used, limit])

  const getStatusColor = () => {
    if (percentage >= 90) return 'from-red-500 to-red-600'
    if (percentage >= 75) return 'from-amber-500 to-amber-600'
    return 'from-indigo-600 to-purple-600'
  }

  const getMessage = () => {
    if (remaining === 0) return '🎬 Quota épuisé'
    if (remaining <= 5) return '⚠️ Plus que quelques minutes'
    if (plan === 'free' && remaining <= 10) return '💎 Pensez au plan Pro'
    return '✅ Crédits disponibles'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Mon quota</h3>
          <p className="text-xs text-gray-400">Mois en cours</p>
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          {plan === 'free' ? '🎁 Gratuit' : '⭐ Pro'}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Utilisé</span>
          <span className="font-mono">
            <span className="font-semibold">{used}</span>
            <span className="text-gray-400">/{limit} min</span>
          </span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${getStatusColor()}`}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {remaining}
            <span className="text-sm font-normal text-gray-400"> min</span>
          </div>
          <p className="text-xs text-gray-500">{getMessage()}</p>
        </div>

        {plan === 'free' && remaining <= 10 && onUpgrade && (
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Passer à Pro
          </button>
        )}
      </div>
    </div>
  )
}