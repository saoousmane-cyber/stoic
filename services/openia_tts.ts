// AURA & LOGOS - Service de synthèse vocale OpenAI TTS (HD)

interface TTSGenerationParams {
  text: string
  language: string
  voice?: string
  speed?: number
  model?: 'tts-1' | 'tts-1-hd'
  outputFormat?: 'mp3' | 'opus' | 'aac' | 'flac'
}

interface TTSGenerationResult {
  success: boolean
  audioBuffer?: Buffer
  durationSeconds: number
  estimatedCost?: number
  error?: string
}

// Mapping langue -> voix OpenAI recommandée
const DEFAULT_VOICES: Record<string, string> = {
  fr: 'nova',
  en: 'nova',
  es: 'nova',
  de: 'nova',
  it: 'nova',
  pt: 'nova'
}

// Vitesse de lecture par langue (ajustement)
const SPEED_BY_LANGUAGE: Record<string, number> = {
  fr: 1.0,
  en: 1.0,
  es: 0.95,
  de: 0.95,
  it: 1.0,
  pt: 0.95
}

export async function generateVoice(params: TTSGenerationParams): Promise<TTSGenerationResult> {
  const {
    text,
    language,
    voice = DEFAULT_VOICES[language] || 'nova',
    speed = SPEED_BY_LANGUAGE[language] || 1.0,
    model = 'tts-1-hd',  // HD par défaut pour qualité supérieure
    outputFormat = 'mp3'
  } = params

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      success: false,
      durationSeconds: 0,
      error: 'OPENAI_API_KEY manquante'
    }
  }

  // Limite de caractères par requête OpenAI TTS (4096)
  const maxChunkSize = 4000
  const textChunks = splitTextIntoChunks(text, maxChunkSize)

  try {
    let combinedAudioBuffers: Buffer[] = []
    let totalDuration = 0

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i]
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          input: chunk,
          voice,
          speed,
          response_format: outputFormat
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `HTTP ${response.status}`)
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer())
      combinedAudioBuffers.push(audioBuffer)
      
      // Estimation durée (~15 secondes pour 150 mots)
      const wordCount = chunk.trim().split(/\s+/).length
      totalDuration += wordCount / 2.5  // ~2.5 mots par seconde
    }

    // Combinaison des buffers (simple concaténation)
    const finalBuffer = Buffer.concat(combinedAudioBuffers as unknown as Uint8Array[])
  

    // Calcul du coût (HD = $0.015 par 1000 caractères, Standard = $0.006)
    const totalChars = text.length
    const costPer1kChars = model === 'tts-1-hd' ? 0.015 : 0.006
    const estimatedCost = (totalChars / 1000) * costPer1kChars

    return {
      success: true,
      audioBuffer: finalBuffer,
      durationSeconds: Math.ceil(totalDuration),
      estimatedCost
    }

  } catch (error) {
    console.error('TTS generation error:', error)
    return {
      success: false,
      durationSeconds: 0,
      error: error instanceof Error ? error.message : 'Erreur de génération vocale'
    }
  }
}

// Version standard (moins chère, qualité légèrement inférieure)
export async function generateVoiceStandard(params: TTSGenerationParams): Promise<TTSGenerationResult> {
  return generateVoice({
    ...params,
    model: 'tts-1'
  })
}

// Prétraitement du texte pour une meilleure prononciation
export function preprocessTextForTTS(text: string, niche: string): string {
  let processed = text

  // Nettoyage des markdown
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '$1')
  processed = processed.replace(/\*([^*]+)\*/g, '$1')
  processed = processed.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  
  // Citations en français
  processed = processed.replace(/«\s*/g, '« ')
  processed = processed.replace(/\s*»/g, ' »')
  
  // Ponctuation pour pauses
  processed = processed.replace(/\.\.\./g, '. ')
  processed = processed.replace(/—/g, ', ')
  
  // Abréviations courantes
  const abbreviations: Record<string, string> = {
    'M.': 'Monsieur',
    'Mme': 'Madame',
    'Dr': 'Docteur',
    'Stoïc.': 'Stoïcisme',
    'ex.': 'exemple'
  }
  
  for (const [abbr, full] of Object.entries(abbreviations)) {
    processed = processed.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full)
  }
  
  return processed
}

function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  let currentChunk = ''
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}