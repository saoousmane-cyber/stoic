// AURA & LOGOS - Données complètes pour les 8 niches

export interface NicheData {
  id: string
  slug: string
  name: string
  nameEn: string
  description: string
  longDescription: string
  icon: string
  color: string
  gradient: string
  targetAudience: string[]
  contentTypes: string[]
  keywords: string[]
  exampleTopics: string[]
  tone: string
  suggestedVoice: string
  musicStyle: string
  imageStyle: string
  hashtags: string[]
  seoOptimization: {
    titlePrefix: string
    titleSuffix: string
    descriptionTemplate: string
  }
}

export const NICHES_DATA: NicheData[] = [
  {
    id: '1',
    slug: 'stoicism',
    name: 'Stoïcisme',
    nameEn: 'Stoicism',
    description: 'Philosophie antique pour une vie résiliente',
    longDescription: 'Le stoïcisme enseigne la vertu, la raison et la résilience face à l\'adversité. Découvrez les enseignements de Sénèque, Épictète et Marc Aurèle.',
    icon: '🏛️',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    targetAudience: ['Chercheurs de sens', 'Amateurs de philosophie', 'Personnes en quête de résilience'],
    contentTypes: ['Citations commentées', 'Exercices pratiques', 'Biographies', 'Méditations guidées'],
    keywords: ['stoïcisme', 'philosophie', 'résilience', 'sagesse', 'vertu', 'sérénité', 'contrôle', 'acceptation'],
    exampleTopics: [
      'Comment appliquer le stoïcisme au quotidien',
      'Marc Aurèle : Pensées pour mieux vivre',
      'Les 4 vertus stoïciennes expliquées',
      'Sénèque sur la brièveté de la vie'
    ],
    tone: 'Calme, réfléchi, autoritaire mais bienveillant',
    suggestedVoice: 'nova',
    musicStyle: 'classique ambiant, piano mélancolique',
    imageStyle: 'Statues antiques, tons sépia, atmosphère méditative',
    hashtags: ['stoicisme', 'philosophie', 'sagesse', 'resilience', 'developpementpersonnel'],
    seoOptimization: {
      titlePrefix: 'Stoïcisme : ',
      titleSuffix: ' | Philosophie Antique',
      descriptionTemplate: 'Découvrez les enseignements du stoïcisme pour {topic}. Une philosophie pratique pour {benefit}.'
    }
  },
  {
    id: '2',
    slug: 'meditation',
    name: 'Méditation',
    nameEn: 'Meditation',
    description: 'Pleine conscience et bien-être intérieur',
    longDescription: 'La méditation est une pratique millénaire pour cultiver la pleine conscience, réduire le stress et développer la paix intérieure.',
    icon: '🧘',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    targetAudience: ['Personnes stressées', 'Débutants en méditation', 'Professionnels du bien-être'],
    contentTypes: ['Méditations guidées', 'Exercices de respiration', 'Conseils mindfulness', 'Musique relaxante'],
    keywords: ['méditation', 'pleine conscience', 'relaxation', 'stress', 'calme', 'respiration', 'mindfulness'],
    exampleTopics: [
      'Méditation guidée de 10 minutes pour débutants',
      'La respiration carrée : technique anti-stress',
      'Comment méditer quand on a l\'esprit agité',
      'Les bienfaits scientifiquement prouvés de la méditation'
    ],
    tone: 'Apaisant, lent, enveloppant, rassurant',
    suggestedVoice: 'nova',
    musicStyle: 'ambient, nature sounds, fréquences relaxantes',
    imageStyle: 'Paysages sereins, lumières douces, nature',
    hashtags: ['meditation', 'pleineconscience', 'bienetre', 'relaxation', 'mindfulness'],
    seoOptimization: {
      titlePrefix: 'Méditation : ',
      titleSuffix: ' | Pleine Conscience',
      descriptionTemplate: 'Pratiquez la méditation pour {topic}. {duration} minutes de calme et de sérénité.'
    }
  },
  {
    id: '3',
    slug: 'history',
    name: 'Histoire',
    nameEn: 'History',
    description: 'Récits captivants du passé',
    longDescription: 'Plongez dans les grandes civilisations, les batailles légendaires et les personnages qui ont façonné notre monde.',
    icon: '📜',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    targetAudience: ['Passionnés d\'histoire', 'Étudiants', 'Curieux', 'Amateurs de récits'],
    contentTypes: ['Récits historiques', 'Biographies', 'Chronologies', 'Mystères historiques'],
    keywords: ['histoire', 'civilisation', 'antiquité', 'moyen âge', 'bataille', 'découverte', 'chronologie'],
    exampleTopics: [
      'La chute de l\'Empire romain : les vraies causes',
      'Jeanne d\'Arc : mythes et réalités',
      'Comment les pyramides ont été construites',
      'La guerre de Cent Ans expliquée en 20 minutes'
    ],
    tone: 'Narratif, captivant, précis, dynamique',
    suggestedVoice: 'nova',
    musicStyle: 'cinématique orchestrale, épique',
    imageStyle: 'Images d\'époque, reconstitutions, cartes anciennes',
    hashtags: ['histoire', 'civilisation', 'antiquite', 'recit', 'culture'],
    seoOptimization: {
      titlePrefix: '',
      titleSuffix: ' | Histoire & Civilisations',
      descriptionTemplate: 'Découvrez {topic} à travers ce récit captivant. {duration} minutes d\'histoire fascinante.'
    }
  },
  {
    id: '4',
    slug: 'philosophy',
    name: 'Philosophie',
    nameEn: 'Philosophy',
    description: 'Grandes idées et penseurs',
    longDescription: 'Explorez les concepts fondamentaux de la philosophie occidentale et orientale, de Platon à Nietzsche.',
    icon: '💭',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-600',
    targetAudience: ['Étudiants en philosophie', 'Intellectuels', 'Chercheurs de sens'],
    contentTypes: ['Concepts expliqués', 'Biographies', 'Comparaisons', 'Analyses de textes'],
    keywords: ['philosophie', 'pensée', 'concept', 'éthique', 'métaphysique', 'épistémologie', 'existence'],
    exampleTopics: [
      'La caverne de Platon : métaphore de notre époque',
      'Nietzsche et le surhomme : explication simple',
      'L\'existentialisme en 10 minutes',
      'Kant : qu\'est-ce que les Lumières ?'
    ],
    tone: 'Profond, accessible, stimulant, clair',
    suggestedVoice: 'nova',
    musicStyle: 'piano contemplatif, cordes douces',
    imageStyle: 'Bibliothèques, bustes de philosophes, atmosphère studieuse',
    hashtags: ['philosophie', 'pensee', 'reflexion', 'connaissance', 'sagesse'],
    seoOptimization: {
      titlePrefix: 'Philosophie : ',
      titleSuffix: ' | Grands Penseurs',
      descriptionTemplate: '{topic} expliqué simplement. {duration} minutes pour comprendre les grands concepts.'
    }
  },
  {
    id: '5',
    slug: 'psychology',
    name: 'Psychologie',
    nameEn: 'Psychology',
    description: 'Comprendre l\'esprit humain',
    longDescription: 'La psychologie explore le comportement humain, les émotions, les biais cognitifs et le fonctionnement du cerveau.',
    icon: '🧠',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-600',
    targetAudience: ['Étudiants', 'Professionnels de santé', 'Curieux de nature humaine'],
    contentTypes: ['Biais cognitifs', 'Tests psychologiques', 'Théories', 'Applications pratiques'],
    keywords: ['psychologie', 'cerveau', 'comportement', 'émotion', 'cognition', 'mental', 'bien-être'],
    exampleTopics: [
      'Les 10 biais cognitifs qui gouvernent vos décisions',
      'Comment fonctionne la mémoire',
      'L\'effet Dunning-Kruger expliqué',
      'Psychologie de la motivation : comment passer à l\'action'
    ],
    tone: 'Informatif, bienveillant, pratique, scientifique',
    suggestedVoice: 'nova',
    musicStyle: 'ambient moderne, lo-fi study',
    imageStyle: 'Visuels abstraits du cerveau, couleurs modernes',
    hashtags: ['psychologie', 'cerveau', 'comportement', 'mental', 'sante'],
    seoOptimization: {
      titlePrefix: 'Psychologie : ',
      titleSuffix: ' | Science du Comportement',
      descriptionTemplate: 'Comprenez {topic} à travers la psychologie. {duration} minutes pour décoder l\'esprit humain.'
    }
  },
  {
    id: '6',
    slug: 'spirituality',
    name: 'Spiritualité',
    nameEn: 'Spirituality',
    description: 'Éveil et connexion intérieure',
    longDescription: 'La spiritualité, au-delà des religions, est une quête de sens, de connexion et d\'éveil de la conscience.',
    icon: '✨',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    targetAudience: ['Personnes en quête spirituelle', 'Pratiquants de yoga', 'Chercheurs d\'éveil'],
    contentTypes: ['Méditations spirituelles', 'Enseignements', 'Rituels', 'Réflexions'],
    keywords: ['spiritualité', 'conscience', 'éveil', 'âme', 'énergie', 'univers', 'sacré'],
    exampleTopics: [
      'L\'éveil spirituel : signes et étapes',
      'La loi de l\'attraction fonctionne-t-elle ?',
      'Comment développer son intuition',
      'Les 7 chakras expliqués simplement'
    ],
    tone: 'Poétique, ouvert, universel, respectueux',
    suggestedVoice: 'nova',
    musicStyle: 'ambient éthérée, bols tibétains, fréquences',
    imageStyle: 'Lumière cosmique, auras, nature mystique',
    hashtags: ['spiritualite', 'eveil', 'conscience', 'ame', 'bienetre'],
    seoOptimization: {
      titlePrefix: 'Spiritualité : ',
      titleSuffix: ' | Éveil & Conscience',
      descriptionTemplate: '{topic} : un voyage spirituel en {duration} minutes. Ouvrez-vous à de nouvelles perspectives.'
    }
  },
  {
    id: '7',
    slug: 'self-improvement',
    name: 'Développement personnel',
    nameEn: 'Self Improvement',
    description: 'Devenez la meilleure version de vous-même',
    longDescription: 'Le développement personnel regroupe toutes les méthodes pour améliorer sa vie, atteindre ses objectifs et cultiver des habitudes positives.',
    icon: '📈',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-600',
    targetAudience: ['Personnes ambitieuses', 'Entrepreneurs', 'Étudiants', 'Toute personne motivée'],
    contentTypes: ['Conseils pratiques', 'Routines', 'Méthodes productivité', 'Motivation'],
    keywords: ['développement personnel', 'productivité', 'objectif', 'habitude', 'réussite', 'motivation', 'discipline'],
    exampleTopics: [
      'La routine matinale des personnes qui réussissent',
      'Comment se fixer des objectifs SMART',
      'La méthode Pomodoro pour booster votre productivité',
      'Les 5 habitudes qui ont changé ma vie'
    ],
    tone: 'Motivant, structuré, actionable, positif',
    suggestedVoice: 'nova',
    musicStyle: 'motivationnel, uplifting, électronique douce',
    imageStyle: 'Personnes actives, graphiques, succès, dynamisme',
    hashtags: ['developpementpersonnel', 'productivite', 'objectif', 'reussite', 'motivation'],
    seoOptimization: {
      titlePrefix: '',
      titleSuffix: ' | Développement Personnel',
      descriptionTemplate: '{topic} : {duration} minutes pour améliorer votre vie. Des conseils pratiques et actionnables.'
    }
  },
  {
    id: '8',
    slug: 'mythology',
    name: 'Mythologie',
    nameEn: 'Mythology',
    description: 'Légendes et héros immortels',
    longDescription: 'La mythologie nous raconte les histoires des dieux, héros et créatures qui peuplent notre imaginaire collectif.',
    icon: '⚡',
    color: '#d946ef',
    gradient: 'from-fuchsia-500 to-purple-600',
    targetAudience: ['Amateurs de fantasy', 'Étudiants', 'Passionnés de culture', 'Créateurs'],
    contentTypes: ['Récits mythologiques', 'Bestiaire', 'Généalogies', 'Symbolisme'],
    keywords: ['mythologie', 'mythe', 'légende', 'héros', 'dieux', 'créatures', 'symbolisme'],
    exampleTopics: [
      'Les 12 travaux d\'Hercule expliqués',
      'Thor et la mythologie nordique',
      'La légende du Roi Arthur',
      'Créatures mythologiques : du Minotaure au Kraken'
    ],
    tone: 'Épique, imagé, captivant, dramatique',
    suggestedVoice: 'nova',
    musicStyle: 'cinématique fantastique, épique, orchestrale',
    imageStyle: 'Créatures mythiques, paysages fantastiques, tons dramatiques',
    hashtags: ['mythologie', 'legende', 'mythe', 'hero', 'fantastique'],
    seoOptimization: {
      titlePrefix: 'Mythologie : ',
      titleSuffix: ' | Légendes & Héros',
      descriptionTemplate: 'Plongez dans {topic} à travers la mythologie. {duration} minutes de récits épiques.'
    }
  }
]

export function getNiche(slug: string): NicheData | undefined {
  return NICHES_DATA.find(niche => niche.slug === slug)
}

export function getAllNiches(): NicheData[] {
  return NICHES_DATA
}

export function getNicheSuggestions(query: string): NicheData[] {
  const lowerQuery = query.toLowerCase()
  return NICHES_DATA.filter(niche => 
    niche.name.toLowerCase().includes(lowerQuery) ||
    niche.keywords.some(k => k.includes(lowerQuery))
  )
}