'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GenerationDetail } from '@/components/dashboard/generation-detail'
import { SkeletonCard } from '@/components/ui/skeleton'

export default function GenerationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [generation, setGeneration] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    fetchGeneration()
  }, [id])

  const fetchGeneration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/generation/status/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/dashboard/history')
          return
        }
        throw new Error('Failed to fetch generation')
      }
      const data = await response.json()
      setGeneration(data)
    } catch (error) {
      console.error('Failed to fetch generation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  const handleRegenerate = async () => {
    if (!generation) return
    
    const queryParams = new URLSearchParams({
      topic: generation.topic,
      niche: generation.niche,
      language: generation.language,
      duration: generation.duration.toString(),
    })
    router.push(`/dashboard/generate?${queryParams.toString()}`)
  }

  const handleClose = () => {
    router.push('/dashboard/history')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 transition mb-4 inline-flex items-center gap-2"
            >
              ← Retour
            </button>
          </div>
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (!generation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 transition mb-4 inline-flex items-center gap-2"
            >
              ← Retour
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Génération non trouvée
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Cette génération n'existe pas ou a été supprimée.
            </p>
            <button
              onClick={() => router.push('/dashboard/history')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Voir l'historique
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'historique
          </button>
        </div>

        <GenerationDetail
          generationId={id}
          onClose={handleClose}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-center gap-3"
        >
          <button
            onClick={() => router.push('/dashboard/generate')}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            ✨ Nouvelle génération
          </button>
          <button
            onClick={() => router.push('/dashboard/history')}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            📜 Voir l'historique
          </button>
        </motion.div>
      </div>
    </div>
  )
}