// AURA & LOGOS - Service de génération de script via OpenRouter (Claude 3.5 / GPT-4o mini)

interface ScriptGenerationParams {
  topic: string
  niche: string
  language: string
  durationMinutes: number
  targetWordCount?: number
  tone?: string
  includeCitations?: boolean
}

interface ScriptGenerationResult {
  success: boolean
  script: string
  wordCount: number
  estimatedDuration: number
  sections?: Array<{ title: string; content: string }>
  citations?: string[]
  modelUsed: string
  cost?: number
  error?: string
}

// ~150 mots par minute pour un débit oral naturel
const WORDS_PER_MINUTE = 150

export async function generateScript(params: ScriptGenerationParams): Promise<ScriptGenerationResult> {
  const {
    topic,
    niche,
    language,
    durationMinutes,
    targetWordCount = durationMinutes * WORDS_PER_MINUTE,
    tone,
    includeCitations = false
  } = params

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return {
      success: false,
      script: '',
      wordCount: 0,
      estimatedDuration: 0,
      modelUsed: 'none',
      error: 'OPENROUTER_API_KEY manquante'
    }
  }

  // Construction du prompt
  const systemPrompt = buildSystemPrompt(niche, language, tone)
  const userPrompt = buildUserPrompt(topic, targetWordCount, durationMinutes, includeCitations, language)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'AURA_AND_LOGOS'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',  // Claude 3.5 Sonnet pour la qualité
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: Math.min(targetWordCount * 2, 8000),  // ~2 tokens par mot
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    const script = data.choices[0].message.content

    // Calcul des métriques
    const wordCount = countWords(script, language)
    const estimatedDuration = Math.ceil(wordCount / WORDS_PER_MINUTE)

    // Extraction des citations si demandées
    let citations: string[] | undefined
    if (includeCitations) {
      citations = extractCitations(script)
    }

    // Extraction des sections (titres markdown)
    const sections = extractSections(script)

    return {
      success: true,
      script,
      wordCount,
      estimatedDuration,
      sections,
      citations,
      modelUsed: 'claude-3.5-sonnet',
      cost: calculateCost(wordCount, 'claude-3.5-sonnet')
    }

  } catch (error) {
    console.error('Script generation error:', error)
    return {
      success: false,
      script: '',
      wordCount: 0,
      estimatedDuration: 0,
      modelUsed: 'claude-3.5-sonnet',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

// Version économique avec GPT-4o mini (fallback)
export async function generateScriptEconomy(params: ScriptGenerationParams): Promise<ScriptGenerationResult> {
  // Même structure mais avec GPT-4o mini (moins cher)
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return {
      success: false,
      script: '',
      wordCount: 0,
      estimatedDuration: 0,
      modelUsed: 'none',
      error: 'OPENROUTER_API_KEY manquante'
    }
  }

  const { topic, niche, language, durationMinutes, targetWordCount = durationMinutes * WORDS_PER_MINUTE, tone } = params

  const systemPrompt = buildSystemPrompt(niche, language, tone)
  const userPrompt = buildUserPrompt(topic, targetWordCount, durationMinutes, false, language)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'AURA_AND_LOGOS'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: Math.min(targetWordCount * 2, 8000)
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const script = data.choices[0].message.content
    const wordCount = countWords(script, language)
    const estimatedDuration = Math.ceil(wordCount / WORDS_PER_MINUTE)

    return {
      success: true,
      script,
      wordCount,
      estimatedDuration,
      modelUsed: 'gpt-4o-mini',
      cost: calculateCost(wordCount, 'gpt-4o-mini')
    }

  } catch (error) {
    return {
      success: false,
      script: '',
      wordCount: 0,
      estimatedDuration: 0,
      modelUsed: 'gpt-4o-mini',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }
  }
}

