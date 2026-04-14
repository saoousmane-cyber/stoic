// AURA & LOGOS - Bibliothèque complète d'effets sonores d'ambiance
// Sons contextuels pour chaque niche, avec métadonnées et génération

export interface AmbianceSound {
  id: string
  name: string
  nameEn: string
  description: string
  category: 'nature' | 'meditation' | 'dramatic' | 'atmospheric' | 'ceremonial' | 'transition'
  niche: string[]
  duration: number // secondes
  volume: number // volume recommandé (0-1)
  url: string // chemin du fichier sonore
  isLoopable: boolean
  tags: string[]
}

// Bibliothèque complète des sons d'ambiance
export const AMBIANCE_SOUNDS_LIBRARY: AmbianceSound[] = [
  // ==================== STOÏCISME ====================
  {
    id: 'stoic-wind-mediterranean',
    name: 'Vent méditerranéen',
    nameEn: 'Mediterranean Wind',
    description: 'Vent doux soufflant sur la mer, ambiance méditative',
    category: 'nature',
    niche: ['stoicism', 'philosophy', 'meditation'],
    duration: 120,
    volume: 0.15,
    url: '/sounds/ambiance/wind-mediterranean.mp3',
    isLoopable: true,
    tags: ['vent', 'mer', 'calme', 'méditation'],
  },
  {
    id: 'stoic-crackling-fire',
    name: 'Crépitement de feu',
    nameEn: 'Crackling Fire',
    description: 'Feu de bois qui crépite, ambiance chaleureuse et réfléchie',
    category: 'atmospheric',
    niche: ['stoicism', 'philosophy', 'spirituality'],
    duration: 180,
    volume: 0.2,
    url: '/sounds/ambiance/fire-crackling.mp3',
    isLoopable: true,
    tags: ['feu', 'chaleur', 'réflexion', 'cosy'],
  },
  {
    id: 'stoic-distant-thunder',
    name: 'Tonnerre lointain',
    nameEn: 'Distant Thunder',
    description: 'Orages au loin, puissance de la nature',
    category: 'dramatic',
    niche: ['stoicism', 'philosophy'],
    duration: 60,
    volume: 0.25,
    url: '/sounds/ambiance/distant-thunder.mp3',
    isLoopable: false,
    tags: ['orage', 'tonnerre', 'puissance', 'nature'],
  },
  {
    id: 'stoic-marble-hall',
    name: 'Hall de marbre',
    nameEn: 'Marble Hall',
    description: 'Réverbération dans un temple antique',
    category: 'atmospheric',
    niche: ['stoicism', 'philosophy', 'history'],
    duration: 90,
    volume: 0.1,
    url: '/sounds/ambiance/marble-hall.mp3',
    isLoopable: true,
    tags: ['temple', 'réverbération', 'antique', 'solennel'],
  },

  // ==================== MÉDITATION ====================
  {
    id: 'meditation-tibetan-bowl',
    name: 'Bol tibétain',
    nameEn: 'Tibetan Bowl',
    description: 'Son résonant du bol tibétain, vibration méditative',
    category: 'meditation',
    niche: ['meditation', 'spirituality'],
    duration: 45,
    volume: 0.3,
    url: '/sounds/ambiance/tibetan-bowl.mp3',
    isLoopable: false,
    tags: ['bol tibétain', 'vibration', 'méditation', 'guérison'],
  },
  {
    id: 'meditation-flowing-water',
    name: 'Eau qui coule',
    nameEn: 'Flowing Water',
    description: 'Ruisseau clair, apaisant et purifiant',
    category: 'nature',
    niche: ['meditation', 'spirituality', 'stoicism'],
    duration: 180,
    volume: 0.2,
    url: '/sounds/ambiance/flowing-water.mp3',
    isLoopable: true,
    tags: ['eau', 'ruisseau', 'purification', 'calme'],
  },
  {
    id: 'meditation-forest-birds',
    name: 'Chants d\'oiseaux',
    nameEn: 'Forest Birds',
    description: 'Oiseaux chantant dans une forêt paisible',
    category: 'nature',
    niche: ['meditation', 'spirituality'],
    duration: 120,
    volume: 0.15,
    url: '/sounds/ambiance/forest-birds.mp3',
    isLoopable: true,
    tags: ['oiseaux', 'forêt', 'nature', 'matin'],
  },
  {
    id: 'meditation-om-chant',
    name: 'Om primordial',
    nameEn: 'Primordial Om',
    description: 'Chant sacré Om, vibration universelle',
    category: 'ceremonial',
    niche: ['meditation', 'spirituality'],
    duration: 30,
    volume: 0.35,
    url: '/sounds/ambiance/om-chant.mp3',
    isLoopable: false,
    tags: ['om', 'chant', 'sacré', 'mantra'],
  },
  {
    id: 'meditation-rain-zen',
    name: 'Pluie zen',
    nameEn: 'Zen Rain',
    description: 'Pluie douce tombant sur des feuilles de bambou',
    category: 'nature',
    niche: ['meditation', 'stoicism'],
    duration: 240,
    volume: 0.2,
    url: '/sounds/ambiance/zen-rain.mp3',
    isLoopable: true,
    tags: ['pluie', 'zen', 'bambou', 'apaisant'],
  },

  // ==================== HISTOIRE ====================
  {
    id: 'history-battlefield',
    name: 'Champ de bataille',
    nameEn: 'Battlefield',
    description: 'Bruit de combat lointain, épées et cris',
    category: 'dramatic',
    niche: ['history', 'mythology'],
    duration: 45,
    volume: 0.3,
    url: '/sounds/ambiance/battlefield.mp3',
    isLoopable: false,
    tags: ['bataille', 'épée', 'combat', 'guerre'],
  },
  {
    id: 'history-medieval-market',
    name: 'Marché médiéval',
    nameEn: 'Medieval Market',
    description: 'Ambiance de marché médiéval, commerces et artisans',
    category: 'atmospheric',
    niche: ['history'],
    duration: 120,
    volume: 0.2,
    url: '/sounds/ambiance/medieval-market.mp3',
    isLoopable: true,
    tags: ['médiéval', 'marché', 'ambiance', 'historique'],
  },
  {
    id: 'history-royal-trumpet',
    name: 'Trompette royale',
    nameEn: 'Royal Trumpet',
    description: 'Fanfare annonçant l\'arrivée d\'un roi',
    category: 'ceremonial',
    niche: ['history'],
    duration: 8,
    volume: 0.4,
    url: '/sounds/ambiance/royal-trumpet.mp3',
    isLoopable: false,
    tags: ['trompette', 'royal', 'cérémonie', 'fanfare'],
  },
  {
    id: 'history-ancient-crowd',
    name: 'Foule antique',
    nameEn: 'Ancient Crowd',
    description: 'Murmure de foule dans un amphithéâtre romain',
    category: 'atmospheric',
    niche: ['history'],
    duration: 90,
    volume: 0.15,
    url: '/sounds/ambiance/ancient-crowd.mp3',
    isLoopable: true,
    tags: ['foule', 'amphithéâtre', 'romain', 'antique'],
  },

  // ==================== PHILOSOPHIE ====================
  {
    id: 'philosophy-library-quiet',
    name: 'Bibliothèque silencieuse',
    nameEn: 'Quiet Library',
    description: 'Pages qui tournent, silence studieux',
    category: 'atmospheric',
    niche: ['philosophy', 'psychology'],
    duration: 180,
    volume: 0.1,
    url: '/sounds/ambiance/quiet-library.mp3',
    isLoopable: true,
    tags: ['bibliothèque', 'étude', 'silence', 'réflexion'],
  },
  {
    id: 'philosophy-quill-writing',
    name: 'Plume qui écrit',
    nameEn: 'Quill Writing',
    description: 'Bruit de plume sur parchemin',
    category: 'transition',
    niche: ['philosophy', 'history'],
    duration: 4,
    volume: 0.25,
    url: '/sounds/ambiance/quill-writing.mp3',
    isLoopable: false,
    tags: ['plume', 'écriture', 'parchemin', 'ancien'],
  },
  {
    id: 'philosophy-clock-ticking',
    name: 'Tic-tac d\'horloge',
    nameEn: 'Clock Ticking',
    description: 'Horloge ancienne, passage du temps',
    category: 'atmospheric',
    niche: ['philosophy', 'psychology'],
    duration: 60,
    volume: 0.15,
    url: '/sounds/ambiance/clock-ticking.mp3',
    isLoopable: true,
    tags: ['horloge', 'temps', 'tic-tac', 'méditation'],
  },

  // ==================== PSYCHOLOGIE ====================
  {
    id: 'psychology-brainwaves',
    name: 'Ondes cérébrales',
    nameEn: 'Brainwaves',
    description: 'Fréquences binaurales pour la concentration',
    category: 'meditation',
    niche: ['psychology', 'self-improvement'],
    duration: 300,
    volume: 0.1,
    url: '/sounds/ambiance/brainwaves.mp3',
    isLoopable: true,
    tags: ['binaural', 'concentration', 'cerveau', 'ondes'],
  },
  {
    id: 'psychology-typing',
    name: 'Clavier mécanique',
    nameEn: 'Mechanical Keyboard',
    description: 'Bruit de frappe sur un clavier',
    category: 'transition',
    niche: ['psychology', 'self-improvement'],
    duration: 3,
    volume: 0.2,
    url: '/sounds/ambiance/typing.mp3',
    isLoopable: false,
    tags: ['clavier', 'typing', 'travail', 'productivité'],
  },

  // ==================== SPIRITUALITÉ ====================
  {
    id: 'spiritual-angelic-chimes',
    name: 'Carillons angéliques',
    nameEn: 'Angelic Chimes',
    description: 'Carillons célestes, ambiance éthérée',
    category: 'ceremonial',
    niche: ['spirituality', 'meditation'],
    duration: 15,
    volume: 0.25,
    url: '/sounds/ambiance/angelic-chimes.mp3',
    isLoopable: false,
    tags: ['carillons', 'angélique', 'céleste', 'léger'],
  },
  {
    id: 'spiritual-cosmic-drone',
    name: 'Drone cosmique',
    nameEn: 'Cosmic Drone',
    description: 'Fréquence grave et vibratoire, connexion universelle',
    category: 'meditation',
    niche: ['spirituality', 'meditation'],
    duration: 240,
    volume: 0.2,
    url: '/sounds/ambiance/cosmic-drone.mp3',
    isLoopable: true,
    tags: ['drone', 'cosmique', 'vibration', 'univers'],
  },
  {
    id: 'spiritual-crystal-singing',
    name: 'Bol de cristal',
    nameEn: 'Crystal Singing Bowl',
    description: 'Son pur et résonant du bol de cristal',
    category: 'meditation',
    niche: ['spirituality', 'meditation'],
    duration: 30,
    volume: 0.3,
    url: '/sounds/ambiance/crystal-bowl.mp3',
    isLoopable: false,
    tags: ['cristal', 'bol', 'guérison', 'son'],
  },

  // ==================== DÉVELOPPEMENT PERSONNEL ====================
  {
    id: 'selfimprovement-motivation',
    name: 'Montée motivante',
    nameEn: 'Motivational Rise',
    description: 'Crescendo musical, boost de motivation',
    category: 'dramatic',
    niche: ['self-improvement'],
    duration: 10,
    volume: 0.35,
    url: '/sounds/ambiance/motivational-rise.mp3',
    isLoopable: false,
    tags: ['motivation', 'crescendo', 'boost', 'énergie'],
  },
  {
    id: 'selfimprovement-checkmark',
    name: 'Cocher',
    nameEn: 'Checkmark',
    description: 'Son de validation, objectif accompli',
    category: 'transition',
    niche: ['self-improvement'],
    duration: 1.5,
    volume: 0.3,
    url: '/sounds/ambiance/checkmark.mp3',
    isLoopable: false,
    tags: ['check', 'validation', 'succès', 'objectif'],
  },
  {
    id: 'selfimprovement-applause',
    name: 'Applaudissements',
    nameEn: 'Applause',
    description: 'Public en liesse, reconnaissance',
    category: 'ceremonial',
    niche: ['self-improvement'],
    duration: 6,
    volume: 0.35,
    url: '/sounds/ambiance/applause.mp3',
    isLoopable: false,
    tags: ['applaudissements', 'félicitations', 'réussite'],
  },

  // ==================== MYTHOLOGIE ====================
  {
    id: 'mythology-thunder-god',
    name: 'Tonnerre divin',
    nameEn: 'Divine Thunder',
    description: 'Tonnerre puissant, colère des dieux',
    category: 'dramatic',
    niche: ['mythology'],
    duration: 6,
    volume: 0.4,
    url: '/sounds/ambiance/divine-thunder.mp3',
    isLoopable: false,
    tags: ['tonnerre', 'dieux', 'puissance', 'mythologie'],
  },
  {
    id: 'mythology-dragon-roar',
    name: 'Rugissement de dragon',
    nameEn: 'Dragon Roar',
    description: 'Cri terrifiant d\'un dragon légendaire',
    category: 'dramatic',
    niche: ['mythology'],
    duration: 4,
    volume: 0.45,
    url: '/sounds/ambiance/dragon-roar.mp3',
    isLoopable: false,
    tags: ['dragon', 'rugissement', 'fantastique', 'créature'],
  },
  {
    id: 'mythology-magical-sparkle',
    name: 'Scintillement magique',
    nameEn: 'Magical Sparkle',
    description: 'Bruit de magie, poussière de fée',
    category: 'transition',
    niche: ['mythology', 'spirituality'],
    duration: 2,
    volume: 0.25,
    url: '/sounds/ambiance/magical-sparkle.mp3',
    isLoopable: false,
    tags: ['magie', 'scintillement', 'féérique', 'fantaisie'],
  },

  // ==================== GÉNÉRIQUES (toutes niches) ====================
  {
    id: 'generic-soft-transition',
    name: 'Transition douce',
    nameEn: 'Soft Transition',
    description: 'Son de passage, transition fluide',
    category: 'transition',
    niche: [],
    duration: 2,
    volume: 0.2,
    url: '/sounds/ambiance/soft-transition.mp3',
    isLoopable: false,
    tags: ['transition', 'doux', 'passage'],
  },
  {
    id: 'generic-attention-ping',
    name: 'Ping d\'attention',
    nameEn: 'Attention Ping',
    description: 'Son pour attirer l\'attention sur un point important',
    category: 'transition',
    niche: [],
    duration: 1,
    volume: 0.25,
    url: '/sounds/ambiance/attention-ping.mp3',
    isLoopable: false,
    tags: ['ping', 'attention', 'alerte', 'doux'],
  },
  {
    id: 'generic-calm-piano',
    name: 'Nappe de piano',
    nameEn: 'Piano Pad',
    description: 'Accord de piano doux et résonant',
    category: 'atmospheric',
    niche: [],
    duration: 30,
    volume: 0.15,
    url: '/sounds/ambiance/calm-piano.mp3',
    isLoopable: true,
    tags: ['piano', 'calme', 'nappe', 'ambiance'],
  },
]

