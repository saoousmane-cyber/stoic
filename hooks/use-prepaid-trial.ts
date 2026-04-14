'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface PrepaidTrialData {
  isActive: boolean
  remainingMinutes: number
  remainingDays: number
  endsAt: string | null
  canRefund: boolean
}

export function usePrepaidTrial() {
  const { data: session, status } = useSession()
  const [trial, setTrial] = useState<PrepaidTrialData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrial = useCallback(async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/trial/prepaid-status')
      if (!response.ok) throw new Error('Failed to fetch trial status')
      const data = await response.json()
      setTrial(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchTrial()
  }, [fetchTrial])

  const refetch = useCallback(() => {
    setIsLoading(true)
    fetchTrial()
  }, [fetchTrial])

  return {
    trial,
    isLoading,
    error,
    refetch,
  }
}