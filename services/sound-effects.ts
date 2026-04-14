// AURA & LOGOS - Service d'effets sonores contextuels
// Ajoute des effets sonores tout au long de l'audio selon le contexte

export interface SoundEffect {
  id: string
  name: string
  url: string
  duration: number
  category: 'ambiance' | 'transition' | 'emphasis' | 'nature' | 'meditation'
  niche?: string
}

export interface SoundEffectPlacement {
  effectId: string
  timestamp: number // en secondes
  duration: number
  volume: number // 0-1
}

export interface SoundEffectConfig {
  intensity: 'light' | 'moderate' | 'rich'
  niche: string
  language: string
  totalDuration: number
}

// Bibliothèque d'effets sonores par niche
const SOUND_EFFECTS_LIBRARY: SoundEffect[] = [
  // Stoïcisme
  { id: 'stoic-wind', name: 'Vent méditerranéen', url: '/sounds/wind.mp3', duration: 30, category: 'ambiance', niche: 'stoicism' },
  { id: 'stoic-fire', name: 'Crépitement de feu', url: '/sounds/fire.mp3', duration: 45, category: 'ambiance', niche: 'stoicism' },
  { id: 'stoic-bell', name: 'Cloche méditative', url: '/sounds/bell.mp3', duration: 5, category: 'transition', niche: 'stoicism' },
  
  // Méditation
  { id: 'meditation-bowl', name: 'Bol tibétain', url: '/sounds/tibetan-bowl.mp3', duration: 60, category: 'meditation', niche: 'meditation' },
  { id: 'meditation-water', name: 'Eau qui coule', url: '/sounds/water.mp3', duration: 90, category: 'nature', niche: 'meditation' },
  { id: 'meditation-birds', name: 'Chants d\'oiseaux', url: '/sounds/birds.mp3', duration: 60, category: 'nature', niche: 'meditation' },
  { id: 'meditation-om', name: 'Om', url: '/sounds/om.mp3', duration: 8, category: 'meditation', niche: 'meditation' },
  
  // Histoire
  { id: 'history-battle', name: 'Bruit de bataille', url: '/sounds/battle.mp3', duration: 20, category: 'emphasis', niche: 'history' },
  { id: 'history-trumpet', name: 'Trompette', url: '/sounds/trumpet.mp3', duration: 4, category: 'transition', niche: 'history' },
  { id: 'history-crowd', name: 'Foule', url: '/sounds/crowd.mp3', duration: 15, category: 'ambiance', niche: 'history' },
  
  // Philosophie
  { id: 'philosophy-pen', name: 'Plume qui écrit', url: '/sounds/pen.mp3', duration: 3, category: 'transition', niche: 'philosophy' },
  { id: 'philosophy-page', name: 'Page qui tourne', url: '/sounds/page-turn.mp3', duration: 2, category: 'transition', niche: 'philosophy' },
  
  // Psychologie
  { id: 'psychology-brain', name: 'Ondes cérébrales', url: '/sounds/brainwaves.mp3', duration: 60, category: 'ambiance', niche: 'psychology' },
  { id: 'psychology-clock', name: 'Tic-tac', url: '/sounds/clock.mp3', duration: 30, category: 'ambiance', niche: 'psychology' },
  
  // Spiritualité
  { id: 'spiritual-chimes', name: 'Carillons', url: '/sounds/chimes.mp3', duration: 10, category: 'meditation', niche: 'spirituality' },
  { id: 'spiritual-harp', name: 'Harpe céleste', url: '/sounds/harp.mp3', duration: 15, category: 'transition', niche: 'spirituality' },
  
  // Développement personnel
  { id: 'self-improvement-applause', name: 'Applaudissements', url: '/sounds/applause.mp3', duration: 5, category: 'emphasis', niche: 'self-improvement' },
  { id: 'self-improvement-check', name: 'Cocher', url: '/sounds/check.mp3', duration: 1, category: 'transition', niche: 'self-improvement' },
  
  // Mythologie
  { id: 'mythology-thunder', name: 'Tonnerre', url: '/sounds/thunder.mp3', duration: 8, category: 'emphasis', niche: 'mythology' },
  { id: 'mythology-dragon', name: 'Rugissement', url: '/sounds/dragon-roar.mp3', duration: 4, category: 'emphasis', niche: 'mythology' },
  
  // Génériques
  { id: 'generic-transition', name: 'Transition douce', url: '/sounds/transition.mp3', duration: 2, category: 'transition' },
  { id: 'generic-emphasis', name: 'Ping', url: '/sounds/ping.mp3', duration: 1, category: 'emphasis' },
]

export function getSoundEffectsForNiche(niche: string, intensity: 'light' | 'moderate' | 'rich'): SoundEffect[] {
  const nicheEffects = SOUND_EFFECTS_LIBRARY.filter(
    effect => effect.niche === niche || !effect.niche
  )
  
  // Filtrer selon l'intensité
  if (intensity === 'light') {
    return nicheEffects.filter(e => e.category === 'transition')
  }
  
  if (intensity === 'moderate') {
    return nicheEffects.filter(e => ['transition', 'ambiance'].includes(e.category))
  }
  
  return nicheEffects
}

export function generateSoundEffectPlacements(
  totalDuration: number,
  niche: string,
  intensity: 'light' | 'moderate' | 'rich'
): SoundEffectPlacement[] {
  const placements: SoundEffectPlacement[] = []
  const effects = getSoundEffectsForNiche(niche, intensity)
  
  if (effects.length === 0) return placements
  
  // Déterminer la fréquence des effets selon l'intensité
  let intervalSeconds: number
  let volumeBase: number
  
  switch (intensity) {
    case 'light':
      intervalSeconds = 60 // toutes les minutes
      volumeBase = 0.15
      break
    case 'moderate':
      intervalSeconds = 30 // toutes les 30 secondes
      volumeBase = 0.2
      break
    case 'rich':
      intervalSeconds = 15 // toutes les 15 secondes
      volumeBase = 0.25
      break
  }
  
  // Placer des effets sonores régulièrement
  for (let timestamp = 5; timestamp < totalDuration - 5; timestamp += intervalSeconds) {
    // Sélectionner un effet aléatoire
    const effect = effects[Math.floor(Math.random() * effects.length)]
    
    // Variation de volume aléatoire
    const volume = Math.min(0.4, volumeBase + (Math.random() * 0.1))
    
    placements.push({
      effectId: effect.id,
      timestamp,
      duration: effect.duration,
      volume,
    })
  }
  
  // Ajouter des effets spéciaux aux moments clés (début et fin)
  if (intensity !== 'light') {
    // Effet d'intro
    const introEffect = effects.find(e => e.category === 'meditation' || e.category === 'ambiance')
    if (introEffect) {
      placements.push({
        effectId: introEffect.id,
        timestamp: 2,
        duration: introEffect.duration,
        volume: 0.2,
      })
    }
    
    // Effet de conclusion
    const outroEffect = effects.find(e => e.category === 'emphasis')
    if (outroEffect) {
      placements.push({
        effectId: outroEffect.id,
        timestamp: totalDuration - 8,
        duration: outroEffect.duration,
        volume: 0.3,
      })
    }
  }
  
  // Trier par timestamp
  placements.sort((a, b) => a.timestamp - b.timestamp)
  
  return placements
}

export function getSoundEffectUrl(effectId: string): string | undefined {
  const effect = SOUND_EFFECTS_LIBRARY.find(e => e.id === effectId)
  return effect?.url
}