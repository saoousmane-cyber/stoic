// AURA & LOGOS - Webhook Stripe
// Gestion des événements Stripe (paiements, abonnements)

import Stripe from 'stripe'
import { getStripeClient, STRIPE_WEBHOOK_SECRET } from './stripe-client'
import { updateUserPlan, resetUserQuota, getUserQuotaByEmail } from '../quota/user-quota'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface WebhookEvent {
  type: string
  data: {
    object: any
  }
}

// Traitement principal du webhook
export async function handleStripeWebhook(body: Buffer, signature: string): Promise<{ received: boolean; type?: string }> {
  const stripe = getStripeClient()
  
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err)
    throw new Error('Invalid signature')
  }
  
  console.log(`Processing webhook: ${event.type}`)
  
  // Traitement selon le type d'événement
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
      
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice)
      break
      
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
      break
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
      
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
  
  return { received: true, type: event.type }
}

// Checkout complété (premier paiement)
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, email } = session.metadata || {}
  
  if (!userId || !email) {
    console.error('Missing metadata in checkout session')
    return
  }
  
  console.log(`Checkout completed for user: ${email}`)
  
  // Mettre à jour le plan de l'utilisateur
  const updated = await updateUserPlan(
    userId,
    'pro',
    session.customer as string,
    session.subscription as string
  )
  
  if (updated) {
    console.log(`User ${email} upgraded to Pro`)
    
    // Envoyer un email de confirmation
    await sendUpgradeConfirmationEmail(email, session.customer as string)
  }
}

// Facture payée (renouvellement mensuel)
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  const customerId = invoice.customer as string
  
  console.log(`Invoice paid for subscription: ${subscriptionId}`)
  
  // Récupérer l'utilisateur via le customer Stripe
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .single()
  
  if (user) {
    // Réinitialiser le quota pour le nouveau mois
    await resetUserQuota(user.id, 'pro')
    console.log(`Quota reset for user: ${user.email}`)
    
    // Envoyer un email de confirmation de renouvellement
    await sendRenewalConfirmationEmail(user.email)
  }
}

// Échec de paiement
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  console.log(`Payment failed for customer: ${customerId}`)
  
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .single()
  
  if (user) {
    // Envoyer un email d'alerte
    await sendPaymentFailedEmail(user.email)
    
    // Option: rétrograder après X jours d'échec
    // await downgradeAfterGracePeriod(user.id)
  }
}

// Abonnement modifié
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const status = subscription.status
  
  console.log(`Subscription ${subscription.id} status: ${status}`)
  
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .single()
  
  if (user && status !== 'active' && status !== 'trialing') {
    // Rétrograder l'utilisateur si l'abonnement n'est plus actif
    await updateUserPlan(user.id, 'free')
    console.log(`User ${user.email} downgraded to free`)
    
    // Envoyer un email de notification
    await sendDowngradeNotificationEmail(user.email, status)
  }
}

// Abonnement supprimé
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  console.log(`Subscription deleted for customer: ${customerId}`)
  
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .single()
  
  if (user) {
    await updateUserPlan(user.id, 'free')
    console.log(`User ${user.email} downgraded to free (subscription deleted)`)
    
    await sendSubscriptionCancelledEmail(user.email)
  }
}

// Fonctions d'envoi d'emails (à implémenter avec Resend)
async function sendUpgradeConfirmationEmail(email: string, customerId: string): Promise<void> {
  console.log(`Sending upgrade confirmation email to ${email}`)
  // TODO: Implémenter avec Resend
}

async function sendRenewalConfirmationEmail(email: string): Promise<void> {
  console.log(`Sending renewal confirmation email to ${email}`)
  // TODO: Implémenter avec Resend
}

async function sendPaymentFailedEmail(email: string): Promise<void> {
  console.log(`Sending payment failed email to ${email}`)
  // TODO: Implémenter avec Resend
}

async function sendDowngradeNotificationEmail(email: string, reason: string): Promise<void> {
  console.log(`Sending downgrade notification email to ${email} (reason: ${reason})`)
  // TODO: Implémenter avec Resend
}

async function sendSubscriptionCancelledEmail(email: string): Promise<void> {
  console.log(`Sending subscription cancelled email to ${email}`)
  // TODO: Implémenter avec Resend
}