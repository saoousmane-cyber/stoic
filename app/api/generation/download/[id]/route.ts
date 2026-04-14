// AURA & LOGOS - API de téléchargement d'une génération
// GET /api/generation/download/[id]

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

    const userId = session.user.id || session.user.email
    const { id } = params
    const format = request.nextUrl.searchParams.get('format') || 'zip'

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
    if (generation.user_id !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que la génération est terminée
    if (generation.status !== 'completed') {
      return NextResponse.json(
        { error: 'Génération non terminée' },
        { status: 400 }
      )
    }

    let downloadUrl: string | null = null
    let filename = `generation-${id}`

    switch (format) {
      case 'zip':
        downloadUrl = generation.zip_url
        filename += '.zip'
        break
      case 'audio':
        downloadUrl = generation.audio_url
        filename += '.mp3'
        break
      case 'srt':
        downloadUrl = generation.srt_url
        filename += '.srt'
        break
      case 'vtt':
        downloadUrl = generation.vtt_url
        filename += '.vtt'
        break
      case 'json':
        downloadUrl = generation.json_url
        filename += '.json'
        break
      default:
        downloadUrl = generation.zip_url
        filename += '.zip'
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Fichier non disponible' },
        { status: 404 }
      )
    }

    // Télécharger le fichier depuis l'URL
    const response = await fetch(downloadUrl)
    const buffer = Buffer.from(await response.arrayBuffer())

    // Déterminer le type MIME
    const mimeTypes: Record<string, string> = {
      zip: 'application/zip',
      mp3: 'audio/mpeg',
      srt: 'text/plain',
      vtt: 'text/vtt',
      json: 'application/json',
    }
    const ext = format === 'audio' ? 'mp3' : format
    const mimeType = mimeTypes[ext] || 'application/octet-stream'

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    })

  } catch (error) {
    console.error('Download generation error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
}