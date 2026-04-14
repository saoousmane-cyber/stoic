// AURA & LOGOS - Gestionnaire d'essai gratuit (2h offertes APRÈS paiement)

import { createClient } from '@supabase/supabase-js'
import type { Trial, TrialConfig, TrialStatus } from '@/types/trial'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const TRIAL_CONFIG = {
  FREE_TRIAL_MINUTES: 120,
  FREE_TRIAL_DAYS: 7,
  GRACE_PERIOD_MINUTES: 5,
}

// Démarrer un essai gratuit APRÈS paiement
export async function startFreeTrial(
  userId: string, 
  userEmail: string
): Promise<any | null> {
  try {
    // Vérifier si l'utilisateur a déjà eu un essai
    const { data: existingTrial } = await supabase
      .from('trials')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingTrial) {
      console.log(`User ${userId} already had a trial`)
      return null
    }

    const now = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + TRIAL_CONFIG.FREE_TRIAL_DAYS)

    const trialData = {
      user_id: userId,
      user_email: userEmail,
      status: 'active',
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      quota_used: 0,
      quota_limit: TRIAL_CONFIG.FREE_TRIAL_MINUTES,
    }

    const { data, error } = await supabase
      .from('trials')
      .insert(trialData)
      .select()
      .single()

    if (error) throw error

    // Mettre à jour l'utilisateur avec le plan trial
    await supabase
      .from('users')
      .update({
        plan: 'trial',
        trial_id: data.id,
        trial_expires_at: expiresAt.toISOString(),
        quota_limit: TRIAL_CONFIG.FREE_TRIAL_MINUTES,
        quota_used: 0,
      })
      .eq('id', userId)

    console.log(`Free trial started for user ${userEmail} until ${expiresAt.toISOString()}`)
    
    return data
  } catch (error) {
    console.error('Start free trial error:', error)
    return null
  }
}

// Vérifier le statut d'un essai
export async function getTrialStatus(userId: string) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('plan, trial_id, trial_expires_at, quota_used, quota_limit')
      .eq('id', userId)
      .single()

    if (!user || user.plan !== 'trial') {
      return {
        hasActiveTrial: false,
        remainingMinutes: 0,
        remainingDays: 0,
        expiresAt: null,
        status: null,
      }
    }

    const expiresAt = user.trial_expires_at ? new Date(user.trial_expires_at) : null
    const now = new Date()
    
    let remainingDays = 0
    let status = 'active'
    
    if (expiresAt) {
      remainingDays = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      
      if (now > expiresAt) {
        status = 'expired'
      }
    }
    
    const remainingMinutes = Math.max(0, (user.quota_limit || 120) - (user.quota_used || 0))
    
    if (remainingMinutes <= 0 && status === 'active') {
      status = 'exhausted'
    }
    
    return {
      hasActiveTrial: status === 'active',
      remainingMinutes,
      remainingDays,
      expiresAt,
      status,
    }
  } catch (error) {
    console.error('Get trial status error:', error)
    return {
      hasActiveTrial: false,
      remainingMinutes: 0,
      remainingDays: 0,
      expiresAt: null,
      status: null,
    }
  }
}

// Activer l'abonnement (fin de l'essai)
export async function activateSubscriptionAfterTrial(userId: string): Promise<boolean> {
  try {
    const { data: trial } = await supabase
      .from('trials')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!trial) return false

    await supabase
      .from('trials')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
      })
      .eq('id', trial.id)

    await supabase
      .from('users')
      .update({
        plan: 'pro',
        quota_limit: 1200,
        quota_used: 0,
        trial_id: null,
        trial_expires_at: null,
      })
      .eq('id', userId)

    console.log(`Subscription activated for user ${userId} after trial`)
    return true
  } catch (error) {
    console.error('Activate subscription error:', error)
    return false
  }
}

// Traiter les essais expirés
export async function processExpiredTrials(): Promise<void> {
  try {
    const now = new Date().toISOString()
    
    const { data: expiredByDate } = await supabase
      .from('trials')
      .select('*, users!inner(id, email)')
      .eq('status', 'active')
      .lt('expires_at', now)
    
    for (const trial of expiredByDate || []) {
      await activateSubscriptionAfterTrial(trial.user_id)
      console.log(`Trial expired by date for user ${trial.user_email}`)
    }
    
    const { data: expiredByQuota } = await supabase
      .from('trials')
      .select('*, users!inner(id, email)')
      .eq('status', 'active')
      .gte('quota_used', TRIAL_CONFIG.FREE_TRIAL_MINUTES)
    
    for (const trial of expiredByQuota || []) {
      await activateSubscriptionAfterTrial(trial.user_id)
      console.log(`Trial exhausted by quota for user ${trial.user_email}`)
    }
  } catch (error) {
    console.error('Process expired trials error:', error)
  }
}

export function getTrialUpsellMessage(remainingMinutes: number, remainingDays: number): string {
  if (remainingMinutes <= 0) {
    return `🎁 Votre essai gratuit est terminé ! Votre abonnement Pro (49€/mois) est maintenant actif.`
  }
  
  if (remainingDays <= 1) {
    return `⏰ Plus que ${remainingDays} jour${remainingDays === 1 ? '' : 's'} d'essai ! Profitez de vos ${remainingMinutes} minutes restantes.`
  }
  
  if (remainingMinutes <= 30) {
    return `⚡ Il vous reste ${remainingMinutes} minutes d'essai. L'abonnement démarrera automatiquement après épuisement.`
  }
  
  return `🎉 Profitez de votre essai gratuit : ${remainingMinutes} minutes restantes sur ${TRIAL_CONFIG.FREE_TRIAL_MINUTES} (valable ${remainingDays} jours)`
}