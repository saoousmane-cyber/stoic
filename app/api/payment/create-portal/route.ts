// AURA & LOGOS - API de création du portail client Stripe
// POST /api/payment/create-portal

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getStripeClient } from '@/lib/payment/stripe-client'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email
    const { returnUrl } = await request.json()

    // Récupérer l'utilisateur avec les champs Stripe
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single()

    if (error || !user?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Aucun abonnement actif trouvé' },
        { status: 404 }
      )
    }

    const stripe = getStripeClient()
    
    // Créer le portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({
      url: portalSession.url,
      sessionId: portalSession.id,
    })

  } catch (error) {
    console.error('Create portal error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du portail client' },
      { status: 500 }
    )
  }
}