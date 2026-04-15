// AURA & LOGOS - API proxy pour Plausible Analytics
// POST /api/analytics/plausible
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, referrer, props } = body

    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
    const plausibleApiKey = process.env.PLAUSIBLE_API_KEY

    if (!plausibleDomain) {
      // Mode développement : juste logger
      console.log('[Plausible Event]', { name, url, referrer, props })
      return NextResponse.json({ success: true, mock: true })
    }

    // Envoyer l'événement à Plausible
    const response = await fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
      },
      body: JSON.stringify({
        name,
        url: url || request.headers.get('referer') || `https://${plausibleDomain}`,
        referrer: referrer || request.headers.get('referer') || '',
        props: props || {},
      }),
    })

    return NextResponse.json({ success: response.ok })

  } catch (error) {
    console.error('Plausible proxy error:', error)
    // Ne pas bloquer l'utilisateur si analytics échoue
    return NextResponse.json({ success: false, error: 'Analytics failed' }, { status: 500 })
  }
}

// GET - Récupérer les statistiques (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Vérifier que l'utilisateur est admin (à configurer)
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const plausibleApiKey = process.env.PLAUSIBLE_API_KEY
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

    if (!plausibleApiKey || !plausibleDomain) {
      return NextResponse.json({ error: 'Plausible non configuré' }, { status: 503 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '30d'
    const metrics = searchParams.get('metrics')?.split(',') || ['visitors', 'pageviews', 'bounce_rate', 'visit_duration']

    const url = new URL('https://plausible.io/api/v1/stats/aggregate')
    url.searchParams.append('site_id', plausibleDomain)
    url.searchParams.append('period', period)
    url.searchParams.append('metrics', metrics.join(','))

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${plausibleApiKey}`,
      },
    })

    const data = await response.json()

    return NextResponse.json(data)

  } catch (error) {
    console.error('Get Plausible stats error:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des stats' }, { status: 500 })
  }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
