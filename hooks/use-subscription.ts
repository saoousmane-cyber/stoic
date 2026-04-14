'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface SubscriptionData {
  plan: 'free' | 'pro'
  status: 'active' | 'inactive' | 'past_due' | 'canceled'
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
  nextInvoiceAmount?: number
}

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null
  isLoading: boolean
  error: string | null
  isPro: boolean
  isActive: boolean
  daysRemaining: number
  refreshSubscription: () => Promise<void>
  cancelSubscription: () => Promise<boolean>
  createPortalSession: () => Promise<string | null>
}

export function useSubscription(): UseSubscriptionReturn {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscription = useCallback(async () => {
    if (!session) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/payment/subscription')
      const data = await response.json()
      setSubscription(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const refreshSubscription = useCallback(async () => {
    setIsLoading(true)
    await fetchSubscription()
  }, [fetchSubscription])

  const cancelSubscription = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/payment/subscription', { method: 'DELETE' })
      if (response.ok) {
        await refreshSubscription()
        return true
      }
      return false
    } catch (error) {
      console.error('Cancel subscription error:', error)
      return false
    }
  }, [refreshSubscription])

  const createPortalSession = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/payment/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.href }),
      })
      const data = await response.json()
      return data.url || null
    } catch (error) {
      console.error('Create portal error:', error)
      return null
    }
  }, [])

  const isPro = subscription?.plan === 'pro'
  const isActive = subscription?.status === 'active'
  
  const daysRemaining = subscription?.currentPeriodEnd
    ? Math.max(0, Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  return {
    subscription,
    isLoading,
    error,
    isPro,
    isActive,
    daysRemaining,
    refreshSubscription,
    cancelSubscription,
    createPortalSession,
  }
}