// AURA & LOGOS - API de création de checkout avec redirection vers page de succès

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createProCheckoutSession } from '@/lib/payment/create-checkout'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const { successUrl, cancelUrl } = await request.json()
    
    // URL par défaut si non fournies
    const finalSuccessUrl = successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
    const finalCancelUrl = cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
    
    const checkout = await createProCheckoutSession({
      userId: session.user.id || session.user.email,
      email: session.user.email,
      name: session.user.name || undefined,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
    })
    
    return NextResponse.json({
      url: checkout.url,
      sessionId: checkout.sessionId,
    })
    
  } catch (error) {
    console.error('Create checkout error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}