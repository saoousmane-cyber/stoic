// AURA & LOGOS - Limiteur pour plan gratuit
// Gestion des restrictions du plan gratuit

import { FREE_TIER_MINUTES_PER_MONTH, FREE_TIER_GENERATIONS_PER_MONTH } from '@/config/constants'

export interface FreeTierLimits {
  maxMinutesPerMonth: number
  maxGenerationsPerMonth: number
  maxDurationPerGeneration: number
  requiresWatermark: boolean
  allowedLanguages: string[]
  allowedNiches: string[]
  maxImagesPerGeneration: number
  exportFormats: string[]
}

export interface GenerationRequest {
  userId: string
  durationMinutes: number
  niche: string
  language: string
  includeImages: boolean
}

export interface LimitCheckResult {
  allowed: boolean
  reason?: 'quota_exceeded' | 'duration_exceeded' | 'generations_exceeded' | 'niche_not_allowed' | 'language_not_allowed'
  remaining?: number
  message?: string
  upgradeRequired?: boolean
}

// Configuration des limites du plan gratuit
export const FREE_LIMITS: FreeTierLimits = {
  maxMinutesPerMonth: FREE_TIER_MINUTES_PER_MONTH,
  maxGenerationsPerMonth: FREE_TIER_GENERATIONS_PER_MONTH,
  maxDurationPerGeneration: 5, // 5 minutes max par génération
  requiresWatermark: true,
  allowedLanguages: ['fr', 'en', 'es', 'de', 'it', 'pt'],
  allowedNiches: ['stoicism', 'meditation', 'history', 'philosophy', 'psychology', 'spirituality', 'self-improvement', 'mythology'],
  maxImagesPerGeneration: 3,
  exportFormats: ['mp3', 'srt'],
}

// Configuration du plan Pro
export const PRO_LIMITS: FreeTierLimits = {
  maxMinutesPerMonth: 1200, // 20 heures
  maxGenerationsPerMonth: 999, // Illimité en pratique
  maxDurationPerGeneration: 60, // 1 heure max
  requiresWatermark: false,
  allowedLanguages: ['fr', 'en', 'es', 'de', 'it', 'pt'],
  allowedNiches: ['stoicism', 'meditation', 'history', 'philosophy', 'psychology', 'spirituality', 'self-improvement', 'mythology'],
  maxImagesPerGeneration: 20,
  exportFormats: ['mp3', 'srt', 'vtt', 'json'],
}

// Obtenir les limites selon le plan
export function getLimitsForPlan(plan: 'free' | 'pro'): FreeTierLimits {
  return plan === 'free' ? FREE_LIMITS : PRO_LIMITS
}

// Vérifier si une génération est autorisée
export async function checkGenerationLimits(
  userId: string,
  request: GenerationRequest,
  currentUsage: {
    minutesUsedThisMonth: number
    generationsCountThisMonth: number
  }
): Promise<LimitCheckResult> {
  const limits = FREE_LIMITS

  // 1. Vérifier la durée par génération
  if (request.durationMinutes > limits.maxDurationPerGeneration) {
    return {
      allowed: false,
      reason: 'duration_exceeded',
      message: `Le plan gratuit permet une durée maximale de ${limits.maxDurationPerGeneration} minutes par vidéo. Passez au plan Pro pour générer des vidéos jusqu'à 60 minutes.`,
      upgradeRequired: true,
    }
  }

  // 2. Vérifier le quota mensuel
  const newTotalMinutes = currentUsage.minutesUsedThisMonth + request.durationMinutes
  if (newTotalMinutes > limits.maxMinutesPerMonth) {
    const remaining = limits.maxMinutesPerMonth - currentUsage.minutesUsedThisMonth
    return {
      allowed: false,
      reason: 'quota_exceeded',
      remaining,
      message: `Vous avez épuisé vos ${limits.maxMinutesPerMonth} minutes gratuites. Il vous reste ${remaining} minute${remaining > 1 ? 's' : ''}. Passez au plan Pro pour continuer.`,
      upgradeRequired: true,
    }
  }

  // 3. Vérifier le nombre de générations
  if (currentUsage.generationsCountThisMonth >= limits.maxGenerationsPerMonth) {
    return {
      allowed: false,
      reason: 'generations_exceeded',
      message: `Le plan gratuit permet ${limits.maxGenerationsPerMonth} génération par mois. Passez au plan Pro pour des générations illimitées.`,
      upgradeRequired: true,
    }
  }

  // 4. Vérifier la niche
  if (!limits.allowedNiches.includes(request.niche)) {
    return {
      allowed: false,
      reason: 'niche_not_allowed',
      message: `Cette niche n'est pas disponible dans le plan gratuit. Passez au plan Pro pour accéder à toutes les niches.`,
      upgradeRequired: true,
    }
  }

  // 5. Vérifier la langue
  if (!limits.allowedLanguages.includes(request.language)) {
    return {
      allowed: false,
      reason: 'language_not_allowed',
      message: `Cette langue n'est pas disponible dans le plan gratuit. Passez au plan Pro pour accéder à toutes les langues.`,
      upgradeRequired: true,
    }
  }

  return { allowed: true }
}

