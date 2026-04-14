// AURA & LOGOS - Service de ducking audio (voix + musique de fond)
// Réduction automatique du volume de la musique pendant la parole

interface DuckingParams {
  voiceBuffer: Buffer
  musicBuffer: Buffer
  duckingDb?: number        // Réduction en dB (défaut: -6)
  fadeMs?: number           // Durée du fade in/out en ms (défaut: 50)
  voiceVolume?: number      // Volume de la voix (0-1, défaut: 1)
  musicVolume?: number      // Volume musique silencieuse (0-1, défaut: 0.3)
}

interface DuckingResult {
  success: boolean
  mixedBuffer?: Buffer
  durationSeconds: number
  error?: string
}

// Note: Ce service nécessite ffmpeg (sera installé via @ffmpeg/ffmpeg ou exec)
// Pour Vercel, on utilisera @ffmpeg/ffmpeg (WebAssembly)

export async function applyDucking(params: DuckingParams): Promise<DuckingResult> {
  const {
    voiceBuffer,
    musicBuffer,
    duckingDb = -6,
    fadeMs = 50,
    voiceVolume = 1,
    musicVolume = 0.3
  } = params

  try {
    // Calcul du facteur de réduction (dB -> linéaire)
    const duckingFactor = Math.pow(10, duckingDb / 20)
    
    // Détection des silences dans la voix
    const voiceChunks = await detectVoiceActivity(voiceBuffer)
    
    // Application du ducking sur la musique
    const duckedMusicBuffer = await applyVolumeEnvelope(
      musicBuffer,
      voiceChunks,
      duckingFactor,
      musicVolume,
      fadeMs
    )
    
    // Mixage voix + musique duckée
    const mixedBuffer = await mixAudioBuffers(
      voiceBuffer,
      duckedMusicBuffer,
      voiceVolume
    )
    
    // Calcul de la durée
    const durationSeconds = await getAudioDuration(voiceBuffer)
    
    return {
      success: true,
      mixedBuffer,
      durationSeconds
    }
    
  } catch (error) {
    console.error('Ducking error:', error)
    return {
      success: false,
      durationSeconds: 0,
      error: error instanceof Error ? error.message : 'Erreur de ducking audio'
    }
  }
}

// Version simplifiée (sans détection poussée) pour Phase 1
export async function applyDuckingSimple(params: DuckingParams): Promise<DuckingResult> {
  const {
    voiceBuffer,
    musicBuffer,
    duckingDb = -6,
    voiceVolume = 1,
    musicVolume = 0.3
  } = params

  try {
    // Version simple : volume constant de la musique à 30%
    // et on mixe avec la voix
    const duckingFactor = Math.pow(10, duckingDb / 20)
    const finalMusicVolume = musicVolume * duckingFactor
    
    const mixedBuffer = await mixAudioBuffersSimple(
      voiceBuffer,
      musicBuffer,
      voiceVolume,
      finalMusicVolume
    )
    
    const durationSeconds = await getAudioDuration(voiceBuffer)
    
    return {
      success: true,
      mixedBuffer,
      durationSeconds
    }
    
  } catch (error) {
    console.error('Simple ducking error:', error)
    return {
      success: false,
      durationSeconds: 0,
      error: error instanceof Error ? error.message : 'Erreur de ducking simple'
    }
  }
}

// Détection des zones de parole dans l'audio
async function detectVoiceActivity(audioBuffer: Buffer): Promise<Array<{ start: number; end: number }>> {
  // Simplifié pour Phase 1
  // En production, utiliser webrtc-vad ou analyse d'amplitude
  return [{ start: 0, end: await getAudioDuration(audioBuffer) }]
}

// Application de l'enveloppe de volume
async function applyVolumeEnvelope(
  musicBuffer: Buffer,
  voiceChunks: Array<{ start: number; end: number }>,
  duckFactor: number,
  baseVolume: number,
  fadeMs: number
): Promise<Buffer> {
  // Simplifié pour Phase 1
  return musicBuffer
}

// Mixage audio (complexe)
async function mixAudioBuffers(
  voiceBuffer: Buffer,
  musicBuffer: Buffer,
  voiceVolume: number
): Promise<Buffer> {
  // À implémenter avec ffmpeg ou wavefile
  return voiceBuffer
}

// Mixage audio simplifié
async function mixAudioBuffersSimple(
  voiceBuffer: Buffer,
  musicBuffer: Buffer,
  voiceVolume: number,
  musicVolume: number
): Promise<Buffer> {
  // À implémenter avec ffmpeg
  // Pour Phase 1, on retourne juste la voix
  return voiceBuffer
}

// Récupération de la durée audio (via header)
async function getAudioDuration(buffer: Buffer): Promise<number> {
  // Simplifié : estimation via taille du buffer MP3
  // MP3 bitrate approx 128kbps = 16KB/s
  const estimatedDuration = buffer.length / 16000
  return Math.min(estimatedDuration, 3600) // Max 1 heure
}

// Sélection de musique de fond selon niche
export function getBackgroundMusicForNiche(niche: string): string {
  const musicMap: Record<string, string> = {
    stoicism: 'ambient-classical-sad',
    meditation: 'ambient-calm-zen',
    history: 'cinematic-epic-orchestral',
    philosophy: 'ambient-thoughtful-piano',
    psychology: 'ambient-modern-study',
    spirituality: 'ambient-ethereal-chill',
    'self-improvement': 'motivational-uplifting',
    mythology: 'cinematic-fantasy-epic'
  }
  
  return musicMap[niche] || 'ambient-calm'
}

// Liste des musiques libres de droit disponibles
export const ROYALTY_FREE_MUSIC = [
  { id: 'ambient-calm-zen', name: 'Calm Zen', duration: 300, source: 'Pixabay Music' },
  { id: 'ambient-classical-sad', name: 'Classical Sad', duration: 240, source: 'Pixabay Music' },
  { id: 'ambient-ethereal-chill', name: 'Ethereal Chill', duration: 360, source: 'Pixabay Music' },
  { id: 'ambient-modern-study', name: 'Modern Study', duration: 300, source: 'Pixabay Music' },
  { id: 'ambient-thoughtful-piano', name: 'Thoughtful Piano', duration: 280, source: 'Pixabay Music' },
  { id: 'cinematic-epic-orchestral', name: 'Epic Orchestral', duration: 240, source: 'Pixabay Music' },
  { id: 'cinematic-fantasy-epic', name: 'Fantasy Epic', duration: 300, source: 'Pixabay Music' },
  { id: 'motivational-uplifting', name: 'Motivational Uplifting', duration: 280, source: 'Pixabay Music' }
]