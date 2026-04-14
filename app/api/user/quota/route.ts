// AURA & LOGOS - API de gestion des quotas
// GET /api/user/quota - Récupérer les quotas
// POST /api/user/quota - Mettre à jour (incrémenter)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getUserQuotaByEmail, incrementUserQuota, canGenerate } from '@/lib/quota/user-quota'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const quota = await getUserQuotaByEmail(session.user.email)
    
    if (!quota) {
      return NextResponse.json(
        { error: 'Quota non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      plan: quota.plan,
      used: quota.quotaUsed,
      limit: quota.quotaLimit,
      remaining: quota.quotaLimit - quota.quotaUsed,
      resetDate: quota.quotaResetDate,
    })
    
  } catch (error) {
    console.error('Get quota error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du quota' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const { minutesUsed } = await request.json()
    
    if (!minutesUsed || minutesUsed <= 0) {
      return NextResponse.json(
        { error: 'Minutes invalides' },
        { status: 400 }
      )
    }
    
    // Vérifier si l'utilisateur peut générer
    const quota = await getUserQuotaByEmail(session.user.email)
    if (!quota) {
      return NextResponse.json(
        { error: 'Quota non trouvé' },
        { status: 404 }
      )
    }
    
    const { allowed, remaining, message } = await canGenerate(quota.userId, minutesUsed)
    
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Quota insuffisant',
          remaining,
          message,
          upgradeRequired: quota.plan === 'free' && remaining < minutesUsed,
        },
        { status: 403 }
      )
    }
    
    // Incrémenter le quota
    const success = await incrementUserQuota(quota.userId, minutesUsed)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du quota' },
        { status: 500 }
      )
    }
    
    const updatedQuota = await getUserQuotaByEmail(session.user.email)
    
    return NextResponse.json({
      success: true,
      used: updatedQuota?.quotaUsed,
      limit: updatedQuota?.quotaLimit,
      remaining: (updatedQuota?.quotaLimit || 0) - (updatedQuota?.quotaUsed || 0),
    })
    
  } catch (error) {
    console.error('Update quota error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du quota' },
      { status: 500 }
    )
  }
}