'use client'

// /dashboard/generate
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GenerationForm } from '@/components/dashboard/generation-form'
import { BonusBanner } from '@/components/bonus/bonus-banner'
import { useQuota } from '@/hooks/use-quota'
import { useBonus } from '@/hooks/use-bonus'

export default function GeneratePage() {
  const router = useRouter()
  const { quota } = useQuota()
  const { hasBonus, remainingMinutes: bonusRemaining } = useBonus()
  const [generationId, setGenerationId] = useState<string | null>(null)

  const handleSuccess = (id: string) => {
    setGenerationId(id)
    setTimeout(() => {
      router.push(`/dashboard/generation/${id}`)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ✨ Nouvelle génération
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Créez du contenu unique en quelques minutes
        </p>
      </div>

      {hasBonus && <BonusBanner />}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <GenerationForm onSuccess={handleSuccess} />
          </div>
        </div>

        <div className="space-y-6">
          {quota && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>📊</span> Mon quota
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Utilisé ce mois</span>
                  <span className="font-medium">{quota.used} / {quota.limit} min</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    style={{ width: `${(quota.used / quota.limit) * 100}%` }}
                  />
                </div>
                {hasBonus && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600 dark:text-amber-400">🎁 Bonus</span>
                      <span className="font-medium text-amber-600">{bonusRemaining} min restantes</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>💡</span> Conseils
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">✓ Soyez précis dans votre sujet</li>
              <li className="flex items-start gap-2">✓ Choisissez la niche la plus adaptée</li>
              <li className="flex items-start gap-2">✓ Utilisez les effets sonores</li>
              <li className="flex items-start gap-2">✓ Testez différentes durées</li>
            </ul>
          </div>

          <button
            onClick={() => router.push('/dashboard/history')}
            className="w-full text-center py-2 text-sm text-indigo-600 hover:text-indigo-700 transition"
          >
            📜 Voir mes anciennes générations →
          </button>
        </div>
      </div>

      {generationId && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ✅ Génération terminée ! Redirection...
        </div>
      )}
    </div>
  )
}