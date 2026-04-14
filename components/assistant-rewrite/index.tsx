// AURA & LOGOS - Assistant de réécriture IA
// Permet de reformuler, améliorer ou raccourcir un script

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AssistantRewriteProps {
  initialText?: string
  onRewrite?: (newText: string) => void
  language?: string
  isPro?: boolean
}

type RewriteAction = 'improve' | 'shorten' | 'lengthen' | 'simplify' | 'formal' | 'casual'

const actionLabels: Record<RewriteAction, { label: string; icon: string; description: string }> = {
  improve: { label: 'Améliorer', icon: '✨', description: 'Améliore la qualité d\'écriture' },
  shorten: { label: 'Raccourcir', icon: '📏', description: 'Rend le texte plus concis' },
  lengthen: { label: 'Développer', icon: '📖', description: 'Ajoute des détails et exemples' },
  simplify: { label: 'Simplifier', icon: '🎯', description: 'Rend le texte plus accessible' },
  formal: { label: 'Formaliser', icon: '🎩', description: 'Ton plus professionnel' },
  casual: { label: 'Décontracter', icon: '😊', description: 'Ton plus conversationnel' },
}

export function AssistantRewrite({
  initialText = '',
  onRewrite,
  language = 'fr',
  isPro = false,
}: AssistantRewriteProps) {
  const [text, setText] = useState(initialText)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<RewriteAction | null>(null)
  const [showProModal, setShowProModal] = useState(false)

  const handleRewrite = async (action: RewriteAction) => {
    if (!isPro) {
      setShowProModal(true)
      return
    }

    if (!text.trim()) return

    setIsLoading(true)
    setSelectedAction(action)

    try {
      // Appel API de réécriture
      const response = await fetch('/api/assistant/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          action,
          language,
        }),
      })

      if (!response.ok) throw new Error('Erreur de réécriture')

      const data = await response.json()
      const newText = data.rewrittenText

      setText(newText)
      onRewrite?.(newText)
    } catch (error) {
      console.error('Rewrite error:', error)
      // Simulation pour la démo
      const demoRewrites: Record<RewriteAction, string> = {
        improve: `Version améliorée : ${text.substring(0, 100)}... (plus fluide et engageant)`,
        shorten: `Version courte : ${text.substring(0, 50)}...`,
        lengthen: `${text} Pour aller plus loin, il est essentiel de comprendre que...`,
        simplify: `Version simple : ${text.replace(/complexe|sophistiqué|élaboré/g, 'simple')}`,
        formal: `Version formelle : ${text.replace(/tu/g, 'vous').replace(/t'es/g, 'vous êtes')}`,
        casual: `Version décontractée : ${text.replace(/vous/g, 'tu').replace(/nous/g, 'on')}`,
      }
      
      setTimeout(() => {
        setText(demoRewrites[action])
        onRewrite?.(demoRewrites[action])
        setIsLoading(false)
      }, 1000)
      return
    }

    setIsLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Assistant de réécriture IA
          </h3>
          {!isPro && (
            <span className="ml-auto text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">
              Pro uniquement
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Améliorez, raccourcissez ou adaptez le ton de votre script
        </p>
      </div>

      {/* Zone de texte */}
      <div className="p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez votre script ici..."
          className="w-full h-48 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Boutons d'action */}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.entries(actionLabels) as [RewriteAction, typeof actionLabels[RewriteAction]][]).map(([action, { label, icon, description }]) => (
            <button
              key={action}
              onClick={() => handleRewrite(action)}
              disabled={isLoading || !text.trim()}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title={description}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Indicateur de chargement */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Réécriture en cours...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Pro */}
      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <span className="text-5xl block mb-3">✨</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Fonctionnalité Pro
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  L'assistant de réécriture est disponible uniquement pour les abonnés Pro.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Passer à Pro (49€/mois)
              </button>
              <button
                onClick={() => setShowProModal(false)}
                className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 transition"
              >
                Plus tard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AssistantRewrite