// AURA & LOGOS - Gestion des quotas utilisateur
// Suivi et mise à jour des minutes utilisées

import { createClient } from '@supabase/supabase-js'
import { FREE_TIER_MINUTES_PER_MONTH, PRO_TIER_MINUTES_PER_MONTH } from '@/config/constants'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface UserQuota {
  userId: string
  email: string
  plan: 'free' | 'pro'
  quotaUsed: number      // Minutes utilisées ce mois
  quotaLimit: number     // Minutes max autorisées
  quotaResetDate: string // Date de remise à zéro
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

// Récupérer les quotas d'un utilisateur
export async function getUserQuota(userId: string): Promise<UserQuota | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as UserQuota
  } catch (error) {
    console.error('Get user quota error:', error)
    return null
  }
}

// Récupérer les quotas par email
export async function getUserQuotaByEmail(email: string): Promise<UserQuota | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data as UserQuota
  } catch (error) {
    console.error('Get user quota by email error:', error)
    return null
  }
}

// Vérifier si l'utilisateur peut générer X minutes
export async function canGenerate(userId: string, requestedMinutes: number): Promise<{
  allowed: boolean
  remaining: number
  message?: string
}> {
  const quota = await getUserQuota(userId)
  
  if (!quota) {
    return { allowed: false, remaining: 0, message: 'Utilisateur non trouvé' }
  }
  
  // Vérifier si le quota doit être réinitialisé (nouveau mois)
  const resetDate = new Date(quota.quotaResetDate)
  const now = new Date()
  
  if (now >= resetDate) {
    // Réinitialiser le quota
    await resetUserQuota(userId, quota.plan)
    return { allowed: true, remaining: quota.quotaLimit, message: 'Quota réinitialisé' }
  }
  
  const remaining = quota.quotaLimit - quota.quotaUsed
  
  if (requestedMinutes > remaining) {
    return { 
      allowed: false, 
      remaining,
      message: `Minutes insuffisantes. Il vous reste ${remaining} minute${remaining > 1 ? 's' : ''}.`
    }
  }
  
  return { allowed: true, remaining }
}

// Mettre à jour le quota après une génération
export async function incrementUserQuota(userId: string, minutesUsed: number): Promise<boolean> {
  try {
    // Récupérer le quota actuel
    const quota = await getUserQuota(userId)
    if (!quota) return false
    
    const newUsed = quota.quotaUsed + minutesUsed
    
    const { error } = await supabase
      .from('users')
      .update({ 
        quota_used: newUsed,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) throw error
    
    // Journaliser l'utilisation (pour analytics)
    await supabase.from('usage_logs').insert({
      user_id: userId,
      minutes_used: minutesUsed,
      plan: quota.plan,
      created_at: new Date().toISOString(),
    })
    
    return true
  } catch (error) {
    console.error('Increment user quota error:', error)
    return false
  }
}

// Réinitialiser le quota (début de mois ou changement de plan)
export async function resetUserQuota(userId: string, plan: 'free' | 'pro'): Promise<boolean> {
  try {
    const newLimit = plan === 'free' ? FREE_TIER_MINUTES_PER_MONTH : PRO_TIER_MINUTES_PER_MONTH
    const newResetDate = new Date()
    newResetDate.setMonth(newResetDate.getMonth() + 1)
    
    const { error } = await supabase
      .from('users')
      .update({
        quota_used: 0,
        quota_limit: newLimit,
        quota_reset_date: newResetDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Reset user quota error:', error)
    return false
  }
}

// Mettre à jour le plan de l'utilisateur (après paiement)
export async function updateUserPlan(
  userId: string, 
  plan: 'free' | 'pro',
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<boolean> {
  try {
    const newLimit = plan === 'free' ? FREE_TIER_MINUTES_PER_MONTH : PRO_TIER_MINUTES_PER_MONTH
    
    const updateData: any = {
      plan,
      quota_limit: newLimit,
      updated_at: new Date().toISOString(),
    }
    
    if (stripeCustomerId) updateData.stripe_customer_id = stripeCustomerId
    if (stripeSubscriptionId) updateData.stripe_subscription_id = stripeSubscriptionId
    
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
    
    if (error) throw error
    
    // Réinitialiser le quota lors du passage à Pro
    if (plan === 'pro') {
      await resetUserQuota(userId, 'pro')
    }
    
    return true
  } catch (error) {
    console.error('Update user plan error:', error)
    return false
  }
}

// Obtenir le nombre de minutes restantes (avec mise en cache Redis)
export async function getRemainingMinutes(userId: string): Promise<number> {
  const quota = await getUserQuota(userId)
  if (!quota) return 0
  
  const remaining = quota.quotaLimit - quota.quotaUsed
  return Math.max(0, remaining)
}

// Vérifier et appliquer les limites de taux (rate limiting)
export async function checkRateLimit(userId: string, action: 'generation' | 'api'): Promise<{
  allowed: boolean
  retryAfter?: number
}> {
  // Utiliser Upstash Redis pour le rate limiting
  // Implémentation simplifiée pour Phase 1
  
  const limits = {
    generation: { max: 5, window: 60 * 60 }, // 5 par heure
    api: { max: 60, window: 60 }, // 60 par minute
  }
  
  const limit = limits[action]
  const key = `ratelimit:${action}:${userId}`
  
  // TODO: Implémenter avec Redis
  // const { success, reset } = await redis.ratelimit(key, limit)
  
  return { allowed: true }
}