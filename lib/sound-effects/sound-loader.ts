// AURA & LOGOS - Chargeur de sons pour les effets sonores
// Gère le préchargement et la lecture des effets sonores

export const SOUND_URLS = {
  // UI Sounds
  transition: '/sounds/transition.mp3',
  emphasis: '/sounds/emphasis.mp3',
  notification: '/sounds/notification.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  
  // Ambiance Sounds
  ambiance: {
    'wind-mediterranean': '/sounds/ambiance/wind-mediterranean.mp3',
    'fire-crackling': '/sounds/ambiance/fire-crackling.mp3',
    'tibetan-bowl': '/sounds/ambiance/tibetan-bowl.mp3',
    'flowing-water': '/sounds/ambiance/flowing-water.mp3',
    'forest-birds': '/sounds/ambiance/forest-birds.mp3',
    'battlefield': '/sounds/ambiance/battlefield.mp3',
    'medieval-market': '/sounds/ambiance/medieval-market.mp3',
    'quiet-library': '/sounds/ambiance/quiet-library.mp3',
    'brainwaves': '/sounds/ambiance/brainwaves.mp3',
    'angelic-chimes': '/sounds/ambiance/angelic-chimes.mp3',
    'cosmic-drone': '/sounds/ambiance/cosmic-drone.mp3',
    'motivational-rise': '/sounds/ambiance/motivational-rise.mp3',
    'divine-thunder': '/sounds/ambiance/divine-thunder.mp3',
    'magical-sparkle': '/sounds/ambiance/magical-sparkle.mp3',
  },
}

// Interface pour un son chargé
interface LoadedSound {
  audio: HTMLAudioElement
  loaded: boolean
  error?: string
}

// Cache des sons chargés
const soundCache: Map<string, LoadedSound> = new Map()

// Précharger tous les sons
export async function preloadAllSounds(): Promise<void> {
  const allSounds: string[] = [
    SOUND_URLS.transition,
    SOUND_URLS.emphasis,
    SOUND_URLS.notification,
    SOUND_URLS.success,
    SOUND_URLS.error,
    ...Object.values(SOUND_URLS.ambiance),
  ]
  
  const promises = allSounds.map((soundUrl) => preloadSound(soundUrl))
  await Promise.all(promises)
  
  console.log(`Preloaded ${allSounds.length} sounds`)
}

// Précharger un son spécifique
export async function preloadSound(soundUrl: string): Promise<HTMLAudioElement | null> {
  if (soundCache.has(soundUrl)) {
    const cached = soundCache.get(soundUrl)
    if (cached?.loaded) {
      return cached.audio
    }
  }
  
  return new Promise((resolve) => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = soundUrl
    
    const loadedSound: LoadedSound = {
      audio,
      loaded: false,
    }
    
    const onCanPlay = () => {
      loadedSound.loaded = true
      soundCache.set(soundUrl, loadedSound)
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.removeEventListener('error', onError)
      resolve(audio)
    }
    
    const onError = (e: Event) => {
      console.error(`Failed to load sound: ${soundUrl}`, e)
      loadedSound.error = 'Failed to load'
      loadedSound.loaded = false
      soundCache.set(soundUrl, loadedSound)
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.removeEventListener('error', onError)
      resolve(null)
    }
    
    audio.addEventListener('canplaythrough', onCanPlay)
    audio.addEventListener('error', onError)
    
    audio.load()
  })
}

// Jouer un son depuis le cache
export async function playSound(soundUrl: string, volume: number = 0.5): Promise<void> {
  let sound = soundCache.get(soundUrl)
  
  if (!sound || !sound.loaded) {
    const audio = new Audio(soundUrl)
    sound = {
      audio,
      loaded: true,
    }
    soundCache.set(soundUrl, sound)
  }
  
  if (sound.audio) {
    sound.audio.volume = Math.min(1, Math.max(0, volume))
    sound.audio.currentTime = 0
    
    try {
      await sound.audio.play()
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }
}

// Arrêter tous les sons
export function stopAllSounds(): void {
  soundCache.forEach((sound) => {
    if (sound.audio) {
      sound.audio.pause()
      sound.audio.currentTime = 0
    }
  })
}

// Obtenir un son depuis le cache
export function getSound(soundUrl: string): HTMLAudioElement | null {
  const sound = soundCache.get(soundUrl)
  return sound?.audio || null
}

// Vérifier si un son est chargé
export function isSoundLoaded(soundUrl: string): boolean {
  const sound = soundCache.get(soundUrl)
  return sound?.loaded || false
}

// Nettoyer le cache (libérer la mémoire)
export function clearSoundCache(): void {
  soundCache.forEach((sound) => {
    if (sound.audio) {
      sound.audio.pause()
      sound.audio.src = ''
    }
  })
  soundCache.clear()
}