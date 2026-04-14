// AURA & LOGOS - Checkout Stripe avec essai gratuit intégré

import { getStripeClient, createStripeCustomer } from './stripe-client'
import { startFreeTrial } from '../free-trial/trial-manager'

export interface TrialCheckoutParams {
  userId: string
  userEmail: string
  userName?: string
  successUrl: string
  cancelUrl: string
}

// Créer une session checkout qui démarre un essai gratuit
export async function createTrialCheckoutSession(params: TrialCheckoutParams): Promise<{
  url: string
  sessionId: string
}> {
  const stripe = getStripeClient()
  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY
  
  if (!priceId) {
    throw new Error('STRIPE_PRICE_PRO_MONTHLY is not defined')
  }
  
  // Démarrer l'essai gratuit dans la base de données
  // startFreeTrial ne prend que userId et userEmail
  const trial = await startFreeTrial(params.userId, params.userEmail)
  
  if (!trial) {
    throw new Error('Failed to start free trial')
  }
  
  // Créer ou récupérer le customer Stripe
  let customerId: string | undefined
  
  try {
    const customers = await stripe.customers.list({
      email: params.userEmail,
      limit: 1,
    })
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      customerId = await createStripeCustomer(params.userEmail, params.userName)
    }
  } catch (error) {
    customerId = await createStripeCustomer(params.userEmail, params.userName)
  }
  
  // Créer la session checkout avec essai gratuit Stripe de 7 jours
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId: params.userId,
        isTrial: 'true',
        trialQuota: '120',
      },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      email: params.userEmail,
      trialId: trial.id,
      trialQuota: '120',
    },
    allow_promotion_codes: true,
  })
  
  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }
  
  return {
    url: session.url,
    sessionId: session.id,
  }
}

// Créer une session pour convertir un essai existant
export async function createConversionCheckoutSession(params: TrialCheckoutParams): Promise<{
  url: string
  sessionId: string
}> {
  const stripe = getStripeClient()
  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY
  
  if (!priceId) {
    throw new Error('STRIPE_PRICE_PRO_MONTHLY is not defined')
  }
  
  let customerId: string | undefined
  
  try {
    const customers = await stripe.customers.list({
      email: params.userEmail,
      limit: 1,
    })
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      customerId = await createStripeCustomer(params.userEmail, params.userName)
    }
  } catch (error) {
    customerId = await createStripeCustomer(params.userEmail, params.userName)
  }
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      email: params.userEmail,
      conversionFromTrial: 'true',
    },
  })
  
  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }
  
  return {
    url: session.url,
    sessionId: session.id,
  }
}