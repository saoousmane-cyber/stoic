'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface BonusData {
  hasBonus: boolean
  remainingMinutes: number
  totalMinutes: number
  expiresAt: string | null
  usedMinutes: number
  percentage: number
}

export function useBonus() {
  const { data: session, status } = useSession()
  const [bonus, setBonus] = useState<BonusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBonus = useCallback(async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/bonus')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bonus')
      }
      
      const data = await response.json()
      
      setBonus({
        hasBonus: data.hasBonus || false,
        remainingMinutes: data.remainingMinutes || 0,
        totalMinutes: data.totalMinutes || 120,
        expiresAt: data.expiresAt || null,
        usedMinutes: (data.totalMinutes || 120) - (data.remainingMinutes || 0),
        percentage: data.totalMinutes 
          ? ((data.totalMinutes - (data.remainingMinutes || 0)) / data.totalMinutes) * 100
          : 0,
      })
    } catch (err) {
      console.error('Fetch bonus error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchBonus()
  }, [fetchBonus])

  const refetch = useCallback(() => {
    setIsLoading(true)
    fetchBonus()
  }, [fetchBonus])

  const hasValidBonus = bonus?.hasBonus === true && (bonus.remainingMinutes || 0) > 0

  const getBonusStatus = useCallback(() => {
    if (!hasValidBonus) return 'none'
    if (bonus.remainingMinutes <= 10) return 'critical'
    if (bonus.remainingMinutes <= 30) return 'warning'
    return 'active'
  }, [hasValidBonus, bonus?.remainingMinutes])

  const getBonusMessage = useCallback(() => {
    if (!hasValidBonus) return null
    
    const daysLeft = bonus.expiresAt
      ? Math.ceil((new Date(bonus.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0
    
    if (bonus.remainingMinutes <= 10) {
      return `⚠️ Plus que ${bonus.remainingMinutes} minutes offertes ! Utilisez-les avant expiration.`
    }
    
    if (bonus.remainingMinutes <= 30) {
      return `⚡ Il vous reste ${bonus.remainingMinutes} minutes offertes sur ${bonus.totalMinutes}.`
    }
    
    return `🎁 ${bonus.remainingMinutes} minutes offertes restantes sur ${bonus.totalMinutes} (expire dans ${daysLeft} jours)`
  }, [hasValidBonus, bonus])

  return {
    bonus,
    isLoading,
    error,
    refetch,
    hasBonus: hasValidBonus,
    remainingMinutes: bonus?.remainingMinutes || 0,
    totalMinutes: bonus?.totalMinutes || 120,
    usedMinutes: bonus?.usedMinutes || 0,
    percentage: bonus?.percentage || 0,
    expiresAt: bonus?.expiresAt,
    getBonusStatus,
    getBonusMessage,
  }
}