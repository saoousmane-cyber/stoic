'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GenerationCard } from './generation-card'

export interface Generation {
  id: string
  topic: string
  niche: string
  duration: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  downloadUrl?: string
  thumbnail?: string
}

interface GenerationHistoryProps {
  generations: Generation[]
  onDelete?: (id: string) => void
  onDownload?: (id: string) => void
  onRegenerate?: (id: string) => void
}

export function GenerationHistory({ generations, onDelete, onDownload, onRegenerate }: GenerationHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')

  const filteredGenerations = generations.filter((gen) => {
    if (filter === 'all') return true
    return gen.status === filter
  })

  if (generations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-3">📭</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Aucune génération
        </h3>
        <p className="text-sm text-gray-500">
          Votre première création vous attend. Lancez-vous !
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
      <AnimatePresence>
        <div className="space-y-3">
          {filteredGenerations.map((gen, index) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <GenerationCard
                generation={gen}
                onDelete={onDelete}
                onDownload={onDownload}
                onRegenerate={onRegenerate}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}