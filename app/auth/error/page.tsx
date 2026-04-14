// AURA & LOGOS - Page d'erreur d'authentification
// /auth/error

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('Une erreur est survenue lors de l\'authentification.')

  useEffect(() => {
    const error = searchParams.get('error')
    
    const errorMessages: Record<string, string> = {
      OAuthSignin: 'Erreur lors de la connexion avec Google. Veuillez réessayer.',
      OAuthCallback: 'Erreur lors de la validation Google. Veuillez réessayer.',
      OAuthCreateAccount: 'Impossible de créer votre compte. Veuillez réessayer.',
      EmailCreateAccount: 'Impossible de créer votre compte avec cet email.',
      Callback: 'Erreur lors de la validation de la connexion.',
      OAuthAccountNotLinked: 'Cet email est déjà utilisé avec une autre méthode de connexion.',
      EmailSignin: 'Erreur lors de l\'envoi de l\'email de connexion.',
      CredentialsSignin: 'Identifiants invalides.',
      SessionRequired: 'Vous devez être connecté pour accéder à cette page.',
      Default: 'Une erreur est survenue. Veuillez réessayer.',
    }

    setErrorMessage(errorMessages[error || 'Default'] || errorMessages.Default)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Erreur d'authentification</h1>
          </div>

          {/* Contenu */}
          <div className="p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {errorMessage}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/api/auth/signin')}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Réessayer de se connecter
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-2 text-gray-500 hover:text-gray-700 transition text-sm"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 text-center">
            <p className="text-xs text-gray-400">
              Si l'erreur persiste, contactez notre support :{' '}
              <a href="mailto:support@auraandlogos.com" className="text-indigo-600 hover:underline">
                support@auraandlogos.com
              </a>
            </p>
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Conseils :</p>
          <ul className="mt-1 space-y-1">
            <li>• Vérifiez votre connexion internet</li>
            <li>• Assurez-vous d'avoir accepté les autorisations Google</li>
            <li>• Essayez de vider le cache de votre navigateur</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}