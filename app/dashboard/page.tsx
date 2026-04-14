// AURA & LOGOS - Dashboard utilisateur avec section bonus

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BonusBanner } from '@/components/bonus/bonus-banner'
import { BonusSection } from '@/components/dashboard/bonus-section'
import { GenerationForm } from '@/components/dashboard/generation-form'
import { QuotaDisplay } from '@/components/dashboard/quota-display'
import { GenerationHistory } from '@/components/dashboard/generation-history'
import { useQuota } from '@/hooks/use-quota'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { quota } = useQuota()
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Bannière bonus (visible uniquement si bonus actif) */}
        <div className="mb-6">
          <BonusBanner />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Onglets */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === 'generate'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ✨ Nouvelle génération
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === 'history'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📜 Historique
              </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'generate' ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <GenerationForm />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <GenerationHistory generations={[]} />
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Quota */}
            {quota && (
              <QuotaDisplay
                used={quota.used}
                limit={quota.limit}
                plan={quota.plan}
                onUpgrade={() => router.push('/pricing')}
              />
            )}

            {/* Section Bonus (carte détaillée) */}
            <BonusSection />

            {/* Stats supplémentaires */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                💡 Astuce du jour
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Utilisez vos minutes offertes en priorité ! Elles expirent dans 30 jours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}