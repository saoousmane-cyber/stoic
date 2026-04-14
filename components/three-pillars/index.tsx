// AURA & LOGOS - Composant 3 Piliers
// Section des avantages clés

'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Pillar {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

interface ThreePillarsProps {
  pillars?: Pillar[]
  title?: string
  subtitle?: string
}

const defaultPillars: Pillar[] = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Génération automatique",
    description: "Scripts optimisés SEO, voix off naturelle, sous-titres synchronisés et images d'ambiance",
    color: "indigo",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Gain de temps",
    description: "Plusieurs heures de montage réduites à quelques minutes. Publiez plus, travaillez moins.",
    color: "purple",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Qualité professionnelle",
    description: "Voix HD, ducking audio, sous-titres précis, et contenu adapté à chaque niche.",
    color: "pink",
  },
]

const colorClasses: Record<string, { bg: string; text: string; hover: string; ring: string }> = {
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/50',
    text: 'text-indigo-600',
    hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-800',
    ring: 'ring-indigo-500',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-200 dark:hover:bg-purple-800',
    ring: 'ring-purple-500',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/50',
    text: 'text-pink-600',
    hover: 'hover:bg-pink-200 dark:hover:bg-pink-800',
    ring: 'ring-pink-500',
  },
}

export function ThreePillars({
  pillars = defaultPillars,
  title = "Pourquoi les créateurs nous choisissent",
  subtitle = "Une solution complète pour automatiser votre création de contenu",
}: ThreePillarsProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Piliers */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {pillars.map((pillar, index) => {
            const colors = colorClasses[pillar.color] || colorClasses.indigo

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icône */}
                <div
                  className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110`}
                >
                  <div className={`w-8 h-8 ${colors.text}`}>{pillar.icon}</div>
                </div>

                {/* Titre */}
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400">
                  {pillar.description}
                </p>

                {/* Lien d'apprentissage (optionnel) */}
                <button className={`mt-4 text-sm ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  En savoir plus →
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default ThreePillars