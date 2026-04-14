// AURA & LOGOS - Bonus de 2h offertes APRÈS paiement
// Stratégie: 2h offertes valables 7 jours
// - L'utilisateur paie → reçoit 2h bonus
// - Utilise les 2h pendant 7 jours max
// - Si les 2h sont finies avant 7 jours → abonnement commence
// - Si 7 jours passent → abonnement commence

import { createClient } from '@supabase/supabase-js'
import { startFreeTrial, activateSubscriptionAfterTrial } from './trial-manager'
import { incrementTrialQuota } from './trial-quota'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const BONUS_CONFIG = {
  BONUS_MINUTES: 120, // 2 heures offertes
  BONUS_VALIDITY_DAYS: 7, // valable 7 jours
}

// Ajouter le bonus à un utilisateur qui vient de payer
// Cette fonction est appelée APRÈS le paiement réussi
export async function addWelcomeBonus(
  userId: string, 
  userEmail: string
): Promise<boolean> {
  try {
    // Vérifier si l'utilisateur a déjà reçu son bonus
    const { data: existingBonus } = await supabase
      .from('user_bonuses')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'welcome_bonus')
      .single()

    if (existingBonus) {
      console.log(`User ${userId} already received welcome bonus`)
      return false
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + BONUS_CONFIG.BONUS_VALIDITY_DAYS)

    // Créer le bonus
    const { error: bonusError } = await supabase
      .from('user_bonuses')
      .insert({
        user_id: userId,
        type: 'welcome_bonus',
        minutes: BONUS_CONFIG.BONUS_MINUTES,
        minutes_used: 0,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      })

    if (bonusError) throw bonusError

    // Démarrer l'essai gratuit (période de 7 jours avec 2h)
    await startFreeTrial(userId, userEmail)

    console.log(`Welcome bonus of ${BONUS_CONFIG.BONUS_MINUTES} minutes added to user ${userId}`)
    
    return true
  } catch (error) {
    console.error('Add welcome bonus error:', error)
    return false
  }
}

// Utiliser les minutes du bonus (décrémenter le quota)
export async function useBonusMinutes(userId: string, minutesUsed: number): Promise<{
  success: boolean
  remainingMinutes: number
  trialExhausted: boolean
}> {
  try {
    // Incrémenter le quota d'essai
    const result = await incrementTrialQuota(userId, minutesUsed)
    
    // Mettre à jour le bonus utilisé
    const { data: bonus } = await supabase
      .from('user_bonuses')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'welcome_bonus')
      .single()

    if (bonus) {
      const newUsed = (bonus.minutes_used || 0) + minutesUsed
      await supabase
        .from('user_bonuses')
        .update({
          minutes_used: newUsed,
        })
        .eq('id', bonus.id)
    }
    
    const remaining = await getRemainingBonusMinutes(userId)
    
    return {
      success: result.success,
      remainingMinutes: remaining,
      trialExhausted: result.trialExhausted,
    }
  } catch (error) {
    console.error('Use bonus minutes error:', error)
    return { success: false, remainingMinutes: 0, trialExhausted: false }
  }
}

// Vérifier les bonus disponibles pour un utilisateur
export async function getUserBonuses(userId: string): Promise<{
  hasWelcomeBonus: boolean
  welcomeBonusRemaining: number
  welcomeBonusTotal: number
  welcomeBonusExpiresAt: Date | null
  trialActive: boolean
  trialRemainingMinutes: number
  trialRemainingDays: number
}> {
  try {
    // Récupérer le bonus
    const { data: bonus } = await supabase
      .from('user_bonuses')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'welcome_bonus')
      .single()

    // Récupérer le trial
    const { data: trial } = await supabase
      .from('trials')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    const now = new Date()
    let hasBonus = false
    let remainingBonus = 0
    let expiresAt = null

    if (bonus) {
      expiresAt = new Date(bonus.expires_at)
      const isValid = now < expiresAt
      remainingBonus = isValid ? (bonus.minutes - (bonus.minutes_used || 0)) : 0
      hasBonus = isValid && remainingBonus > 0
    }

    let trialActive = false
    let trialRemainingMinutes = 0
    let trialRemainingDays = 0

    if (trial && trial.status === 'active') {
      trialActive = true
      trialRemainingMinutes = Math.max(0, (trial.quota_limit || 120) - (trial.quota_used || 0))
      const expiresAtDate = new Date(trial.expires_at)
      trialRemainingDays = Math.max(0, Math.ceil((expiresAtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    }

    return {
      hasWelcomeBonus: hasBonus,
      welcomeBonusRemaining: remainingBonus,
      welcomeBonusTotal: bonus?.minutes || 120,
      welcomeBonusExpiresAt: expiresAt,
      trialActive,
      trialRemainingMinutes,
      trialRemainingDays,
    }
  } catch (error) {
    console.error('Get user bonuses error:', error)
    return {
      hasWelcomeBonus: false,
      welcomeBonusRemaining: 0,
      welcomeBonusTotal: 120,
      welcomeBonusExpiresAt: null,
      trialActive: false,
      trialRemainingMinutes: 0,
      trialRemainingDays: 0,
    }
  }
}

// Obtenir les minutes restantes du bonus
export async function getRemainingBonusMinutes(userId: string): Promise<number> {
  const bonuses = await getUserBonuses(userId)
  return bonuses.welcomeBonusRemaining
}

// Vérifier si l'utilisateur a un bonus actif
export async function hasActiveBonus(userId: string): Promise<boolean> {
  const bonuses = await getUserBonuses(userId)
  return bonuses.hasWelcomeBonus
}