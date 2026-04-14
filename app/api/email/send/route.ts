// AURA & LOGOS - API d'envoi d'emails (interne)
// POST /api/email/send

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/email-service'

export async function POST(request: NextRequest) {
  try {
    // Vérifier la clé API pour la sécurité
    const authHeader = request.headers.get('authorization')
    const expectedKey = process.env.CRON_SECRET_KEY
    
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const { to, subject, html, from } = await request.json()
    
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }
    
    const success = await sendEmail({ to, subject, html, from })
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    )
  }
}