'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Generation } from './generation-history'

interface GenerationCardProps {
  generation: Generation
  onDelete?: (id: string) => void
  onDownload?: (id: string) => void
  onRegenerate?: (id: string) => void
}

const nicheIcons: Record<string, string> = {
  stoicism: '🏛️',
  meditation: '🧘',
  history: '📜',
  philosophy: '💭',
  psychology: '🧠',
  spirituality: '✨',
  'self-improvement': '📈',
  mythology: '⚡',
}

const statusConfig: Record<Generation['status'], { label: string; color: string; icon: string }> = {
  pending: { label: 'En attente', color: 'bg-gray-500', icon: '⏳' },
  processing: { label: 'En cours', color: 'bg-indigo-500', icon: '🔄' },
  completed: { label: 'Terminé', color: 'bg-green-500', icon: '✅' },
  failed: { label: 'Échoué', color: 'bg-red-500', icon: '❌' },
}

export function GenerationCard({ generation, onDelete, onDownload, onRegenerate }: GenerationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const status = statusConfig[generation.status]
  const date = new Date(generation.createdAt)
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Info principale */}
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl">{nicheIcons[generation.niche] || '📹'}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                {generation.topic}
              </h4>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-xs text-gray-500">{formattedDate}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{generation.duration} min</span>
                <span className="text-xs text-gray-500">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{status.icon}</span>
                  <span className={`text-xs ${generation.status === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {generation.status === 'completed' && onDownload && (
              <button
                onClick={() => onDownload(generation.id)}
                className="p-2 text-gray-400 hover:text-indigo-600 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Télécharger"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            {generation.status === 'failed' && onRegenerate && (
              <button
                onClick={() => onRegenerate(generation.id)}
                className="p-2 text-gray-400 hover:text-amber-600 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Regénérer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(generation.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Supprimer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Détails étendus */}
        {isExpanded && generation.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex gap-3">
              {generation.thumbnail && (
                <img
                  src={generation.thumbnail}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <Link
                  href={`/dashboard/generation/${generation.id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Voir les détails →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}