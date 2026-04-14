'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TrialTimerProps {
  endsAt: string | null
  onExpire?: () => void
}

export function TrialTimer({ endsAt, onExpire }: TrialTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!endsAt) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endsAt).getTime()
      const distance = end - now

      if (distance < 0) {
        clearInterval(interval)
        setIsExpired(true)
        onExpire?.()
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [endsAt, onExpire])

  if (isExpired) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
        <p className="text-red-700 dark:text-red-400 font-medium">
          ⏰ Votre période d'essai est terminée
        </p>
        <p className="text-sm text-red-600 dark:text-red-500 mt-1">
          Votre abonnement a débuté automatiquement
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white text-center"
    >
      <p className="text-sm opacity-80 mb-2">Temps restant avant la fin de l'essai</p>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs opacity-80">jours</div>
        </div>
        <div className="text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs opacity-80">heures</div>
        </div>
        <div className="text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs opacity-80">minutes</div>
        </div>
        <div className="text-3xl font-bold">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs opacity-80">secondes</div>
        </div>
      </div>
      <p className="text-xs opacity-80 mt-2">
        L'abonnement débutera automatiquement après cette période
      </p>
    </motion.div>
  )
}