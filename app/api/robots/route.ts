// AURA & LOGOS - Génération du robots.txt
// GET /api/robots

import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://auraandlogos.com'

export async function GET() {
  const robotsTxt = `# AURA & LOGOS - Robots.txt
# https://auraandlogos.com/robots.txt

User-agent: *
Allow: /
Allow: /pricing
Allow: /blog
Allow: /dashboard

Disallow: /api/
Disallow: /auth/
Disallow: /dashboard/settings
Disallow: /dashboard/billing
Disallow: /dashboard/trial
Disallow: /legal/

Sitemap: ${BASE_URL}/sitemap.xml

# Crawl delay pour respecter les serveurs
Crawl-delay: 1

# Bloquer les bots indésirables
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Google-Extended
Disallow: /

# Spécifique Google
User-agent: Googlebot
Allow: /
Allow: /pricing
Allow: /blog
Disallow: /api/
Disallow: /auth/

# Spécifique Bing
User-agent: bingbot
Allow: /
Disallow: /api/
Disallow: /auth/

# Spécifique Yandex
User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /auth/

# Spécifique DuckDuckGo
User-agent: DuckDuckBot
Allow: /
Disallow: /api/
Disallow: /auth/
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}