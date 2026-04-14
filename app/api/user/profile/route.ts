// AURA & LOGOS - API de gestion du profil utilisateur
// GET /api/user/profile - Récupérer le profil
// PUT /api/user/profile - Mettre à jour le profil
// DELETE /api/user/profile - Supprimer le compte

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'
import { getStripeClient } from '@/lib/payment/stripe-client'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Récupérer le profil
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

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      plan: user.plan,
      quotaUsed: user.quota_used,
      quotaLimit: user.quota_limit,
      createdAt: user.created_at,
      stripeCustomerId: user.stripe_customer_id,
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le profil
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email
    const body = await request.json()
    const { name, image, preferences } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }
    
    if (name !== undefined) updateData.name = name
    if (image !== undefined) updateData.image = image
    if (preferences !== undefined) updateData.preferences = preferences

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès',
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer le compte
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
    const userEmail = session.user.email

    // Récupérer les informations Stripe
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single()

    // Annuler l'abonnement Stripe si existant
    if (user?.stripe_subscription_id) {
      try {
        const stripe = getStripeClient()
        await stripe.subscriptions.cancel(user.stripe_subscription_id)
      } catch (stripeError) {
        console.error('Stripe cancellation error:', stripeError)
      }
    }

    // Supprimer les données de l'utilisateur
    await supabase.from('generations').delete().eq('user_id', userId)
    await supabase.from('usage_logs').delete().eq('user_id', userId)
    await supabase.from('user_bonuses').delete().eq('user_id', userId)
    await supabase.from('prepaid_trials').delete().eq('user_id', userId)
    await supabase.from('trials').delete().eq('user_id', userId)
    await supabase.from('payment_failures').delete().eq('user_id', userId)
    await supabase.from('users').delete().eq('id', userId)

    console.log(`User account deleted: ${userEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Compte supprimé avec succès',
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du compte' },
      { status: 500 }
    )
  }
}