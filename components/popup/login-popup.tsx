// AURA & LOGOS - Popup de connexion
// Apparaît après saisie du sujet ou à l'action d'upsell

'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
  mode?: 'login' | 'upsell'
  upsellMessage?: string
  upsellReason?: 'quota' | 'duration' | 'feature'
  remainingMinutes?: number
}

export function LoginPopup({
  isOpen,
  onClose,
  onLoginSuccess,
  mode = 'login',
  upsellMessage,
  upsellReason = 'quota',
  remainingMinutes = 0,
}: LoginPopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)

  // Fermer avec Echap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Empêcher le scroll quand le popup est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
      onLoginSuccess?.()
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn('email', { email, callbackUrl: '/dashboard' })
      onLoginSuccess?.()
    } catch (error) {
      console.error('Email login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Messages d'upsell selon le type
  const getUpsellTitle = () => {
    switch (upsellReason) {
      case 'quota':
        return '💎 Minutes gratuites épuisées'
      case 'duration':
        return '⏱️ Limite de durée atteinte'
      case 'feature':
        return '✨ Fonctionnalité exclusive'
      default:
        return '🚀 Passez à la vitesse supérieure'
    }
  }

  const getUpsellDescription = () => {
    if (upsellMessage) return upsellMessage
    
    switch (upsellReason) {
      case 'quota':
        return `Vous avez utilisé vos 5 minutes gratuites. Passez au plan Pro pour bénéficier de 20 heures de génération par mois.`
      case 'duration':
        return `Le plan gratuit limite les vidéos à 5 minutes. Passez au plan Pro pour générer des vidéos jusqu'à 60 minutes.`
      case 'feature':
        return `Cette fonctionnalité est réservée aux abonnés Pro. Débloquez tout le potentiel d'AURA & LOGOS.`
      default:
        return `Créez du contenu illimité, sans filigrane, avec voix HD et images incluses.`
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* En-tête avec gradient */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {mode === 'upsell' ? getUpsellTitle() : '🔐 Connexion requise'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {mode === 'upsell' ? (
                  // Mode upsell (plan Pro)
                  <>
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-3">🌟</div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {getUpsellDescription()}
                      </p>
                      {remainingMinutes > 0 && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                          Il vous reste {remainingMinutes} minute{remainingMinutes > 1 ? 's' : ''} gratuite{remainingMinutes > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
                      >
                        Passer à Pro (49€/mois)
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full py-2 text-gray-500 hover:text-gray-700 transition text-sm"
                      >
                        Continuer avec le plan gratuit
                      </button>
                    </div>
                  </>
                ) : (
                  // Mode login
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl">🎬</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Connectez-vous pour générer votre contenu
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Gratuit • 5 minutes offertes • Sans engagement
                      </p>
                    </div>

                    {/* Bouton Google */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {isLoading ? 'Connexion...' : 'Continuer avec Google'}
                    </button>

                    {/* Séparateur */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-400">
                          ou
                        </span>
                      </div>
                    </div>

                    {/* Bouton email */}
                    {!showEmailForm ? (
                      <button
                        onClick={() => setShowEmailForm(true)}
                        className="w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        📧 Connexion par email
                      </button>
                    ) : (
                      <form onSubmit={handleEmailLogin} className="space-y-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                          {isLoading ? 'Envoi...' : 'Envoyer le lien magique'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEmailForm(false)}
                          className="w-full py-1 text-sm text-gray-400 hover:text-gray-500 transition"
                        >
                          ← Retour
                        </button>
                      </form>
                    )}

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-4">
                      En continuant, vous acceptez nos{' '}
                      <a href="/legal/terms" className="text-indigo-500 hover:underline">CGU</a>
                      {' '}et{' '}
                      <a href="/legal/privacy" className="text-indigo-500 hover:underline">politique de confidentialité</a>
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook personnalisé pour gérer le popup
export function useLoginPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [popupMode, setPopupMode] = useState<'login' | 'upsell'>('login')
  const [upsellData, setUpsellData] = useState<{
    message?: string
    reason?: 'quota' | 'duration' | 'feature'
    remainingMinutes?: number
  }>({})

  const showLogin = () => {
    setPopupMode('login')
    setIsOpen(true)
  }

  const showUpsell = (reason: 'quota' | 'duration' | 'feature', message?: string, remainingMinutes?: number) => {
    setPopupMode('upsell')
    setUpsellData({ message, reason, remainingMinutes })
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    mode: popupMode,
    upsellMessage: upsellData.message,
    upsellReason: upsellData.reason,
    remainingMinutes: upsellData.remainingMinutes,
    showLogin,
    showUpsell,
    close,
  }
}

export default LoginPopup