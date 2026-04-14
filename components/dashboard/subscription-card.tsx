'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SubscriptionCardProps {
  onUpgrade?: () => void
  onCancel?: () => void
}

export function SubscriptionCard({ onUpgrade, onCancel }: SubscriptionCardProps) {
  const router = useRouter()
  const [subscription, setSubscription] = useState<{
    plan: string
    status: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/payment/subscription')
      const data = await response.json()
      setSubscription(data)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l\'accès au plan Pro à la fin de la période en cours.')) return
    
    setIsCancelling(true)
    try {
      const response = await fetch('/api/payment/subscription', { method: 'DELETE' })
      if (response.ok) {
        await fetchSubscription()
        onCancel?.()
      }
    } catch (error) {
      console.error('Failed to cancel:', error)
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-1/2 bg-white/30 rounded" />
          <div className="h-10 w-1/3 bg-white/30 rounded" />
          <div className="h-4 w-3/4 bg-white/30 rounded" />
        </div>
      </div>
    )
  }

  const isPro = subscription?.plan === 'pro'
  const endDate = subscription?.currentPeriodEnd 
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  if (!isPro) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-80 mb-1">Plan actuel</div>
            <div className="text-2xl font-bold">Gratuit</div>
            <p className="text-sm opacity-80 mt-1 max-w-xs">
              5 minutes par mois • Filigrane audio
            </p>
          </div>
          <button
            onClick={() => router.push('/pricing')}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
          >
            Upgrade
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm opacity-80">Plan actuel</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">⭐ Pro</span>
          </div>
          <div className="text-2xl font-bold">49€ / mois</div>
          <p className="text-sm opacity-80 mt-1">
            {subscription?.cancelAtPeriodEnd 
              ? `Se termine le ${endDate}`
              : `Prochain paiement le ${endDate}`}
          </p>
        </div>
        {!subscription?.cancelAtPeriodEnd && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition disabled:opacity-50"
          >
            {isCancelling ? 'Annulation...' : 'Annuler'}
          </button>
        )}
      </div>

      {subscription?.cancelAtPeriodEnd && (
        <div className="mt-3 p-2 bg-white/10 rounded-lg text-xs text-center">
          Votre abonnement est actif jusqu'au {endDate}. Aucun prélèvement ne sera effectué après cette date.
        </div>
      )}
    </div>
  )
}