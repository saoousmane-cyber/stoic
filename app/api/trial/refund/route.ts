// AURA & LOGOS - API pour rembourser l'essai prépayé
// POST /api/trial/refund

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { refundPrepaidTrial } from '@/lib/trial/prepaid-trial'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id || session.user.email
    const result = await refundPrepaidTrial(userId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: result.message,
    })
    
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du remboursement' },
      { status: 500 }
    )
  }
}