// AURA & LOGOS - Webhook Stripe
// POST /api/payment/webhook

import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/lib/payment/stripe-webhook'
// Désactiver le body parser pour Stripe
export const dynamic = 'force-static'
export const runtime = 'nodejs'
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

