// AURA & LOGOS - Webhook Stripe
// POST /api/payment/webhook

import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/lib/payment/stripe-webhook'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }
    
    const result = await handleStripeWebhook(Buffer.from(body), signature)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}

// Désactiver le body parser pour Stripe (nécessite le raw body)
export const config = {
  api: {
    bodyParser: false,
  },
}