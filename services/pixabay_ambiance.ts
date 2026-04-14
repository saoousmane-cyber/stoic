// AURA & LOGOS - Service d'images d'ambiance (Pixabay + fallback Pexels)

interface ImageSearchParams {
  query: string
  niche?: string
  count?: number
  orientation?: 'horizontal' | 'vertical' | 'all'
  minWidth?: number
  minHeight?: number
}

interface ImageResult {
  id: number
  url: string
  previewUrl: string
  downloadUrl: string
  author: string
  width: number
  height: number
  source: 'pixabay' | 'pexels'
}

interface ImageSearchResult {
  success: boolean
  images: ImageResult[]
  total: number
  error?: string
}

// Mapping niche -> mots-clés par défaut
const NICHE_KEYWORDS: Record<string, string[]> = {
  stoicism: ['statue', 'ancient', 'roman', 'philosophy', 'dark aesthetic', 'marble'],
  meditation: ['meditation', 'zen', 'nature', 'calm', 'mindfulness', 'sunset'],
  history: ['ancient', 'historical', 'battle', 'castle', 'old map', 'vintage'],
  philosophy: ['thinker', 'library', 'ancient text', 'sculpture', 'contemplation'],
  psychology: ['brain', 'mind', 'neuron', 'abstract', 'human', 'emotion'],
  spirituality: ['spiritual', 'energy', 'universe', 'light', 'cosmic', 'sacred'],
  'self-improvement': ['success', 'motivation', 'goal', 'climbing', 'mountain', 'focus'],
  mythology: ['mythology', 'god', 'legend', 'mythical', 'ancient', 'fantasy']
}

const DEFAULT_IMAGES_COUNT = 20

export async function searchImages(params: ImageSearchParams): Promise<ImageSearchResult> {
  const { query, niche, count = DEFAULT_IMAGES_COUNT, orientation = 'horizontal', minWidth = 1280, minHeight = 720 } = params

  // Construction de la requête enrichie
  let searchQuery = query
  if (niche && NICHE_KEYWORDS[niche]) {
    const nicheKeywords = NICHE_KEYWORDS[niche]
    searchQuery = `${query} ${nicheKeywords.slice(0, 2).join(' ')}`
  }

  // Essayer Pixabay d'abord
  const pixabayResult = await searchPixabay(searchQuery, count, orientation, minWidth, minHeight)
  if (pixabayResult.success && pixabayResult.images.length >= count / 2) {
    return pixabayResult
  }

  // Fallback sur Pexels
  const pexelsResult = await searchPexels(searchQuery, count, orientation, minWidth, minHeight)
  if (pexelsResult.success) {
    return pexelsResult
  }

  // Si les deux échouent, retourner le meilleur résultat disponible
  return pixabayResult.images.length > 0 ? pixabayResult : pexelsResult
}

async function searchPixabay(
  query: string,
  count: number,
  orientation: string,
  minWidth: number,
  minHeight: number
): Promise<ImageSearchResult> {
  const apiKey = process.env.PIXABAY_API_KEY
  if (!apiKey) {
    return { success: false, images: [], total: 0, error: 'PIXABAY_API_KEY manquante' }
  }

  const orientationParam = orientation === 'horizontal' ? 'horizontal' : orientation === 'vertical' ? 'vertical' : 'all'
  
  const url = new URL('https://pixabay.com/api/')
  url.searchParams.append('key', apiKey)
  url.searchParams.append('q', encodeURIComponent(query))
  url.searchParams.append('image_type', 'photo')
  url.searchParams.append('orientation', orientationParam)
  url.searchParams.append('per_page', count.toString())
  url.searchParams.append('safesearch', 'true')
  url.searchParams.append('min_width', minWidth.toString())
  url.searchParams.append('min_height', minHeight.toString())

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Pixabay HTTP ${response.status}`)
    }

    const data = await response.json()
    
    const images: ImageResult[] = data.hits.map((hit: any) => ({
      id: hit.id,
      url: hit.pageURL,
      previewUrl: hit.previewURL,
      downloadUrl: hit.largeImageURL || hit.webformatURL,
      author: hit.user,
      width: hit.imageWidth,
      height: hit.imageHeight,
      source: 'pixabay'
    }))

    return {
      success: true,
      images,
      total: data.totalHits
    }

  } catch (error) {
    console.error('Pixabay search error:', error)
    return {
      success: false,
      images: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Erreur Pixabay'
    }
  }
}

async function searchPexels(
  query: string,
  count: number,
  orientation: string,
  minWidth: number,
  minHeight: number
): Promise<ImageSearchResult> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) {
    return { success: false, images: [], total: 0, error: 'PEXELS_API_KEY manquante' }
  }

  const orientationParam = orientation === 'horizontal' ? 'landscape' : orientation === 'vertical' ? 'portrait' : 'square'
  
  const url = new URL('https://api.pexels.com/v1/search')
  url.searchParams.append('query', query)
  url.searchParams.append('per_page', count.toString())
  url.searchParams.append('orientation', orientationParam)
  url.searchParams.append('size', 'large')

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': apiKey
      }
    })

    if (!response.ok) {
      throw new Error(`Pexels HTTP ${response.status}`)
    }

    const data = await response.json()
    
    const images: ImageResult[] = data.photos
      .filter((photo: any) => photo.width >= minWidth && photo.height >= minHeight)
      .map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        previewUrl: photo.src.medium,
        downloadUrl: photo.src.original,
        author: photo.photographer,
        width: photo.width,
        height: photo.height,
        source: 'pexels'
      }))

    return {
      success: true,
      images,
      total: data.total_results
    }

  } catch (error) {
    console.error('Pexels search error:', error)
    return {
      success: false,
      images: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Erreur Pexels'
    }
  }
}

// Récupération d'une image unique pour un sujet
export async function getAmbianceImage(topic: string, niche: string): Promise<ImageResult | null> {
  const result = await searchImages({
    query: topic,
    niche,
    count: 5,
    orientation: 'horizontal'
  })

  if (result.success && result.images.length > 0) {
    // Retourne la meilleure image (la plus grande résolution)
    return result.images.sort((a, b) => b.width - a.width)[0]
  }

  // Fallback : image par défaut selon niche
  return getDefaultImageForNiche(niche)
}

function getDefaultImageForNiche(niche: string): ImageResult | null {
  const defaultImages: Record<string, ImageResult> = {
    stoicism: {
      id: 0,
      url: 'https://pixabay.com/photos/marcus-aurelius-statue-philosophy-67877/',
      previewUrl: 'https://cdn.pixabay.com/photo/2015/01/13/21/16/marcus-aurelius-598888_640.jpg',
      downloadUrl: 'https://cdn.pixabay.com/photo/2015/01/13/21/16/marcus-aurelius-598888_1280.jpg',
      author: 'PublicDomainPictures',
      width: 1920,
      height: 1280,
      source: 'pixabay'
    },
    meditation: {
      id: 0,
      url: 'https://pixabay.com/photos/meditation-meditate-buddhism-5023880/',
      previewUrl: 'https://cdn.pixabay.com/photo/2020/03/16/10/33/meditation-4936341_640.jpg',
      downloadUrl: 'https://cdn.pixabay.com/photo/2020/03/16/10/33/meditation-4936341_1280.jpg',
      author: 'StockSnap',
      width: 1920,
      height: 1280,
      source: 'pixabay'
    }
  }

  return defaultImages[niche] || null
}