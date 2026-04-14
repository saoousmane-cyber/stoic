// AURA & LOGOS - Facturation et abonnement
// /dashboard/billing

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Invoice {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  created: string
  pdfUrl?: string
  number?: string
}

export default function BillingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<{
    plan: string
    status: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
  } | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    fetchSubscription()
    fetchInvoices()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/payment/subscription')
      const data = await response.json()
      setSubscription(data)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/payment/invoices')
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
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
      console.error('Failed to create portal session:', error)
      alert('Erreur lors de l\'ouverture du portail de gestion')
    }
  }

  const handleCancelSubscription = async () => {
    setIsCancelling(true)
    try {
      const response = await fetch('/api/payment/subscription', { method: 'DELETE' })
      if (response.ok) {
        await fetchSubscription()
        alert('Abonnement annulé avec succès. Vous aurez accès au plan Pro jusqu\'à la fin de la période en cours.')
        setShowCancelModal(false)
      } else {
        throw new Error('Erreur lors de l\'annulation')
      }
    } catch (error) {
      console.error('Failed to cancel:', error)
      alert('Erreur lors de l\'annulation de l\'abonnement')
    } finally {
      setIsCancelling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      paid: { label: 'Payé', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
      failed: { label: 'Échoué', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    }
    const c = config[status] || config.pending
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💳 Facturation</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gérez votre abonnement et vos paiements
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carte d'abonnement */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Abonnement actuel
          </h2>
          
          {isPro ? (
            <>
              <div className="mb-4">
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium">
                  Plan Pro
                </div>
                <p className="text-3xl font-bold mt-3">49€ <span className="text-base font-normal text-gray-500">/mois</span></p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Statut</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Actif</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Prochain paiement</span>
                  <span className="font-medium">{endDate || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Renouvellement</span>
                  <span className={`font-medium ${subscription?.cancelAtPeriodEnd ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {subscription?.cancelAtPeriodEnd ? 'Annulé (fin de période)' : 'Automatique'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleManageSubscription}
                  className="flex-1 py-2 border border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition"
                >
                  Gérer mon abonnement
                </button>
                {!subscription?.cancelAtPeriodEnd && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 py-2 border border-red-600 text-red-600 dark:border-red-500 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    Annuler
                  </button>
                )}
              </div>

              {subscription?.cancelAtPeriodEnd && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  Votre abonnement est actif jusqu'au {endDate}. Aucun prélèvement ne sera effectué après cette date.
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🎁</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plan Gratuit</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                5 minutes par mois • Filigrane audio
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Passer à Pro (49€/mois)
              </button>
            </div>
          )}
        </div>

        {/* Informations complémentaires */}
        <div className="space-y-6">
          {/* Section informations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Informations
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Moyen de paiement</span>
                <span className="font-medium">Carte bancaire</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Facturation</span>
                <span className="font-medium">Mensuelle</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Prochaine facture</span>
                <span className="font-medium">{endDate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section paiement sécurisé */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="text-xl">💳</span>
                <span className="text-xl">🔒</span>
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Paiement 100% sécurisé</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Par Stripe • Cryptage SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des factures */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            📄 Historique des factures
          </h2>
        </div>
        <div className="overflow-x-auto">
          {invoices.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500 dark:text-gray-400">Aucune facture disponible</p>
              <p className="text-xs text-gray-400 mt-1">
                Les factures apparaîtront après votre premier paiement
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Montant</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Facture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="p-4 text-sm text-gray-900 dark:text-white">
                      {new Date(invoice.created).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {invoice.amount.toFixed(2)} {invoice.currency.toUpperCase()}
                    </td>
                    <td className="p-4">{getStatusBadge(invoice.status)}</td>
                    <td className="p-4">
                      {invoice.pdfUrl && (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                        >
                          Télécharger (PDF)
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Section FAQ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ❓ Questions fréquentes
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Comment puis-je changer mon moyen de paiement ?</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Cliquez sur "Gérer mon abonnement" pour accéder au portail Stripe où vous pourrez mettre à jour vos informations de paiement.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Puis-je passer du plan mensuel au plan annuel ?</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Oui, contactez notre support pour effectuer ce changement. Vous serez remboursé au prorata du temps restant.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Comment obtenir une facture avec mon numéro de TVA ?</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Ajoutez votre numéro de TVA dans les paramètres de votre compte Stripe via le portail client.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de confirmation d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Annuler l'abonnement ?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Vous allez perdre l'accès aux fonctionnalités Pro à la fin de la période en cours.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700 dark:text-red-400">
                • Plus de générations illimitées
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                • Retour au plan gratuit (5min/mois)
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                • Vos données restent accessibles
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Garder mon abonnement
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isCancelling ? 'Annulation...' : 'Oui, annuler'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}