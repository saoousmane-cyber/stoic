// AURA & LOGOS - API de recherche d'articles de blog
// GET /api/blog/search?q=...&category=...&page=...&limit=...

import { NextRequest, NextResponse } from 'next/server'

// Données mock des articles (à remplacer par une vraie base de données)
const MOCK_ARTICLES = [
  {
    slug: 'comment-creer-videos-stoicisme-ia',
    title: 'Comment créer des vidéos de stoïcisme avec l\'IA',
    excerpt: 'Découvrez comment générer automatiquement des vidéos inspirantes sur le stoïcisme en quelques minutes.',
    content: 'Le stoïcisme connaît un regain d\'intérêt sur les réseaux sociaux...',
    author: 'Jean Dupont',
    date: '2024-01-15',
    readTime: 5,
    category: 'Tutoriel',
    tags: ['stoïcisme', 'IA', 'vidéo'],
  },
  {
    slug: 'guide-complet-voix-off-ia',
    title: 'Guide complet de la voix off IA pour créateurs',
    excerpt: 'Tout ce que vous devez savoir pour créer des voix off naturelles et professionnelles.',
    content: 'La voix off est un élément crucial de vos vidéos...',
    author: 'Marie Martin',
    date: '2024-01-10',
    readTime: 8,
    category: 'Guide',
    tags: ['voix off', 'IA', 'audio'],
  },
  {
    slug: 'optimiser-seo-videos-youtube',
    title: 'Optimiser le SEO de vos vidéos YouTube',
    excerpt: 'Les meilleures pratiques pour référencer vos vidéos et gagner en visibilité.',
    content: 'Le SEO est essentiel pour que vos vidéos soient trouvées...',
    author: 'Pierre Durand',
    date: '2024-01-05',
    readTime: 6,
    category: 'SEO',
    tags: ['SEO', 'YouTube', 'visibilité'],
  },
  {
    slug: 'niches-contenu-rentables-2024',
    title: 'Les niches de contenu les plus rentables en 2024',
    excerpt: 'Analyse des niches qui fonctionnent le mieux sur YouTube et les réseaux sociaux.',
    content: 'Certaines niches sont plus rentables que d\'autres...',
    author: 'Sophie Bernard',
    date: '2024-01-01',
    readTime: 7,
    category: 'Stratégie',
    tags: ['niches', 'rentabilité', 'stratégie'],
  },
  {
    slug: 'automatiser-creation-contenu',
    title: 'Comment automatiser votre création de contenu',
    excerpt: 'Les outils et méthodes pour produire plus de contenu en moins de temps.',
    content: 'L\'automatisation est la clé pour scale votre production...',
    author: 'Thomas Petit',
    date: '2023-12-20',
    readTime: 10,
    category: 'Productivité',
    tags: ['automatisation', 'productivité', 'outils'],
  },
  {
    slug: 'mediations-guidees-ia',
    title: 'Créer des méditations guidées avec l\'IA',
    excerpt: 'Guide pratique pour générer des séances de méditation apaisantes.',
    content: 'La méditation guidée est très populaire sur YouTube...',
    author: 'Julie Moreau',
    date: '2023-12-15',
    readTime: 5,
    category: 'Tutoriel',
    tags: ['méditation', 'bien-être', 'IA'],
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.toLowerCase() || ''
    const category = searchParams.get('category') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    let results = [...MOCK_ARTICLES]

    // Filtrer par recherche textuelle
    if (query) {
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filtrer par catégorie
    if (category !== 'all') {
      results = results.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Pagination
    const total = results.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedResults = results.slice(start, end)

    return NextResponse.json({
      success: true,
      results: paginatedResults.map(article => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        date: article.date,
        readTime: article.readTime,
        category: article.category,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

  } catch (error) {
    console.error('Blog search error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    )
  }
}