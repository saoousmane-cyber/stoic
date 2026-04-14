'use client'

import { motion } from 'framer-motion'
import { useBonus } from '@/hooks/use-bonus'

interface BonusProgressProps {
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function BonusProgress({ showLabel = true, size = 'md' }: BonusProgressProps) {
  const { bonus, isLoading } = useBonus()

  if (isLoading || !bonus?.hasBonus) return null

  const percentage = (bonus.remainingMinutes / bonus.totalMinutes) * 100
  const isLow = bonus.remainingMinutes <= 30

  const sizeClasses = {
    sm: { container: 'h-1.5', text: 'text-xs', icon: 'text-sm' },
    md: { container: 'h-2', text: 'text-sm', icon: 'text-base' },
    lg: { container: 'h-3', text: 'text-base', icon: 'text-xl' },
  }

  const colors = isLow
    ? 'from-red-500 to-red-600'
    : 'from-amber-500 to-orange-500'

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className={sizeClasses[size].icon}>🎁</span>
            <span className={`${sizeClasses[size].text} text-gray-600 dark:text-gray-400`}>
              Bonus
            </span>
          </div>
          <span className={`${sizeClasses[size].text} font-medium text-amber-600`}>
            {bonus.remainingMinutes} min restantes
          </span>
        </div>
      )}
      <div className={`${sizeClasses[size].container} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors} rounded-full relative`}
        >
          {percentage > 80 && (
            <div className="absolute inset-0 flex items-center justify-end pr-1">
              <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}