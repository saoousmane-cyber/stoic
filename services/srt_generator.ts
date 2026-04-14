// AURA & LOGOS - Générateur de sous-titres SRT (phrase par phrase synchronisés)

interface SRTGeneratorParams {
  script: string
  audioDurationSeconds: number
  language: string
  maxLineLength?: number
  minDurationPerSubtitle?: number
}

interface SubtitleEntry {
  index: number
  startTime: number
  endTime: number
  text: string
}

export async function generateSRT(params: SRTGeneratorParams): Promise<string> {
  const {
    script,
    audioDurationSeconds,
    language,
    maxLineLength = 42,
    minDurationPerSubtitle = 1.5
  } = params

  // 1. Découpage du script en phrases
  const sentences = splitIntoSentences(script, language)
  
  // 2. Calcul des durées par phrase
  const subtitleEntries = calculateTimings(sentences, audioDurationSeconds, minDurationPerSubtitle)
  
  // 3. Nettoyage des lignes trop longues
  const cleanedEntries = subtitleEntries.map(entry => ({
    ...entry,
    text: splitLongLines(entry.text, maxLineLength)
  }))
  
  // 4. Génération du contenu SRT
  return formatSRT(cleanedEntries)
}

// Version avec chargement via API externe (Whisper) pour synchronisation précise
export async function generateSRTFromAudio(
  audioBuffer: Buffer,
  script: string,
  language: string
): Promise<string> {
  // Cette version nécessiterait Whisper API pour une synchronisation parfaite
  // Pour la Phase 1, on utilise la version basée sur la durée
  // À implémenter en Phase 2 pour une précision maximale
  
  console.log('SRT from audio - À implémenter avec Whisper API')
  return generateSRT({
    script,
    audioDurationSeconds: 60,
    language
  })
}

function splitIntoSentences(text: string, language: string): string[] {
  // Délimiteurs de phrases selon la langue
  const delimiters: Record<string, RegExp> = {
    fr: /[.!?…]+(?:\s|$)/,
    en: /[.!?]+(?:\s|$)/,
    es: /[.!?]+(?:\s|$)/,
    de: /[.!?]+(?:\s|$)/,
    it: /[.!?]+(?:\s|$)/,
    pt: /[.!?]+(?:\s|$)/
  }
  
  const regex = delimiters[language] || delimiters.fr
  const rawSentences = text.split(regex)
  
  // Filtrer les chaînes vides et nettoyer
  const sentences: string[] = []
  let lastIndex = 0
  
  const matches = text.matchAll(regex)
  for (const match of matches) {
    const sentence = text.substring(lastIndex, match.index! + match[0].length).trim()
    if (sentence.length > 0) {
      sentences.push(sentence)
    }
    lastIndex = match.index! + match[0].length
  }
  
  // Dernière phrase
  if (lastIndex < text.length) {
    const lastSentence = text.substring(lastIndex).trim()
    if (lastSentence.length > 0) {
      sentences.push(lastSentence)
    }
  }
  
  return sentences
}

function calculateTimings(
  sentences: string[],
  totalDuration: number,
  minDurationPerSubtitle: number
): SubtitleEntry[] {
  const entries: SubtitleEntry[] = []
  
  // Calcul du poids de chaque phrase (en caractères)
  const totalChars = sentences.reduce((sum, s) => sum + s.length, 0)
  
  let currentTime = 0
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    const charWeight = sentence.length / totalChars
    let duration = charWeight * totalDuration
    
    // Appliquer la durée minimale
    if (duration < minDurationPerSubtitle && sentences.length > 1) {
      duration = minDurationPerSubtitle
    }
    
    // Ajustement pour les phrases très longues
    const wordCount = sentence.split(/\s+/).length
    const estimatedDurationFromWords = wordCount / 2.5  // ~2.5 mots/seconde
    const finalDuration = Math.max(duration, Math.min(estimatedDurationFromWords, 8))
    
    entries.push({
      index: i + 1,
      startTime: currentTime,
      endTime: currentTime + finalDuration,
      text: sentence.trim()
    })
    
    currentTime += finalDuration
  }
  
  // Normalisation pour correspondre exactement à la durée totale
  const lastEntry = entries[entries.length - 1]
  if (lastEntry && lastEntry.endTime !== totalDuration) {
    const ratio = totalDuration / lastEntry.endTime
    for (const entry of entries) {
      entry.startTime *= ratio
      entry.endTime *= ratio
    }
  }
  
  return entries
}

function splitLongLines(text: string, maxLineLength: number): string {
  if (text.length <= maxLineLength) return text
  
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    if ((currentLine + ' ' + word).length <= maxLineLength) {
      currentLine = currentLine ? `${currentLine} ${word}` : word
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  
  if (currentLine) lines.push(currentLine)
  
  return lines.join('\n')
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const milliseconds = Math.floor((seconds % 1) * 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`
}

function formatSRT(entries: SubtitleEntry[]): string {
  const lines: string[] = []
  
  for (const entry of entries) {
    lines.push(entry.index.toString())
    lines.push(`${formatTime(entry.startTime)} --> ${formatTime(entry.endTime)}`)
    lines.push(entry.text)
    lines.push('')  // Ligne vide entre les sous-titres
  }
  
  return lines.join('\n')
}

// Génération du fichier VTT (WebVTT) en plus
export function generateVTT(entries: SubtitleEntry[]): string {
  const lines: string[] = ['WEBVTT', '']
  
  for (const entry of entries) {
    lines.push(`${formatTime(entry.startTime).replace(',', '.')} --> ${formatTime(entry.endTime).replace(',', '.')}`)
    lines.push(entry.text)
    lines.push('')
  }
  
  return lines.join('\n')
}