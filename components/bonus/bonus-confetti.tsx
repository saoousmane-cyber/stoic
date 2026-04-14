'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface BonusConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function BonusConfetti({ active, onComplete }: BonusConfettiProps) {
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (active && !hasTriggered) {
      setHasTriggered(true)

      // Confetti principal
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#fbbf24', '#f97316'],
      })

      // Deuxième vague
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          colors: ['#f59e0b', '#fbbf24'],
        })
      }, 150)

      // Troisième vague
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.7 },
          colors: ['#ea580c', '#f97316'],
        })
      }, 300)

      setTimeout(() => {
        onComplete?.()
      }, 2000)
    }
  }, [active, hasTriggered, onComplete])

  return null
}