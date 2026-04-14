// AURA & LOGOS - Client Stripe
// Initialisation et configuration Stripe
// AURA & LOGOS - Client Stripe (sans apiVersion explicite)

import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined')
    }
    
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  }
  return stripeInstance
}

// ... reste du code identique

// Configuration des prix Stripe
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
}

// Configuration du webhook
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

// Fonction pour créer un customer Stripe
export async function createStripeCustomer(email: string, name?: string): Promise<string> {
  const stripe = getStripeClient()
  
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'aura-and-logos',
    },
  })
  
  return customer.id
}

// Fonction pour récupérer un customer
export async function getStripeCustomer(customerId: string): Promise<Stripe.Customer | null> {
  const stripe = getStripeClient()
  
  try {
    return await stripe.customers.retrieve(customerId) as Stripe.Customer
  } catch (error) {
    console.error('Get customer error:', error)
    return null
  }
}

// Fonction pour annuler un abonnement
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const stripe = getStripeClient()
  
  try {
    await stripe.subscriptions.cancel(subscriptionId)
    return true
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return false
  }
}

// Fonction pour créer un portail client
export async function createCustomerPortal(customerId: string, returnUrl: string): Promise<string> {
  const stripe = getStripeClient()
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  
  return session.url
}