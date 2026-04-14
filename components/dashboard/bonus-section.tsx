'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BonusCard } from '@/p3_frontend_landing/components/bonus/bonus-card'
import { BonusProgress } from '@/p3_frontend_landing/components/bonus/bonus-progress'
import { useBonus } from '@/hooks/use-bonus'

export function BonusSection() {
  const { bonus } = useBonus()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!bonus?.hasBonus) return null

  return (
    <div className="space-y-3">
      {/* Version compacte toujours visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-md transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🎁</span>
          <div className="text-left">
            <div className="font-medium text-gray-900 dark:text-white">
              Bonus de bienvenue
            </div>
            <div className="text-xs text-gray-500">
              {bonus.remainingMinutes} minutes offertes restantes
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BonusProgress showLabel={false} size="sm" />
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Version développée */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BonusCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}