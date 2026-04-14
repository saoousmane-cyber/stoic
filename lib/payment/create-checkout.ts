// AURA & LOGOS - Création de session Checkout Stripe
// Gestion des abonnements Pro

import { getStripeClient, STRIPE_PRICES, createStripeCustomer } from './stripe-client'

export interface CheckoutSessionParams {
  userId: string
  email: string
  name?: string
  successUrl: string
  cancelUrl: string
  priceId?: string
}

export interface CheckoutSessionResult {
  url: string
  sessionId: string
}

// Créer une session de checkout pour l'abonnement Pro
export async function createProCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
  const stripe = getStripeClient()
  const priceId = params.priceId || STRIPE_PRICES.PRO_MONTHLY
  
  if (!priceId) {
    throw new Error('STRIPE_PRICE_PRO_MONTHLY is not defined')
  }
  
  // Récupérer ou créer un customer Stripe
  let customerId: string | undefined
  
  try {
    // Chercher un customer existant
    const customers = await stripe.customers.list({
      email: params.email,
      limit: 1,
    })
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      customerId = await createStripeCustomer(params.email, params.name)
    }
  } catch (error) {
    console.error('Customer retrieval error:', error)
    customerId = await createStripeCustomer(params.email, params.name)
  }
  
  // Créer la session de checkout
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
      email: params.email,
    },
    subscription_data: {
      metadata: {
        userId: params.userId,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
      name: 'auto',
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

// Créer une session de checkout pour un paiement unique (optionnel)
export async function createOneTimeCheckoutSession(params: CheckoutSessionParams & { amount: number }): Promise<CheckoutSessionResult> {
  const stripe = getStripeClient()
  
  let customerId: string | undefined
  
  try {
    const customers = await stripe.customers.list({
      email: params.email,
      limit: 1,
    })
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      customerId = await createStripeCustomer(params.email, params.name)
    }
  } catch (error) {
    customerId = await createStripeCustomer(params.email, params.name)
  }
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'AURA & LOGOS - Pack de crédits',
            description: 'Crédits de génération supplémentaires',
          },
          unit_amount: params.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      email: params.email,
      type: 'one-time',
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