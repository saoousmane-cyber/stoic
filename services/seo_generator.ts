// AURA & LOGOS - Générateur SEO (title, description, tags, thumbnail prompt)

interface SEOGenerationParams {
  topic: string
  niche: string
  script: string
  language: string
  targetPlatform?: 'youtube' | 'tiktok' | 'instagram' | 'podcast'
}

interface SEOBundle {
  title: string
  description: string
  tags: string[]
  hashtags: string[]
  thumbnailPrompt: string
  suggestedFilename: string
  seoScore: number
}

export async function generateSEO(params: SEOGenerationParams): Promise<SEOBundle> {
  const { topic, niche, script, language, targetPlatform = 'youtube' } = params

  // Extraction des mots-clés du script
  const keywords = extractKeywords(script, niche)
  
  // Génération du title
  const title = generateTitle(topic, niche, keywords, targetPlatform)
  
  // Génération de la description
  const description = generateDescription(script, niche, keywords)
  
  // Génération des tags
  const tags = generateTags(topic, niche, keywords, targetPlatform)
  
  // Hashtags pour réseaux sociaux
  const hashtags = generateHashtags(niche, keywords)
  
  // Prompt pour génération thumbnail IA
  const thumbnailPrompt = generateThumbnailPrompt(topic, niche)
  
  // Nom de fichier suggéré
  const suggestedFilename = generateFilename(topic, niche, language)
  
  // Score SEO estimé
  const seoScore = calculateSEOScore(title, description, tags)

  return {
    title,
    description,
    tags,
    hashtags,
    thumbnailPrompt,
    suggestedFilename,
    seoScore
  }
}

function extractKeywords(script: string, niche: string): string[] {
  // Extraction simple : mots fréquents (stop words exclus)
  const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or', 'ce', 'cet', 'cette', 'ces', 'mon', 'ton', 'son', 'notre', 'votre', 'leur', 'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'y', 'en', 'a', 'est', 'sont', 'était', 'étaient', 'sera', 'seront'])
  
  const words = script.toLowerCase().match(/[a-zéèêëàâäôöûüç]+/g) || []
  const frequency: Record<string, number> = {}
  
  for (const word of words) {
    if (!stopWords.has(word) && word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1
    }
  }
  
  const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1])
  const topKeywords = sorted.slice(0, 8).map(([word]) => word)
  
  // Ajout de mots-clés spécifiques à la niche
  const nicheKeywords: Record<string, string[]> = {
    stoicism: ['stoïcisme', 'philosophie', 'sagesse', 'résilience', 'sérénité'],
    meditation: ['méditation', 'pleine conscience', 'relaxation', 'calme intérieur'],
    history: ['histoire', 'civilisation', 'antiquité', 'découverte', 'chronologie'],
    philosophy: ['philosophie', 'pensée', 'concept', 'éthique', 'métaphysique'],
    psychology: ['psychologie', 'comportement', 'esprit', 'émotion', 'cognition'],
    spirituality: ['spiritualité', 'conscience', 'énergie', 'éveil', 'âme'],
    'self-improvement': ['développement personnel', 'productivité', 'objectif', 'habitude'],
    mythology: ['mythologie', 'légende', 'mythe', 'héros', 'divinité']
  }
  
  const nicheSpecific = nicheKeywords[niche] || []
  const allKeywords = [...new Set([...topKeywords, ...nicheSpecific])]
  
  return allKeywords.slice(0, 12)
}

function generateTitle(topic: string, niche: string, keywords: string[], platform: string): string {
  const templates: Record<string, string[]> = {
    youtube: [
      `${topic} : ${keywords[0]} et ${keywords[1]} | ${niche.charAt(0).toUpperCase() + niche.slice(1)}`,
      `${topic} (${keywords.slice(0, 3).join(', ')})`,
      `${topic} : Ce que personne ne vous dit`,
      `${topic} en ${Math.floor(Math.random() * 10) + 5} minutes`,
      `${topic} - ${keywords[0]} expliqué simplement`
    ],
    tiktok: [
      `${topic} en 60 secondes ⚡`,
      `La vérité sur ${topic} 🧵`,
      `${topic} : @toi`,
      `POV : ${topic}`
    ],
    instagram: [
      `${topic} ✨`,
      `${topic} : inspiration quotidienne`,
      `Et si tu découvrais ${topic} ?`
    ],
    podcast: [
      `#${Math.floor(Math.random() * 100) + 1} - ${topic}`,
      `${topic} | ${niche.charAt(0).toUpperCase() + niche.slice(1)}`,
      `${topic} : ${keywords[0]} et ${keywords[1]}`
    ]
  }
  
  const platformTemplates = templates[platform] || templates.youtube
  return platformTemplates[Math.floor(Math.random() * platformTemplates.length)]
}

