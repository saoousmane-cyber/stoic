// AURA & LOGOS - Page de vérification d'email
// /auth/verify

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function VerifyPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Récupérer l'email depuis le localStorage ou URL
    const storedEmail = localStorage.getItem('verification_email')
    if (storedEmail) {
      setEmail(storedEmail)
    }

    // Compte à rebours avant redirection
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleResendEmail = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      if (response.ok) {
        alert('Un nouvel email de vérification a été envoyé.')
      }
    } catch (error) {
      console.error('Resend error:', error)
    }
  }

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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Vérifiez votre email</h1>
          </div>

          {/* Contenu */}
          <div className="p-6 text-center">
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                Un email de vérification a été envoyé à
              </p>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {email || 'votre adresse email'}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                📧 Cliquez sur le lien dans l'email pour activer votre compte.
                Si vous ne recevez pas l'email, vérifiez vos spams.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                className="w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
              >
                Renvoyer l'email de vérification
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-2 text-gray-500 hover:text-gray-700 transition text-sm"
              >
                Retour à l'accueil ({countdown})
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 text-center">
            <p className="text-xs text-gray-400">
              Une fois votre compte vérifié, vous pourrez accéder à toutes les fonctionnalités.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}