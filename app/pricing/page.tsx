// AURA & LOGOS - Page des tarifs
// /pricing

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PricingTable } from '@/components/pricing/pricing-table'
import { TrialOfferCard } from '@/components/pricing/trial-offer-card'
import { FaqSection } from '@/components/pricing/faq-section'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Des tarifs <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">transparents</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Choisissez le plan qui correspond à vos besoins. Évoluez sans limite.
          </motion.p>
        </div>
      </section>

      {/* Offre d'essai */}
      <section className="container mx-auto px-4 mb-12 max-w-4xl">
        <TrialOfferCard onTrialStarted={handleUpgrade} />
      </section>

      {/* Tableau des prix */}
      <section className="container mx-auto px-4 py-8">
        <PricingTable />
      </section>

      {/* Comparaison des fonctionnalités */}
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Comparaison détaillée
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left p-4 font-semibold">Fonctionnalité</th>
                  <th className="text-center p-4 font-semibold w-32">Gratuit</th>
                  <th className="text-center p-4 font-semibold w-32 bg-indigo-50 dark:bg-indigo-950/30">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="p-4">Minutes par mois</td>
                  <td className="text-center p-4">5 min</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30 font-medium">20h (1200 min)</td>
                </tr>
                <tr>
                  <td className="p-4">Durée max par vidéo</td>
                  <td className="text-center p-4">5 min</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">60 min</td>
                </tr>
                <tr>
                  <td className="p-4">Niches disponibles</td>
                  <td className="text-center p-4">8</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">8</td>
                </tr>
                <tr>
                  <td className="p-4">Langues supportées</td>
                  <td className="text-center p-4">6</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">6</td>
                </tr>
                <tr>
                  <td className="p-4">Qualité voix</td>
                  <td className="text-center p-4">Standard</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">HD</td>
                </tr>
                <tr>
                  <td className="p-4">Filigrane audio</td>
                  <td className="text-center p-4">✅ Présent</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">❌ Supprimé</td>
                </tr>
                <tr>
                  <td className="p-4">Ducking audio</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">✅</td>
                </tr>
                <tr>
                  <td className="p-4">Pack images</td>
                  <td className="text-center p-4">3 images</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">20 images</td>
                </tr>
                <tr>
                  <td className="p-4">Assistant réécriture IA</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">✅</td>
                </tr>
                <tr>
                  <td className="p-4">Formats d'export</td>
                  <td className="text-center p-4">MP3 + SRT</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">MP3 + SRT + VTT + JSON</td>
                </tr>
                <tr>
                  <td className="p-4">Support prioritaire</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Questions fréquentes
        </h2>
        <FaqSection />
      </section>
    </main>
  )
}
