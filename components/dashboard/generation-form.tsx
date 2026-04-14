'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGeneration } from '@/hooks/use-generation'
import { useQuota } from '@/hooks/use-quota'
import { useToast } from '@/hooks/use-toast'
import { LoginPopup, useLoginPopup } from '@/components/popup/login-popup'

interface GenerationFormProps {
  onSuccess?: (generationId: string) => void
}

const niches = [
  { value: 'stoicism', label: '🏛️ Stoïcisme' },
  { value: 'meditation', label: '🧘 Méditation' },
  { value: 'history', label: '📜 Histoire' },
  { value: 'philosophy', label: '💭 Philosophie' },
  { value: 'psychology', label: '🧠 Psychologie' },
  { value: 'spirituality', label: '✨ Spiritualité' },
  { value: 'self-improvement', label: '📈 Développement personnel' },
  { value: 'mythology', label: '⚡ Mythologie' },
]

const languages = [
  { value: 'fr', label: 'Français 🇫🇷' },
  { value: 'en', label: 'English 🇬🇧' },
  { value: 'es', label: 'Español 🇪🇸' },
  { value: 'de', label: 'Deutsch 🇩🇪' },
  { value: 'it', label: 'Italiano 🇮🇹' },
  { value: 'pt', label: 'Português 🇵🇹' },
]

export function GenerationForm({ onSuccess }: GenerationFormProps) {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('stoicism')
  const [language, setLanguage] = useState('fr')
  const [duration, setDuration] = useState(5)
  const [includeSoundEffects, setIncludeSoundEffects] = useState(true)
  const [soundEffectIntensity, setSoundEffectIntensity] = useState<'light' | 'moderate' | 'rich'>('moderate')

  const { generate, isGenerating, progress, error: generationError } = useGeneration()
  const { quota, checkCanGenerate } = useQuota()
  const { toast } = useToast()
  const { isOpen: isPopupOpen, mode: popupMode, showLogin, showUpsell, close: closePopup } = useLoginPopup()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Vérifier si l'utilisateur est connecté (sera géré par le middleware)
    
    // Vérifier le quota
    if (quota) {
      const canGen = await checkCanGenerate(duration)
      if (!canGen.allowed) {
        showUpsell('quota', canGen.message, canGen.remaining)
        return
      }
    }

    const result = await generate({
      topic,
      niche,
      language,
      duration,
    })

    if (result.success) {
      toast({
        title: '✨ Génération terminée',
        description: 'Votre contenu est prêt à être téléchargé.',
      })
      if (result.generationId && onSuccess) {
        onSuccess(result.generationId)
      }
    } else {
      toast({
        title: '❌ Erreur',
        description: result.error || 'Une erreur est survenue',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sujet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sujet de la vidéo
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Les 4 vertus stoïciennes expliquées simplement"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Soyez précis pour un meilleur résultat
          </p>
        </div>

        {/* Grille niche + langue */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Niche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niche
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            >
              {niches.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>

          {/* Langue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Langue
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Durée */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Durée
            </label>
            <span className="text-sm font-semibold text-indigo-600">{duration} minutes</span>
          </div>
          <input
            type="range"
            min={1}
            max={quota?.plan === 'pro' ? 60 : 5}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 min</span>
            <span>20 min</span>
            <span>40 min</span>
            <span>{quota?.plan === 'pro' ? '60 min' : '5 min max (gratuit)'}</span>
          </div>
        </div>

        {/* Effets sonores */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎵</span>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Effets sonores d'ambiance
              </label>
            </div>
            <button
              type="button"
              onClick={() => setIncludeSoundEffects(!includeSoundEffects)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                includeSoundEffects ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  includeSoundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <AnimatePresence>
            {includeSoundEffects && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-gray-500">
                  Ajoute des effets sonores contextuels tout au long de l'audio (vents, feu, méditation, etc.)
                </p>
                <div className="flex gap-2">
                  {(['light', 'moderate', 'rich'] as const).map((intensity) => (
                    <button
                      key={intensity}
                      type="button"
                      onClick={() => setSoundEffectIntensity(intensity)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        soundEffectIntensity === intensity
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {intensity === 'light' && '🌿 Léger'}
                      {intensity === 'moderate' && '🎵 Modéré'}
                      {intensity === 'rich' && '🎼 Riche'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>🔊 Aperçu:</span>
                  <button
                    type="button"
                    className="text-indigo-500 hover:underline"
                    onClick={() => {
                      const audio = new Audio('/sounds/preview-ambiance.mp3')
                      audio.play()
                    }}
                  >
                    Écouter un extrait
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message d'erreur */}
        {generationError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{generationError}</p>
          </div>
        )}

        {/* Bouton de génération */}
        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Génération en cours... {progress}%</span>
            </div>
          ) : (
            '✨ Générer mon contenu'
          )}
        </button>

        {/* Indice plan gratuit */}
        {quota?.plan === 'free' && (
          <p className="text-center text-xs text-gray-400">
            🎁 {quota.remaining} minutes gratuites restantes • Passez à Pro pour 20h/mois
          </p>
        )}
      </form>

      {/* Popup de connexion/upsell */}
      <LoginPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        mode={popupMode}
        upsellReason={popupMode === 'upsell' ? 'quota' : undefined}
        remainingMinutes={quota?.remaining}
      />
    </>
  )
}