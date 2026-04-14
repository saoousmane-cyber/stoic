// AURA & LOGOS - 8 niches de contenu

export interface Niche {
  id: string
  name: string
  slug: string
  description: string
  defaultTone: string
  suggestedTopics: string[]
  icon: string
  backgroundColor: string
  textColor: string
}

export const NICHES: Niche[] = [
  {
    id: 'stoicism',
    name: 'Stoïcisme',
    slug: 'stoicism',
    description: 'Philosophie antique, sagesse pratique, résilience',
    defaultTone: 'Calme, réfléchi, autoritaire mais bienveillant',
    suggestedTopics: ['Sénèque', 'Épictète', 'Marc Aurèle', 'contrôle des émotions', 'vertu'],
    icon: '🏛️',
    backgroundColor: '#1a1a2e',
    textColor: '#e0e0e0'
  },
  {
    id: 'meditation',
    name: 'Méditation',
    slug: 'meditation',
    description: 'Pleine conscience, relaxation, développement personnel',
    defaultTone: 'Apaisant, lent, enveloppant',
    suggestedTopics: ['respiration', 'body scan', 'mindfulness', 'anxiété', 'sommeil'],
    icon: '🧘',
    backgroundColor: '#0f172a',
    textColor: '#cbd5e1'
  },
  {
    id: 'history',
    name: 'Histoire',
    slug: 'history',
    description: 'Récits historiques, biographies, batailles',
    defaultTone: 'Narratif, captivant, précis',
    suggestedTopics: ['Antiquité', 'Moyen Âge', 'Napoléon', 'Révolution', 'découvertes'],
    icon: '📜',
    backgroundColor: '#1e1b2e',
    textColor: '#e0d6c8'
  },
  {
    id: 'philosophy',
    name: 'Philosophie',
    slug: 'philosophy',
    description: 'Grands penseurs, concepts, éthique',
    defaultTone: 'Profond, accessible, stimulant',
    suggestedTopics: ['Platon', 'Aristote', 'Nietzsche', 'Camus', 'existentalisme'],
    icon: '💭',
    backgroundColor: '#1a2a1a',
    textColor: '#d0e0d0'
  },
  {
    id: 'psychology',
    name: 'Psychologie',
    slug: 'psychology',
    description: 'Comportement humain, biais cognitifs, bien-être',
    defaultTone: 'Informatif, bienveillant, pratique',
    suggestedTopics: ['cognitif', 'émotions', 'habitudes', 'motivation', 'relations'],
    icon: '🧠',
    backgroundColor: '#2a1a2a',
    textColor: '#e0d0e0'
  },
  {
    id: 'spirituality',
    name: 'Spiritualité',
    slug: 'spirituality',
    description: 'Éveil, conscience, traditions non religieuses',
    defaultTone: 'Poétique, ouvert, universel',
    suggestedTopics: ['présence', 'énergie', 'éveil', 'compassion', 'unité'],
    icon: '✨',
    backgroundColor: '#1a2a3a',
    textColor: '#c0d8f0'
  },
  {
    id: 'self-improvement',
    name: 'Développement personnel',
    slug: 'self-improvement',
    description: 'Productivité, objectifs, succès, routines',
    defaultTone: 'Motivant, structuré, actionable',
    suggestedTopics: ['habitudes', 'productivité', 'objectifs', 'discipline', 'focus'],
    icon: '📈',
    backgroundColor: '#2a2a1a',
    textColor: '#e0e0c0'
  },
  {
    id: 'mythology',
    name: 'Mythologie',
    slug: 'mythology',
    description: 'Mythes, légendes, dieux, héros',
    defaultTone: 'Épique, imagé, captivant',
    suggestedTopics: ['grecque', 'nordique', 'égyptienne', 'arthurienne', 'celtique'],
    icon: '⚡',
    backgroundColor: '#1a1a3a',
    textColor: '#c0c0f0'
  }
]

export const getNicheBySlug = (slug: string): Niche | undefined => {
  return NICHES.find(niche => niche.slug === slug)
}

export const getNicheById = (id: string): Niche | undefined => {
  return NICHES.find(niche => niche.id === id)
}