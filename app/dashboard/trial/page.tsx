// AURA & LOGOS - Page de gestion de l'essai prépayé
// /dashboard/trial

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TrialStatusCard } from '@/p3_frontend_landing/components/trial/trial-status-card'
import { TrialTimer } from '@/p3_frontend_landing/components/trial/trial-timer'
import { TrialUsageChart } from '@/p3_frontend_landing/components/trial/trial-usage-chart'
import { RefundModal } from '@/p3_frontend_landing/components/trial/refund-modal'
import { TrialFAQ } from '@/p3_frontend_landing/components/trial/trial-faq'
import { usePrepaidTrial } from '@/hooks/use-prepaid-trial'

export default function TrialManagementPage() {
  const router = useRouter()
  const { trial, isLoading, refetch } = usePrepaidTrial()
  const [showRefundModal, setShowRefundModal] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!trial?.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Aucun essai actif
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Vous n'avez pas de période d'essai en cours.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Découvrir les offres
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion de mon essai
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Suivez votre période d'essai de 7 jours avec 2h de création offertes
          </p>
        </div>

        {/* Timer de compte à rebours */}
        <div className="mb-6">
          <TrialTimer
            endsAt={trial.endsAt}
            onExpire={() => refetch()}
          />
        </div>

        {/* Grille principale */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Carte de statut */}
          <TrialStatusCard
            remainingMinutes={trial.remainingMinutes}
            remainingDays={trial.remainingDays}
            totalMinutes={120}
            onRefund={() => setShowRefundModal(true)}
          />

          {/* Graphique d'utilisation */}
          <TrialUsageChart
            usedMinutes={120 - trial.remainingMinutes}
            totalMinutes={120}
          />
        </div>

        {/* FAQ */}
        <div className="mb-6">
          <TrialFAQ />
        </div>

        {/* Message d'information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex gap-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Comment fonctionne l'essai ?</p>
              <ul className="space-y-1 text-xs">
                <li>• Vous avez 7 jours pour tester avec 2 heures de création</li>
                <li>• Votre abonnement débutera automatiquement après l'essai</li>
                <li>• Vous pouvez annuler et être remboursé à tout moment pendant l'essai</li>
                <li>• Aucun prélevement supplémentaire ne sera effectué pendant l'essai</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Modal de remboursement */}
        <RefundModal
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          onRefundSuccess={() => {
            setShowRefundModal(false)
            router.push('/')
          }}
          remainingDays={trial.remainingDays}
        />
      </div>
    </div>
  )
}