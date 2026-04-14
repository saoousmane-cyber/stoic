'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre dashboard. L'annulation prendra effet à la fin de la période en cours. Aucun remboursement partiel ne sera effectué pour la période restante.",
  },
  {
    question: "Comment fonctionne l'essai gratuit de 2h ?",
    answer: "Après votre premier paiement, vous recevez immédiatement 2h de création offertes (120 minutes) valables 7 jours. Pendant cette période, vous pouvez tester toutes les fonctionnalités Pro. Votre abonnement débutera automatiquement lorsque vous aurez utilisé vos 2h ou après 7 jours.",
  },
  {
    question: "Que se passe-t-il si je dépasse mes minutes ?",
    answer: "Si vous dépassez votre quota mensuel (5min pour le plan gratuit, 20h pour le plan Pro), vous ne pourrez plus générer de nouveau contenu jusqu'au mois suivant. Vous pouvez à tout moment passer au plan supérieur pour augmenter votre quota.",
  },
  {
    question: "Les vidéos générées sont-elles libres de droits ?",
    answer: "Oui, vous êtes propriétaire du contenu que vous générez avec AURA & LOGOS. Vous pouvez l'utiliser sur YouTube, TikTok, Instagram et toutes autres plateformes. Seules les images et musiques fournies par Pixabay/Pexels ont leurs propres licences (gratuites pour un usage commercial).",
  },
  {
    question: "Quelles langues sont supportées ?",
    answer: "AURA & LOGOS supporte actuellement 6 langues : Français, Anglais, Espagnol, Allemand, Italien et Portugais. La voix off est générée en haute qualité pour chaque langue.",
  },
  {
    question: "Puis-je utiliser mes propres images ?",
    answer: "Oui, vous pouvez importer vos propres images pour les utiliser dans vos vidéos. La bibliothèque d'images intégrée vous permet également de rechercher et télécharger des images libres de droits depuis Pixabay et Pexels.",
  },
  {
    question: "Comment fonctionne la facturation ?",
    answer: "L'abonnement est prélevé mensuellement ou annuellement selon votre choix. Vous pouvez gérer votre abonnement, modifier votre moyen de paiement et consulter vos factures depuis votre dashboard ou via le portail client Stripe.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer: "Non, il n'y a pas d'engagement. Vous pouvez annuler votre abonnement à tout moment. Pour le plan annuel, vous bénéficiez d'une réduction de 20% mais l'engagement est sur l'année.",
  },
  {
    question: "Que faire en cas de problème technique ?",
    answer: "Notre équipe support est disponible 7j/7 par email à support@auraandlogos.com. Les utilisateurs du plan Pro bénéficient d'un support prioritaire avec réponse sous 24h.",
  },
  {
    question: "Puis-je passer du plan gratuit au plan Pro ?",
    answer: "Oui, vous pouvez passer au plan Pro à tout moment depuis la page Tarifs ou depuis votre dashboard. Votre quota sera immédiatement mis à jour.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-5 text-left"
          >
            <span className="font-semibold text-gray-900 dark:text-white">
              {faq.question}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
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
                transition={{ duration: 0.2 }}
              >
                <div className="px-5 pb-5">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}