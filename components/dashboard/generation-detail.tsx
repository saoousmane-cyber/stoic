'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export interface GenerationDetailProps {
  generationId: string
  onClose?: () => void
  onDownload?: (url: string) => void
  onRegenerate?: () => void
}

interface GenerationData {
  id: string
  topic: string
  niche: string
  language: string
  duration: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  completedAt?: string
  script?: string
  audioUrl?: string
  srtUrl?: string
  zipUrl?: string
  seoTitle?: string
  seoDescription?: string
  metadata?: {
    wordCount?: number
    audioDuration?: number
    imagesCount?: number
    estimatedCost?: number
    modelUsed?: string
  }
}

export function GenerationDetail({ generationId, onClose, onDownload, onRegenerate }: GenerationDetailProps) {
  const router = useRouter()
  const [generation, setGeneration] = useState<GenerationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'script' | 'seo'>('details')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchGeneration()
    
    // Rafraîchir toutes les 5 secondes si en cours
    const interval = setInterval(() => {
      if (generation?.status === 'processing' || generation?.status === 'pending') {
        fetchGeneration(true)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [generationId])

  const fetchGeneration = async (silent = false) => {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)
    
    try {
      const response = await fetch(`/api/generation/status/${generationId}`)
      const data = await response.json()
      setGeneration(data)
    } catch (error) {
      console.error('Failed to fetch generation:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleDownload = (url?: string, type?: string) => {
    if (url) {
      onDownload?.(url)
      window.open(url, '_blank')
    }
  }

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-gray-500', icon: '⏳' },
      processing: { label: 'En cours', color: 'bg-indigo-500', icon: '🔄' },
      completed: { label: 'Terminé', color: 'bg-green-500', icon: '✅' },
      failed: { label: 'Échoué', color: 'bg-red-500', icon: '❌' },
      cancelled: { label: 'Annulé', color: 'bg-gray-500', icon: '🚫' },
    }
    const config = statusConfig[generation?.status || 'pending']
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  if (!generation) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-3">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Génération non trouvée
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Cette génération n'existe pas ou a été supprimée.
        </p>
        <button
          onClick={() => router.push('/dashboard/history')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Voir l'historique
        </button>
      </div>
    )
  }

  const isCompleted = generation.status === 'completed'
  const isProcessing = generation.status === 'processing' || generation.status === 'pending'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      {/* En-tête */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge()}
              {isRefreshing && (
                <span className="text-xs text-gray-400 animate-pulse">Actualisation...</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {generation.topic}
            </h2>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              <span>🏷️ {generation.niche}</span>
              <span>🌐 {generation.language}</span>
              <span>⏱️ {generation.duration} min</span>
              <span>📅 {new Date(generation.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 px-6">
        {(['details', 'script', 'seo'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'details' && '📊 Détails'}
            {tab === 'script' && '📝 Script'}
            {tab === 'seo' && '🔍 SEO'}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {generation.metadata?.wordCount || '?'}
                  </div>
                  <div className="text-xs text-gray-500">mots</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {generation.metadata?.audioDuration 
                      ? Math.floor(generation.metadata.audioDuration / 60) 
                      : generation.duration} min
                  </div>
                  <div className="text-xs text-gray-500">audio</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {generation.metadata?.imagesCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">images</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {generation.metadata?.modelUsed === 'claude-3.5-sonnet' ? 'Claude 3.5' : 'GPT-4o mini'}
                  </div>
                  <div className="text-xs text-gray-500">modèle IA</div>
                </div>
              </div>

              {/* Actions */}
              {isCompleted && (
                <div className="flex flex-wrap gap-3 pt-4">
                  {generation.zipUrl && (
                    <button
                      onClick={() => handleDownload(generation.zipUrl, 'zip')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
                    >
                      📦 Télécharger le package ZIP
                    </button>
                  )}
                  {generation.audioUrl && (
                    <button
                      onClick={() => handleDownload(generation.audioUrl, 'mp3')}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      🎵 Télécharger l'audio (MP3)
                    </button>
                  )}
                  {generation.srtUrl && (
                    <button
                      onClick={() => handleDownload(generation.srtUrl, 'srt')}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      📝 Télécharger les sous-titres (SRT)
                    </button>
                  )}
                  <button
                    onClick={onRegenerate}
                    className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    🔄 Regénérer
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3" />
                  <p className="text-gray-500">Génération en cours...</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Cela peut prendre quelques minutes
                  </p>
                </div>
              )}

              {generation.status === 'failed' && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                  <p className="text-red-600 dark:text-red-400">
                    La génération a échoué. Veuillez réessayer.
                  </p>
                  <button
                    onClick={onRegenerate}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'script' && (
            <motion.div
              key="script"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {generation.script ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                    {generation.script}
                  </pre>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Script non disponible
                </p>
              )}
            </motion.div>
          )}

          {activeTab === 'seo' && (
            <motion.div
              key="seo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {generation.seoTitle && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre SEO
                  </h3>
                  <p className="text-gray-900 dark:text-white">{generation.seoTitle}</p>
                </div>
              )}
              {generation.seoDescription && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description SEO
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {generation.seoDescription}
                  </p>
                </div>
              )}
              {generation.metadata?.estimatedCost && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Coût estimé
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    ${generation.metadata.estimatedCost.toFixed(4)}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}