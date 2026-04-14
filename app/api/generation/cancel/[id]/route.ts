// AURA & LOGOS - API pour annuler une génération en cours
// DELETE /api/generation/cancel/[id]

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Stockage des annulations en mémoire (à remplacer par Redis en production)
const cancelledGenerations = new Set<string>()

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

    // Vérifier que la génération est encore annulable
    if (generation.status !== 'pending' && generation.status !== 'processing') {
      return NextResponse.json(
        { error: 'Cette génération ne peut plus être annulée' },
        { status: 400 }
      )
    }

    // Marquer comme annulée
    cancelledGenerations.add(id)

    // Mettre à jour le statut dans la base de données
    await supabase
      .from('generations')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString(),
        metadata: {
          ...generation.metadata,
          cancelled_at: new Date().toISOString(),
          cancelled_by: userId,
        },
      })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      message: 'Génération annulée avec succès',
      generationId: id,
    })

  } catch (error) {
    console.error('Cancel generation error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour vérifier si une génération est annulée
export function isGenerationCancelled(generationId: string): boolean {
  return cancelledGenerations.has(generationId)
}