function generateDescription(script: string, niche: string, keywords: string[]): string {
  const intro = script.split('\n').slice(0, 3).join(' ').substring(0, 200)
  
  const description = `📜 ${intro}...

✨ Dans cette vidéo, nous explorons :
${keywords.slice(0, 5).map(k => `• ${k}`).join('\n')}

🎯 À propos de ${niche.charAt(0).toUpperCase() + niche.slice(1)} :
[Description de la chaîne]

🔔 Abonne-toi pour plus de contenu inspirant.

#${keywords[0]} #${niche} #développementpersonnel`

  return description.substring(0, 5000)
}

function generateTags(topic: string, niche: string, keywords: string[], platform: string): string[] {
  const baseTags = [niche, topic, ...keywords.slice(0, 5)]
  const platformTags: Record<string, string[]> = {
    youtube: ['vidéo YouTube', 'contenu créateur', 'automatisation'],
    tiktok: ['fyp', 'pourtoi', 'tiktokviral'],
    instagram: ['reels', 'explore', 'instagood'],
    podcast: ['podcast', 'spotify', 'applepodcasts']
  }
  
  const specificTags = platformTags[platform] || platformTags.youtube
  return [...new Set([...baseTags, ...specificTags])].slice(0, 15)
}

function generateHashtags(niche: string, keywords: string[]): string[] {
  const nicheHashtags: Record<string, string[]> = {
    stoicism: ['stoicisme', 'philosophie', 'sagesse', 'resilience'],
    meditation: ['meditation', 'pleineconscience', 'bienetre', 'calme'],
    history: ['histoire', 'civilisation', 'antiquite', 'culture'],
    philosophy: ['philosophie', 'pensee', 'reflexion', 'connaissance'],
    psychology: ['psychologie', 'esprit', 'comportement', 'mental'],
    spirituality: ['spiritualite', 'conscience', 'eveil', 'ame'],
    'self-improvement': ['developpementpersonnel', 'productivite', 'objectif', 'reussite'],
    mythology: ['mythologie', 'legende', 'mythe', 'hero']
  }
  
  const nicheTags = nicheHashtags[niche] || [niche]
  const mainHashtags = nicheTags.slice(0, 3)
  const keywordHashtags = keywords.slice(0, 3).map(k => k.replace(/\s/g, ''))
  
  return [...new Set([...mainHashtags, ...keywordHashtags])].slice(0, 10)
}

function generateThumbnailPrompt(topic: string, niche: string): string {
  const styles: Record<string, string> = {
    stoicism: 'statue grecque ancienne, tons sombres et dorés, éclairage dramatique',
    meditation: 'personne méditant au coucher de soleil, couleurs chaudes, paisible',
    history: 'scène historique épique, tons sépia, texture vieillie',
    philosophy: 'personnage pensif devant un paysage mystique, tons bleutés',
    psychology: 'cerveau ou esprit abstrait, couleurs vibrantes, moderne',
    spirituality: 'lumière cosmique, auras, tons violets et dorés',
    'self-improvement': 'personne qui gravit une montagne, tons dynamiques',
    mythology: 'créature mythique, tons épiques, ambiance fantastique'
  }
  
  const style = styles[niche] || 'atmosphérique et inspirant'
  
  return `Génère une miniature YouTube pour une vidéo sur "${topic}". Style : ${style}. Texte visible sur l'image : "${topic.substring(0, 40)}". Format 16:9, haute résolution.`
}

function generateFilename(topic: string, niche: string, language: string): string {
  const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 40)
  const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  return `${niche}-${safeTopic}-${language}-${date}`
}

function calculateSEOScore(title: string, description: string, tags: string[]): number {
  let score = 70  // score de base
  
  // Bonus pour title bien dimensionné
  if (title.length >= 40 && title.length <= 70) score += 5
  else if (title.length < 30) score -= 5
  
  // Bonus pour description assez longue
  if (description.length >= 200 && description.length <= 5000) score += 5
  
  // Bonus pour tags en quantité optimale
  if (tags.length >= 5 && tags.length <= 15) score += 5
  else if (tags.length > 20) score -= 5
  
  return Math.min(100, Math.max(0, score))
}