// Fonctions utilitaires privées
function buildSystemPrompt(niche: string, language: string, tone?: string): string {
  const nicheStyles: Record<string, string> = {
    stoicism: 'Calme, réfléchi, autoritaire mais bienveillant. Citations de Sénèque, Épictète ou Marc Aurèle.',
    meditation: 'Apaisant, lent, enveloppant. Phrases courtes, rythme respiratoire.',
    history: 'Narratif, captivant, précis. Dates et anecdotes marquantes.',
    philosophy: 'Profond, accessible, stimulant. Concepts expliqués simplement.',
    psychology: 'Informatif, bienveillant, pratique. Exemples concrets.',
    spirituality: 'Poétique, ouvert, universel. Évite tout dogme religieux.',
    'self-improvement': 'Motivant, structuré, actionable. Étapes claires.',
    mythology: 'Épique, imagé, captivant. Personnages et symboles forts.'
  }

  const defaultTone = nicheStyles[niche] || 'Professionnel, clair, engageant.'
  const finalTone = tone || defaultTone

  return `Tu es un expert en rédaction de scripts pour vidéos YouTube dans la niche "${niche}".

TON ET STYLE : ${finalTone}

RÈGLES ABSOLUES :
- Écris pour être DIT (oral), pas lu (écrit). Phrases courtes, rythme naturel.
- Structure : Introduction accrocheuse (10-15%) → Développement (70-80%) → Conclusion puissante (10%)
- Pas de jargon technique inutile
- Inclus des "hooks" toutes les 30-45 secondes pour maintenir l'attention
- Termine par un appel à l'action subtil ("abonne-toi" suggéré mais pas agressif)

LANGUE : ${language.toUpperCase()}

Génère uniquement le script, sans commentaires ni annotations.`
}

function buildUserPrompt(
  topic: string, 
  targetWordCount: number, 
  durationMinutes: number, 
  includeCitations: boolean,
  language: string
): string {
  let prompt = `Génère un script vidéo de ${durationMinutes} minutes (environ ${targetWordCount} mots) sur le sujet suivant :

SUJET : ${topic}

`

  if (includeCitations) {
    prompt += `FORMAT SPÉCIAL : Inclus des citations avec leurs sources entre [brackets]. Exemple : "Comme disait Sénèque [Lettres à Lucilius]..."\n\n`
  }

  prompt += `Le script doit être en ${language}. Commence directement par le contenu, pas d'introduction.`

  return prompt
}

function countWords(text: string, language: string): number {
  // Pour les langues asiatiques approximatif, sinon split espace
  if (['zh', 'ja', 'ko'].includes(language)) {
    return text.length
  }
  return text.trim().split(/\s+/).length
}

function extractCitations(script: string): string[] {
  const citationRegex = /\[([^\]]+)\]/g
  const citations: string[] = []
  let match
  while ((match = citationRegex.exec(script)) !== null) {
    citations.push(match[1])
  }
  return [...new Set(citations)] // Uniques
}

function extractSections(script: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = []
  const lines = script.split('\n')
  
  let currentTitle = 'Introduction'
  let currentContent: string[] = []
  
  for (const line of lines) {
    // Détection markdown heading
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentContent.length > 0) {
        sections.push({ title: currentTitle, content: currentContent.join('\n') })
      }
      currentTitle = line.replace(/^#+ /, '')
      currentContent = []
    } else if (line.trim()) {
      currentContent.push(line)
    }
  }
  
  if (currentContent.length > 0) {
    sections.push({ title: currentTitle, content: currentContent.join('\n') })
  }
  
  return sections
}

function calculateCost(wordCount: number, model: string): number {
  // Coûts approximatifs OpenRouter (input + output)
  const rates: Record<string, number> = {
    'claude-3.5-sonnet': 0.003,  // ~$0.003 par 1K tokens
    'gpt-4o-mini': 0.00015        // ~$0.00015 par 1K tokens
  }
  const rate = rates[model] || 0.001
  const tokens = wordCount * 1.3  // approximation tokens
  return (tokens / 1000) * rate
}