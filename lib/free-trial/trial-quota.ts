// AURA & LOGOS - Gestion des quotas pendant l'essai gratuit

import { createClient } from '@supabase/supabase-js'
import { TRIAL_CONFIG, activateSubscriptionAfterTrial } from './trial-manager'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Incrémenter l'utilisation du quota pendant l'essai
export async function incrementTrialQuota(userId: string, minutesUsed: number): Promise<{
  success: boolean
  trialExhausted: boolean
}> {
  try {
    // Récupérer le trial actuel
    const { data: trial } = await supabase
      .from('trials')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (!trial) {
      return { success: false, trialExhausted: false }
    }
    
    const newQuotaUsed = (trial.quota_used || 0) + minutesUsed
    const isExhausted = newQuotaUsed >= TRIAL_CONFIG.FREE_TRIAL_MINUTES
    
    // Mettre à jour le quota
    await supabase
      .from('trials')
      .update({
        quota_used: newQuotaUsed,
        status: isExhausted ? 'exhausted' : 'active',
      })
      .eq('id', trial.id)
    
    await supabase
      .from('users')
      .update({
        quota_used: newQuotaUsed,
      })
      .eq('id', userId)
    
    // Si l'essai est épuisé, activer l'abonnement immédiatement
    if (isExhausted) {
      await activateSubscriptionAfterTrial(userId)
      console.log(`Trial exhausted for user ${userId}, subscription activated immediately`)
    }
    
    return { success: true, trialExhausted: isExhausted }
  } catch (error) {
    console.error('Increment trial quota error:', error)
    return { success: false, trialExhausted: false }
  }
}

// Obtenir les minutes restantes pendant l'essai
export async function getRemainingTrialMinutes(userId: string): Promise<number> {
  try {
    const { data: trial } = await supabase
      .from('trials')
      .select('quota_used, quota_limit')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (!trial) return 0
    
    return Math.max(0, (trial.quota_limit || TRIAL_CONFIG.FREE_TRIAL_MINUTES) - (trial.quota_used || 0))
  } catch (error) {
    return 0
  }
}

// Vérifier si l'utilisateur a un essai actif
export async function hasActiveTrial(userId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()
    
    return user?.plan === 'trial'
  } catch (error) {
    return false
  }
}

// Obtenir les détails complets de l'essai
export async function getTrialDetails(userId: string): Promise<{
  hasTrial: boolean
  remainingMinutes: number
  totalMinutes: number
  usedMinutes: number
  expiresAt: Date | null
  remainingDays: number
  status: string
} | null> {
  try {
    const { data: trial } = await supabase
      .from('trials')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (!trial) return null
    
    const now = new Date()
    const expiresAt = new Date(trial.expires_at)
    const remainingDays = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    const remainingMinutes = Math.max(0, (trial.quota_limit || 120) - (trial.quota_used || 0))
    
    let status = trial.status
    if (status === 'active' && remainingMinutes <= 0) {
      status = 'exhausted'
    }
    if (status === 'active' && now > expiresAt) {
      status = 'expired'
    }
    
    return {
      hasTrial: status === 'active',
      remainingMinutes,
      totalMinutes: trial.quota_limit || 120,
      usedMinutes: trial.quota_used || 0,
      expiresAt,
      remainingDays,
      status,
    }
  } catch (error) {
    return null
  }
}

// Vérifier si l'essai doit être converti (appel après chaque génération)
export async function checkAndConvertTrial(userId: string): Promise<boolean> {
  const details = await getTrialDetails(userId)
  
  if (!details) return false
  
  // Si plus de minutes restantes, convertir
  if (details.remainingMinutes <= 0 && details.hasTrial) {
    await activateSubscriptionAfterTrial(userId)
    return true
  }
  
  // Si date expirée, convertir
  if (details.expiresAt && new Date() > details.expiresAt && details.hasTrial) {
    await activateSubscriptionAfterTrial(userId)
    return true
  }
  
  return false
}