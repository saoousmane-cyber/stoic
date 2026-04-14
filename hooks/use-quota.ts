'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface QuotaData {
  plan: 'free' | 'pro'
  used: number
  limit: number
  remaining: number
  resetDate: string
}

export function useQuota() {
  const { data: session, status } = useSession()
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuota = useCallback(async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/quota')
      if (!response.ok) throw new Error('Failed to fetch quota')
      const data = await response.json()
      setQuota(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [status])

  const checkCanGenerate = useCallback(async (durationMinutes: number) => {
    if (!quota) return { allowed: false, remaining: 0 }
    
    const remaining = quota.remaining
    if (durationMinutes > remaining) {
      return {
        allowed: false,
        remaining,
        message: `Il vous reste ${remaining} minute${remaining > 1 ? 's' : ''}. Passez au plan Pro pour continuer.`,
      }
    }
    
    return { allowed: true, remaining }
  }, [quota])

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  return {
    quota,
    isLoading,
    error,
    refetch: fetchQuota,
    checkCanGenerate,
  }
}