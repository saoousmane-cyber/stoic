// AURA & LOGOS - Webhook Resend pour suivre les statuts d'emails
// POST /api/email/webhook

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body
    
    console.log(`Resend webhook: ${type}`, data)
    
    // Traiter les différents types d'événements
    switch (type) {
      case 'email.delivered':
        console.log(`Email delivered to ${data.to}`)
        break
      case 'email.bounced':
        console.error(`Email bounced for ${data.to}: ${data.reason}`)
        // Stocker pour nettoyer la liste d'emails
        break
      case 'email.complained':
        console.warn(`Email complained for ${data.to}`)
        break
      case 'email.opened':
        console.log(`Email opened by ${data.to}`)
        break
      case 'email.clicked':
        console.log(`Link clicked by ${data.to}`)
        break
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}