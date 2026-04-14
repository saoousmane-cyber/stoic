'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Comment fonctionne la période d'essai ?",
    answer: "Vous avez 7 jours pour tester l'outil avec 2 heures de création offertes. Votre abonnement débutera automatiquement après cette période. Aucun prélèvement supplémentaire ne sera effectué pendant l'essai.",
  },
  {
    question: "Puis-je être remboursé ?",
    answer: "Oui, vous pouvez annuler et être remboursé intégralement à tout moment pendant les 7 jours d'essai, même si vous avez utilisé toutes vos 2 heures.",
  },
  {
    question: "Que se passe-t-il après l'essai ?",
    answer: "Votre abonnement Pro (49€/mois) débutera automatiquement. Vous serez prélevé à la fin des 7 jours. Vous pouvez annuler à tout moment depuis votre dashboard.",
  },
  {
    question: "Puis-je utiliser plus de 2 heures pendant l'essai ?",
    answer: "Non, l'essai est limité à 2 heures de création. Si vous épuisez ces 2 heures avant la fin des 7 jours, vous devrez attendre la fin de l'essai ou passer à l'abonnement.",
  },
  {
    question: "Comment annuler mon essai ?",
    answer: "Rendez-vous dans la page 'Gestion de l'essai' de votre dashboard et cliquez sur 'Annuler et être remboursé'. Le remboursement sera traité immédiatement.",
  },
  {
    question: "Mes créations seront-elles conservées après annulation ?",
    answer: "Oui, vous pourrez télécharger toutes vos créations avant l'annulation. Après annulation, vous perdrez l'accès au dashboard.",
  },
]

export function TrialFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl">❓</span>
        Questions fréquentes
      </h3>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}