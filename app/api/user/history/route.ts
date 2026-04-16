// AURA & LOGOS - API d'historique des générations
// GET /api/user/history - Récupérer l'historique
// DELETE /api/user/history - Supprimer tout l'historique


export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const niche = searchParams.get('niche')

    let query = supabase
      .from('generations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (niche && niche !== 'all') {
      query = query.eq('niche', niche)
    }

    const { data: generations, error, count } = await query

    if (error) {
      console.error('History query error:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'historique' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      generations: generations || [],
      total: count || 0,
      limit,
      offset,
    })

  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer tout l'historique
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email

    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'historique' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Historique supprimé avec succès',
    })

  } catch (error) {
    console.error('Delete history error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'historique' },
      { status: 500 }
    )
  }
}