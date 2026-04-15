// AURA & LOGOS - API de recherche d'images (Pixabay + Pexels)
// GET /api/images/search?q=...&niche=...&page=...&limit=...
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'

// Mapping niche -> mots-clés par défaut
const NICHE_KEYWORDS: Record<string, string[]> = {
  stoicism: ['statue', 'ancient', 'roman', 'philosophy', 'dark aesthetic', 'marble'],
  meditation: ['meditation', 'zen', 'nature', 'calm', 'mindfulness', 'sunset'],
  history: ['ancient', 'historical', 'battle', 'castle', 'old map', 'vintage'],
  philosophy: ['thinker', 'library', 'ancient text', 'sculpture', 'contemplation'],
  psychology: ['brain', 'mind', 'neuron', 'abstract', 'human', 'emotion'],
  spirituality: ['spiritual', 'energy', 'universe', 'light', 'cosmic', 'sacred'],
  'self-improvement': ['success', 'motivation', 'goal', 'climbing', 'mountain', 'focus'],
  mythology: ['mythology', 'god', 'legend', 'mythical', 'ancient', 'fantasy'],
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    let query = searchParams.get('q') || ''
    const niche = searchParams.get('niche') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const orientation = searchParams.get('orientation') || 'horizontal'

    if (!query && niche !== 'all') {
      // Utiliser les mots-clés par défaut de la niche
      const nicheKeywords = NICHE_KEYWORDS[niche]
      if (nicheKeywords) {
        query = nicheKeywords.slice(0, 2).join(' ')
      }
    }

    if (!query) {
      return NextResponse.json({
        success: true,
        images: [],
        total: 0,
        message: 'Veuillez entrer un terme de recherche',
      })
    }

    // Recherche sur Pixabay
    const pixabayApiKey = process.env.PIXABAY_API_KEY
    let images: any[] = []
    let total = 0

    if (pixabayApiKey) {
      const orientationParam = orientation === 'horizontal' ? 'horizontal' : orientation === 'vertical' ? 'vertical' : 'all'
      const pixabayUrl = new URL('https://pixabay.com/api/')
      pixabayUrl.searchParams.append('key', pixabayApiKey)
      pixabayUrl.searchParams.append('q', encodeURIComponent(query))
      pixabayUrl.searchParams.append('image_type', 'photo')
      pixabayUrl.searchParams.append('orientation', orientationParam)
      pixabayUrl.searchParams.append('per_page', limit.toString())
      pixabayUrl.searchParams.append('page', page.toString())
      pixabayUrl.searchParams.append('safesearch', 'true')
      pixabayUrl.searchParams.append('min_width', '1280')
      pixabayUrl.searchParams.append('min_height', '720')

      const response = await fetch(pixabayUrl.toString())
      const data = await response.json()

      if (data.hits) {
        images = data.hits.map((hit: any) => ({
          id: `pixabay-${hit.id}`,
          url: hit.largeImageURL || hit.webformatURL,
          previewUrl: hit.previewURL,
          author: hit.user,
          source: 'pixabay',
          width: hit.imageWidth,
          height: hit.imageHeight,
          tags: hit.tags?.split(', ') || [],
        }))
        total = data.totalHits || 0
      }
    }

    // Fallback sur Pexels si Pixabay n'a pas assez de résultats
    if (images.length < limit && process.env.PEXELS_API_KEY) {
      const pexelsApiKey = process.env.PEXELS_API_KEY
      const orientationParam = orientation === 'horizontal' ? 'landscape' : orientation === 'vertical' ? 'portrait' : 'square'
      const pexelsUrl = new URL('https://api.pexels.com/v1/search')
      pexelsUrl.searchParams.append('query', query)
      pexelsUrl.searchParams.append('per_page', (limit - images.length).toString())
      pexelsUrl.searchParams.append('page', page.toString())
      pexelsUrl.searchParams.append('orientation', orientationParam)
      pexelsUrl.searchParams.append('size', 'large')

      const response = await fetch(pexelsUrl.toString(), {
        headers: { 'Authorization': pexelsApiKey },
      })
      const data = await response.json()

      if (data.photos) {
        const pexelsImages = data.photos.map((photo: any) => ({
          id: `pexels-${photo.id}`,
          url: photo.src.original,
          previewUrl: photo.src.medium,
          author: photo.photographer,
          source: 'pexels',
          width: photo.width,
          height: photo.height,
          tags: photo.alt?.split(' ') || [],
        }))
        images = [...images, ...pexelsImages]
        total = Math.max(total, data.total_results || 0)
      }
    }

    return NextResponse.json({
      success: true,
      images,
      total,
      page,
      limit,
      query,
    })

  } catch (error) {
    console.error('Image search error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche d\'images' },
      { status: 500 }
    )
  }
}