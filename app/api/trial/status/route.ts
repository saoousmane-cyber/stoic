// AURA & LOGOS - API pour le statut de l'essai prépayé
// GET /api/trial/prepaid-status
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getPrepaidTrialStatus } from '@/lib/trial/prepaid-trial'

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
    const status = await getPrepaidTrialStatus(userId)
    
    return NextResponse.json(status)
    
  } catch (error) {
    console.error('Prepaid trial status error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}