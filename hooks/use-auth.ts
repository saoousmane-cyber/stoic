'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface UseAuthReturn {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    plan?: 'free' | 'pro' | 'trial'
    quotaUsed?: number
    quotaLimit?: number
  } | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  isAuthenticated: boolean
  isLoading: boolean
  isPro: boolean
  login: (provider?: 'google' | 'email', email?: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [status])

  const login = useCallback(async (provider: 'google' | 'email' = 'google', email?: string) => {
    if (provider === 'google') {
      await signIn('google', { callbackUrl: '/dashboard' })
    } else if (provider === 'email' && email) {
      await signIn('email', { email, callbackUrl: '/dashboard' })
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  const refreshSession = useCallback(async () => {
    await update()
  }, [update])

  const isPro = session?.user?.plan === 'pro'

  return {
    user: session?.user || null,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading,
    isPro,
    login,
    logout,
    refreshSession,
  }
}