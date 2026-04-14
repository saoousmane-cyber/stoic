// AURA & LOGOS - Génération du sitemap.xml
// GET /api/sitemap

import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://auraandlogos.com'

// Pages statiques
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: 'pricing', priority: 0.9, changefreq: 'weekly' },
  { path: 'blog', priority: 0.8, changefreq: 'daily' },
  { path: 'dashboard', priority: 0.7, changefreq: 'weekly' },
  { path: 'legal/terms', priority: 0.3, changefreq: 'monthly' },
  { path: 'legal/privacy', priority: 0.3, changefreq: 'monthly' },
  { path: 'legal/cookies', priority: 0.3, changefreq: 'monthly' },
  { path: 'legal/mentions-legales', priority: 0.3, changefreq: 'monthly' },
]

// Articles de blog (mock - à remplacer par une vraie récupération)
const blogPosts = [
  { slug: 'comment-creer-videos-stoicisme-ia', date: '2024-01-15' },
  { slug: 'guide-complet-voix-off-ia', date: '2024-01-10' },
  { slug: 'optimiser-seo-videos-youtube', date: '2024-01-05' },
  { slug: 'niches-contenu-rentables-2024', date: '2024-01-01' },
  { slug: 'automatiser-creation-contenu', date: '2023-12-20' },
  { slug: 'mediations-guidees-ia', date: '2023-12-15' },
]

function generateSitemapXML(): string {
  const now = new Date().toISOString()
  const urls: string[] = []

  // Pages statiques
  for (const page of staticPages) {
    urls.push(`
    <url>
      <loc>${BASE_URL}/${page.path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`)
  }

  // Articles de blog
  for (const post of blogPosts) {
    urls.push(`
    <url>
      <loc>${BASE_URL}/blog/${post.slug}</loc>
      <lastmod>${post.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`
}

export async function GET() {
  const xml = generateSitemapXML()
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}