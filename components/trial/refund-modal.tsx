'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  onRefundSuccess: () => void
  remainingDays: number
}

export function RefundModal({ isOpen, onClose, onRefundSuccess, remainingDays }: RefundModalProps) {
  const [step, setStep] = useState<'confirm' | 'reason' | 'processing' | 'success'>('confirm')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRefund = async () => {
    setStep('processing')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/trial/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()

      if (data.success) {
        setStep('success')
        setTimeout(() => {
          onRefundSuccess()
        }, 2000)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      alert('Erreur lors du remboursement. Veuillez contacter le support.')
      setStep('confirm')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {step === 'confirm' && (
                <>
                  <div className="p-6 text-center">
                    <div className="text-5xl mb-3">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Annuler l'essai ?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Vous allez annuler votre période d'essai et être remboursé intégralement.
                    </p>
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        🔄 Remboursement de 49€
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        {remainingDays} jour{remainingDays > 1 ? 's' : ''} restant{remainingDays > 1 ? 's' : ''} dans l'essai
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
                    >
                      Continuer l'essai
                    </button>
                    <button
                      onClick={() => setStep('reason')}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </>
              )}

              {step === 'reason' && (
                <>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Pourquoi annulez-vous ?
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Votre avis nous aide à nous améliorer
                    </p>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Par exemple : trop cher, fonctionnalités manquantes, etc."
                      className="w-full h-28 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="p-6 pt-0 flex gap-3">
                    <button
                      onClick={() => setStep('confirm')}
                      className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleRefund}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Confirmer l'annulation
                    </button>
                  </div>
                </>
              )}

              {step === 'processing' && (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Traitement en cours...
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Nous traitons votre demande de remboursement
                  </p>
                </div>
              )}

              {step === 'success' && (
                <div className="p-8 text-center">
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Remboursement effectué !
                  </h3>
                  <p className="text-gray-500">
                    Votre paiement de 49€ a été remboursé. Les fonds seront disponibles sous 5-10 jours.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}