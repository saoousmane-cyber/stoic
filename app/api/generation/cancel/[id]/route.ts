import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const cancelledGenerations = new Set<string>()

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { id } = await params

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

    const userId = session.user.id || session.user.email
    if (generation.user_id !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    if (generation.status !== 'pending' && generation.status !== 'processing') {
      return NextResponse.json(
        { error: 'Cette génération ne peut plus être annulée' },
        { status: 400 }
      )
    }

    cancelledGenerations.add(id)

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

export function isGenerationCancelled(generationId: string): boolean {
  return cancelledGenerations.has(generationId)
}