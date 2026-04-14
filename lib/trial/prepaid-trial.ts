// AURA & LOGOS - Période d'essai prépayée (2h / 7 jours)
// L'utilisateur paie, puis reçoit 2h offertes valables 7 jours
// L'abonnement commence quand les 2h sont finies OU après 7 jours

import { createClient } from '@supabase/supabase-js'
import { getStripeClient } from '../payment/stripe-client'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const PREPAID_TRIAL_CONFIG = {
  TRIAL_MINUTES: 120, // 2 heures de création
  TRIAL_DAYS: 7, // 7 jours d'essai
  GRACE_MINUTES: 5, // 5 minutes de grâce après expiration
}

// Démarrer une période d'essai prépayée
export async function startPrepaidTrial(
  userId: string,
  userEmail: string,
  stripeSubscriptionId: string,
  stripeCustomerId: string
): Promise<boolean> {
  try {
    const now = new Date()
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + PREPAID_TRIAL_CONFIG.TRIAL_DAYS)

    // Créer l'essai prépayé
    const { error: trialError } = await supabase
      .from('prepaid_trials')
      .insert({
        user_id: userId,
        user_email: userEmail,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        status: 'active',
        started_at: now.toISOString(),
        ends_at: trialEndsAt.toISOString(),
        quota_limit: PREPAID_TRIAL_CONFIG.TRIAL_MINUTES,
        quota_used: 0,
      })

    if (trialError) throw trialError

    // Mettre à jour l'utilisateur en mode essai
    await supabase
      .from('users')
      .update({
        plan: 'prepaid_trial',
        trial_ends_at: trialEndsAt.toISOString(),
        quota_limit: PREPAID_TRIAL_CONFIG.TRIAL_MINUTES,
        quota_used: 0,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
      })
      .eq('id', userId)

    // Note: L'abonnement Stripe a déjà été créé avec trial_period_days lors du checkout
    // Pas besoin de le mettre à jour ici

    console.log(`Prepaid trial started for ${userEmail} until ${trialEndsAt.toISOString()}`)
    return true
  } catch (error) {
    console.error('Start prepaid trial error:', error)
    return false
  }
}

// Vérifier le statut de l'essai prépayé
export async function getPrepaidTrialStatus(userId: string): Promise<{
  isActive: boolean
  remainingMinutes: number
  remainingDays: number
  endsAt: Date | null
  canRefund: boolean
}> {
  try {
    const { data: trial, error } = await supabase
      .from('prepaid_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !trial) {
      return {
        isActive: false,
        remainingMinutes: 0,
        remainingDays: 0,
        endsAt: null,
        canRefund: false,
      }
    }

    const now = new Date()
    const endsAt = new Date(trial.ends_at)
    const remainingDays = Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    const remainingMinutes = Math.max(0, (trial.quota_limit || 120) - (trial.quota_used || 0))
    const canRefund = remainingDays > 0 && remainingMinutes >= 0

    return {
      isActive: true,
      remainingMinutes,
      remainingDays,
      endsAt,
      canRefund,
    }
  } catch (error) {
    console.error('Get prepaid trial status error:', error)
    return {
      isActive: false,
      remainingMinutes: 0,
      remainingDays: 0,
      endsAt: null,
      canRefund: false,
    }
  }
}

// Utiliser des minutes pendant l'essai
export async function usePrepaidTrialMinutes(userId: string, minutesUsed: number): Promise<boolean> {
  try {
    const { data: trial, error } = await supabase
      .from('prepaid_trials')
      .select('quota_used, quota_limit')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !trial) return false

    const newUsed = (trial.quota_used || 0) + minutesUsed
    const isExhausted = newUsed >= (trial.quota_limit || 120)

    await supabase
      .from('prepaid_trials')
      .update({
        quota_used: newUsed,
        status: isExhausted ? 'exhausted' : 'active',
      })
      .eq('user_id', userId)

    await supabase
      .from('users')
      .update({
        quota_used: newUsed,
      })
      .eq('id', userId)

    // Si l'essai est épuisé, activer l'abonnement immédiatement
    if (isExhausted) {
      await activateSubscriptionAfterTrial(userId)
    }

    return true
  } catch (error) {
    console.error('Use trial minutes error:', error)
    return false
  }
}

// REMBOURSEMENT IMMÉDIAT (annulation pendant la période d'essai)
export async function refundPrepaidTrial(userId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const { data: trial, error } = await supabase
      .from('prepaid_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !trial) {
      return { success: false, message: 'Aucun essai actif trouvé' }
    }

    const now = new Date()
    const endsAt = new Date(trial.ends_at)
    const remainingDays = Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (remainingDays <= 0) {
      return { success: false, message: 'La période de remboursement est expirée' }
    }

    // Remboursement via Stripe
    const stripe = getStripeClient()
    await stripe.subscriptions.cancel(trial.stripe_subscription_id, {
      prorate: true,
    })

    // Remboursement du paiement
    const invoices = await stripe.invoices.list({
      subscription: trial.stripe_subscription_id,
      limit: 1,
    })

    if (invoices.data.length > 0) {
      await stripe.refunds.create({
        charge: invoices.data[0].charge as string,
      })
    }

    // Mettre à jour le statut
    await supabase
      .from('prepaid_trials')
      .update({
        status: 'refunded',
        refunded_at: now.toISOString(),
      })
      .eq('id', trial.id)

    await supabase
      .from('users')
      .update({
        plan: 'free',
        quota_limit: 5,
        quota_used: 0,
        stripe_subscription_id: null,
      })
      .eq('id', userId)

    console.log(`Refund processed for user ${userId}`)
    return { success: true, message: 'Remboursement effectué avec succès' }
  } catch (error) {
    console.error('Refund error:', error)
    return { success: false, message: 'Erreur lors du remboursement' }
  }
}

// Convertir l'essai en abonnement actif (après 7 jours ou épuisement des 2h)
export async function activateSubscriptionAfterTrial(userId: string): Promise<boolean> {
  try {
    const { data: trial, error } = await supabase
      .from('prepaid_trials')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !trial) return false

    // Mettre fin à la période d'essai Stripe
    const stripe = getStripeClient()
    await stripe.subscriptions.update(trial.stripe_subscription_id, {
      trial_end: 'now',
    })

    // Mettre à jour l'utilisateur
    await supabase
      .from('users')
      .update({
        plan: 'pro',
        quota_limit: 1200, // 20h par mois
        quota_used: 0,
      })
      .eq('id', userId)

    await supabase
      .from('prepaid_trials')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
      })
      .eq('id', trial.id)

    console.log(`Subscription activated for user ${userId}`)
    return true
  } catch (error) {
    console.error('Activate subscription error:', error)
    return false
  }
}