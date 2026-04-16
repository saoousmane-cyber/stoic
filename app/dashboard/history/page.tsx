'use client'

// AURA & LOGOS - Historique des générations
// /dashboard/history

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GenerationHistory, Generation } from '@/components/dashboard/generation-history'
import { SkeletonCard } from '@/components/ui/skeleton'

export default function HistoryPage() {
  const router = useRouter()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    try {
      const response = await fetch('/api/user/history')
      const data = await response.json()
      setGenerations(data.generations || [])
    } catch (error) {
      console.error('Failed to fetch generations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette génération ?')) return
    
    try {
      await fetch(`/api/user/generations/${id}`, { method: 'DELETE' })
      setGenerations(generations.filter(g => g.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/generation/download/${id}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generation-${id}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download:', error)
    }
  }

  const handleRegenerate = (id: string) => {
    const generation = generations.find(g => g.id === id)
    if (generation) {
      router.push(`/dashboard/generate?topic=${encodeURIComponent(generation.topic)}&niche=${generation.niche}`)
    }
  }

  const filteredGenerations = generations.filter(gen => {
    if (filter === 'all') return true
    return gen.status === filter
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📜 Historique</h1>
          <p className="text-gray-500 dark:text-gray-400">Toutes vos créations</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📜 Historique</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {generations.length} génération{generations.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {(['all', 'completed', 'processing', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            {f === 'all' && 'Toutes'}
            {f === 'completed' && '✅ Terminées'}
            {f === 'processing' && '⏳ En cours'}
            {f === 'failed' && '❌ Échouées'}
          </button>
        ))}
      </div>

      {/* Liste des générations */}
      {filteredGenerations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center"
        >
          <div className="text-5xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Aucune génération
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Vous n'avez pas encore créé de contenu.
          </p>
          <button
            onClick={() => router.push('/dashboard/generate')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
          >
            ✨ Créer mon premier contenu
          </button>
        </motion.div>
      ) : (
        <GenerationHistory
          generations={filteredGenerations}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  )
}