// Obtenir le message d'upsell personnalisé
export function getUpsellMessage(
  reason: LimitCheckResult['reason'],
  remaining?: number,
  language: string = 'fr'
): string {
  const messages: Record<string, Record<string, string>> = {
    quota_exceeded: {
      fr: `🚀 Passez au plan Pro (49€/mois) et bénéficiez de 20 heures de génération par mois, sans filigrane, avec voix HD et images incluses !`,
      en: `🚀 Upgrade to Pro (€49/month) and get 20 hours of generation per month, no watermark, HD voice and images included!`,
      es: `🚀 ¡Actualiza al plan Pro (49€/mes) y obtén 20 horas de generación al mes, sin marca de agua, voz HD e imágenes incluidas!`,
      de: `🚀 Upgrade auf Pro (49€/Monat) und erhalte 20 Stunden Generierung pro Monat, ohne Wasserzeichen, HD-Stimme und Bilder inklusive!`,
      it: `🚀 Passa al piano Pro (49€/mese) e ottieni 20 ore di generazione al mese, senza filigrana, voce HD e immagini incluse!`,
      pt: `🚀 Atualize para o plano Pro (49€/mês) e obtenha 20 horas de geração por mês, sem marca d'água, voz HD e imagens incluídas!`,
    },
    duration_exceeded: {
      fr: `🎬 Passez au plan Pro pour générer des vidéos jusqu'à 60 minutes, sans limite de durée !`,
      en: `🎬 Upgrade to Pro to generate videos up to 60 minutes, with no duration limit!`,
      es: `🎬 ¡Actualiza a Pro para generar videos de hasta 60 minutos, sin límite de duración!`,
      de: `🎬 Upgrade auf Pro, um Videos von bis zu 60 Minuten ohne Zeitlimit zu generieren!`,
      it: `🎬 Passa a Pro per generare video fino a 60 minuti, senza limiti di durata!`,
      pt: `🎬 Atualize para Pro para gerar vídeos de até 60 minutos, sem limite de duração!`,
    },
    generations_exceeded: {
      fr: `📹 Passez au plan Pro pour des générations illimitées et créez autant de contenu que vous voulez !`,
      en: `📹 Upgrade to Pro for unlimited generations and create as much content as you want!`,
      es: `📹 ¡Actualiza a Pro para generaciones ilimitadas y crea todo el contenido que quieras!`,
      de: `📹 Upgrade auf Pro für unbegrenzte Generierungen und erstelle so viele Inhalte wie du möchtest!`,
      it: `📹 Passa a Pro per generazioni illimitate e crea tutto il contenuto che vuoi!`,
      pt: `📹 Atualize para Pro para gerações ilimitadas e crie todo o conteúdo que quiser!`,
    },
    niche_not_allowed: {
      fr: `🌟 Passez au plan Pro pour accéder aux 8 niches, y compris ${getNicheName} !`,
      en: `🌟 Upgrade to Pro to access all 8 niches, including ${getNicheName}!`,
      es: `🌟 ¡Actualiza a Pro para acceder a los 8 nichos, incluyendo ${getNicheName}!`,
      de: `🌟 Upgrade auf Pro, um auf alle 8 Nischen zuzugreifen, einschließlich ${getNicheName}!`,
      it: `🌟 Passa a Pro per accedere a tutte le 8 nicchie, inclusa ${getNicheName}!`,
      pt: `🌟 Atualize para Pro para acessar todos os 8 nichos, incluindo ${getNicheName}!`,
    },
    language_not_allowed: {
      fr: `🌍 Passez au plan Pro pour accéder aux 6 langues disponibles !`,
      en: `🌍 Upgrade to Pro to access all 6 available languages!`,
      es: `🌍 ¡Actualiza a Pro para acceder a los 6 idiomas disponibles!`,
      de: `🌍 Upgrade auf Pro, um auf alle 6 verfügbaren Sprachen zuzugreifen!`,
      it: `🌍 Passa a Pro per accedere a tutte le 6 lingue disponibili!`,
      pt: `🌍 Atualize para Pro para acessar todos os 6 idiomas disponíveis!`,
    },
  }

  const messageMap = messages[reason || 'quota_exceeded'] || messages.quota_exceeded
  return messageMap[language] || messageMap.fr
}

// Helper pour obtenir le nom de niche
function getNicheName(niche?: string): string {
  const names: Record<string, string> = {
    stoicism: 'Stoïcisme',
    meditation: 'Méditation',
    history: 'Histoire',
    philosophy: 'Philosophie',
    psychology: 'Psychologie',
    spirituality: 'Spiritualité',
    'self-improvement': 'Développement personnel',
    mythology: 'Mythologie',
  }
  return niche ? names[niche] || niche : 'cette niche'
}

// Fonction pour formater le message de quota restant
export function formatRemainingMessage(remainingMinutes: number, language: string = 'fr'): string {
  const messages: Record<string, string> = {
    fr: `Il vous reste ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} gratuite${remainingMinutes > 1 ? 's' : ''} ce mois-ci.`,
    en: `You have ${remainingMinutes} free minute${remainingMinutes > 1 ? 's' : ''} left this month.`,
    es: `Te quedan ${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''} gratis este mes.`,
    de: `Du hast diesen Monat noch ${remainingMinutes} kostenlose Minute${remainingMinutes > 1 ? 'n' : ''}.`,
    it: `Ti rimangono ${remainingMinutes} minuto${remainingMinutes > 1 ? 'i' : ''} gratuiti questo mese.`,
    pt: `Você tem ${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''} grátis restantes este mês.`,
  }
  return messages[language] || messages.fr
}