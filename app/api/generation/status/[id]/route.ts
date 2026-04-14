// AURA & LOGOS - API pour obtenir le statut d'une génération
// GET /api/generation/status/[id]

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de génération manquant' },
        { status: 400 }
      )
    }

    // Récupérer la génération
    const { data: generation, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Génération non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    const userId = session.user.id || session.user.email
    if (generation.user_id !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      topic: generation.topic,
      niche: generation.niche,
      language: generation.language,
      duration: generation.duration,
      createdAt: generation.created_at,
      completedAt: generation.completed_at,
      audioUrl: generation.audio_url,
      srtUrl: generation.srt_url,
      zipUrl: generation.zip_url,
      seoTitle: generation.seo_title,
      seoDescription: generation.seo_description,
      metadata: generation.metadata,
    })

  } catch (error) {
    console.error('Get generation status error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}