// Obtenir les sons par niche
export function getAmbianceSoundsByNiche(niche: string): AmbianceSound[] {
  return AMBIANCE_SOUNDS_LIBRARY.filter(
    sound => sound.niche.length === 0 || sound.niche.includes(niche)
  )
}

// Obtenir les sons par catégorie
export function getAmbianceSoundsByCategory(category: AmbianceSound['category']): AmbianceSound[] {
  return AMBIANCE_SOUNDS_LIBRARY.filter(sound => sound.category === category)
}

// Générer une playlist d'ambiance pour une durée donnée
export function generateAmbiancePlaylist(
  niche: string,
  durationSeconds: number,
  intensity: 'light' | 'moderate' | 'rich'
): AmbianceSound[] {
  const availableSounds = getAmbianceSoundsByNiche(niche)
  
  if (availableSounds.length === 0) return []
  
  // Filtrer selon l'intensité
  let filteredSounds = availableSounds
  
  if (intensity === 'light') {
    filteredSounds = availableSounds.filter(s => s.category === 'transition' || s.duration < 10)
  } else if (intensity === 'moderate') {
    filteredSounds = availableSounds.filter(s => s.category !== 'dramatic')
  }
  
  if (filteredSounds.length === 0) filteredSounds = availableSounds
  
  // Construire une playlist qui remplit la durée
  const playlist: AmbianceSound[] = []
  let currentDuration = 0
  let soundIndex = 0
  
  while (currentDuration < durationSeconds && filteredSounds.length > 0) {
    const sound = filteredSounds[soundIndex % filteredSounds.length]
    playlist.push(sound)
    currentDuration += sound.duration
    soundIndex++
  }
  
  return playlist
}

// Obtenir le chemin d'un son par ID
export function getAmbianceSoundUrl(id: string): string | undefined {
  const sound = AMBIANCE_SOUNDS_LIBRARY.find(s => s.id === id)
  return sound?.url
}