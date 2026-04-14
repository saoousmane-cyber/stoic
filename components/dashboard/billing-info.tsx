'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BillingInfo {
  plan: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  nextInvoiceAmount?: number
}

export function BillingInfo() {
  const router = useRouter()
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBillingInfo()
  }, [])

  const fetchBillingInfo = async () => {
    try {
      const response = await fetch('/api/payment/subscription')
      const data = await response.json()
      setBilling(data)
    } catch (error) {
      console.error('Failed to fetch billing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/payment/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.href }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create portal:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  if (!billing || billing.plan !== 'pro') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="text-center">
          <div className="text-4xl mb-3">🎁</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Plan Gratuit
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            5 minutes par mois • Filigrane audio
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Passer à Pro (49€/mois)
          </button>
        </div>
      </div>
    )
  }

  const startDate = new Date(billing.currentPeriodStart).toLocaleDateString('fr-FR')
  const endDate = new Date(billing.currentPeriodEnd).toLocaleDateString('fr-FR')
  const daysLeft = Math.ceil((new Date(billing.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Informations de facturation</h3>
          <p className="text-sm text-gray-500">Plan Pro • 49€/mois</p>
        </div>
        <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
          Actif
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600">Période en cours</span>
          <span className="font-medium">{startDate} → {endDate}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600">Jours restants</span>
          <span className="font-medium">{daysLeft} jours</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600">Prochain paiement</span>
          <span className="font-medium">{endDate} • 49€</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Renouvellement</span>
          <span className={`font-medium ${billing.cancelAtPeriodEnd ? 'text-red-600' : 'text-green-600'}`}>
            {billing.cancelAtPeriodEnd ? 'Annulé (fin de période)' : 'Automatique'}
          </span>
        </div>
      </div>

      <button
        onClick={handleManageSubscription}
        className="w-full mt-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
      >
        Gérer mon abonnement
      </button>
    </div>
  )
}