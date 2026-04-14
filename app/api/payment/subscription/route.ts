// AURA & LOGOS - API de gestion de l'abonnement
// GET /api/payment/subscription - Récupérer l'abonnement
// DELETE /api/payment/subscription - Annuler l'abonnement

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getStripeClient } from '@/lib/payment/stripe-client'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Récupérer l'abonnement
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email

    // Récupérer l'utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, stripe_subscription_id, stripe_customer_id')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json(
        { plan: 'free', status: 'inactive' }
      )
    }

    // Si pas d'abonnement Stripe
    if (!user?.stripe_subscription_id) {
      return NextResponse.json({
        plan: user?.plan || 'free',
        status: 'inactive',
      })
    }

    // Récupérer les détails Stripe
    const stripe = getStripeClient()
    const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id)

    return NextResponse.json({
      plan: user?.plan || 'free',
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionId: subscription.id,
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'abonnement' },
      { status: 500 }
    )
  }
}

// DELETE - Annuler l'abonnement
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email

    // Récupérer l'utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single()

    if (error || !user?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'Aucun abonnement actif' },
        { status: 404 }
      )
    }

    // Annuler l'abonnement Stripe (à la fin de la période)
    const stripe = getStripeClient()
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    // Mettre à jour la base de données
    await supabase
      .from('users')
      .update({
        subscription_cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    return NextResponse.json({
      success: true,
      message: 'Abonnement annulé avec succès (actif jusqu\'à la fin de la période)',
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de l\'abonnement' },
      { status: 500 }
    )
  }
}