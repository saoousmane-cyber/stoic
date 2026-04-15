// AURA & LOGOS - API de vérification des limites plan gratuit
// GET /api/free/check-limits - Vérifier si l'utilisateur peut générer
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { checkGenerationLimits, getLimitsForPlan, formatRemainingMessage } from '@/lib/free_plan/free_limiter'
import { getUserQuotaByEmail } from '@/lib/quota/user-quota'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié', requiresLogin: true },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const durationMinutes = parseInt(searchParams.get('duration') || '5')
    const niche = searchParams.get('niche') || 'stoicism'
    const language = searchParams.get('language') || 'fr'
    const includeImages = searchParams.get('images') === 'true'

    // Récupérer le quota utilisateur
    const quota = await getUserQuotaByEmail(session.user.email)
    
    if (!quota) {
      return NextResponse.json(
        { error: 'Quota non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier les limites
    const limits = getLimitsForPlan(quota.plan)
    const checkResult = await checkGenerationLimits(
      quota.userId,
      { userId: quota.userId, durationMinutes, niche, language, includeImages },
      {
        minutesUsedThisMonth: quota.quotaUsed,
        generationsCountThisMonth: 0, // TODO: Récupérer depuis DB
      }
    )

    const remaining = limits.maxMinutesPerMonth - quota.quotaUsed

    return NextResponse.json({
      allowed: checkResult.allowed,
      plan: quota.plan,
      used: quota.quotaUsed,
      limit: quota.quotaLimit,
      remaining: Math.max(0, remaining),
      remainingMessage: formatRemainingMessage(Math.max(0, remaining), language),
      watermarkRequired: quota.plan === 'free' && limits.requiresWatermark,
      limits: {
        maxDuration: limits.maxDurationPerGeneration,
        maxMinutesPerMonth: limits.maxMinutesPerMonth,
        allowedLanguages: limits.allowedLanguages,
        allowedNiches: limits.allowedNiches,
      },
      ...(checkResult.allowed ? {} : {
        error: checkResult.message,
        upgradeRequired: checkResult.upgradeRequired,
        reason: checkResult.reason,
      }),
    })

  } catch (error) {
    console.error('Check limits error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des limites' },
      { status: 500 }
    )
  }
}