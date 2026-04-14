// AURA & LOGOS - API de gestion d'une génération spécifique
// GET /api/user/generations/[id] - Récupérer une génération
// DELETE /api/user/generations/[id] - Supprimer une génération

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Récupérer une génération spécifique
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

    const userId = session.user.id || session.user.email
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de génération manquant' },
        { status: 400 }
      )
    }

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
    if (generation.user_id !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: generation.id,
      topic: generation.topic,
      niche: generation.niche,
      language: generation.language,
      duration: generation.duration,
      status: generation.status,
      script: generation.script,
      audioUrl: generation.audio_url,
      srtUrl: generation.srt_url,
      zipUrl: generation.zip_url,
      seoTitle: generation.seo_title,
      seoDescription: generation.seo_description,
      metadata: generation.metadata,
      createdAt: generation.created_at,
      completedAt: generation.completed_at,
    })

  } catch (error) {
    console.error('Get generation error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une génération
export async function DELETE(
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

    const userId = session.user.id || session.user.email
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID de génération manquant' },
        { status: 400 }
      )
    }

    // Vérifier que la génération existe et appartient à l'utilisateur
    const { data: generation, error: fetchError } = await supabase
      .from('generations')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !generation) {
      return NextResponse.json(
        { error: 'Génération non trouvée' },
        { status: 404 }
      )
    }

    if (generation.user_id !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Supprimer la génération
    const { error: deleteError } = await supabase
      .from('generations')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: 'Génération supprimée avec succès',
    })

  } catch (error) {
    console.error('Delete generation error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}