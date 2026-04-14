// AURA & LOGOS - Middleware global
// Authentification, rate limiting, protection des routes

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques (pas d'authentification requise)
const PUBLIC_ROUTES = [
  '/',
  '/landing',
  '/pricing',
  '/blog',
  '/api/auth',
  '/api/payment/webhook',
  '/api/health',
  '/api/sitemap',
  '/api/robots',
  '/legal',
  '/branding'
]

// Routes API protégées (nécessitent une clé API ou session)
const PROTECTED_API_ROUTES = [
  '/api/generation',
  '/api/user',
  '/api/payment/create-checkout',
  '/api/payment/create-portal'
]

// Routes d'administration (nécessitent un rôle admin)
const ADMIN_ROUTES = [
  '/api/admin',
  '/api/crons'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ============================================
  // 1. Sécurité : Headers de base
  // ============================================
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // ============================================
  // 2. Routes publiques (pas de vérification)
  // ============================================
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response
  }

  // ============================================
  // 3. Vérification de la session
  // ============================================
  const sessionToken = request.cookies.get('next-auth.session-token')
  const sessionTokenSecure = request.cookies.get('__Secure-next-auth.session-token')
  const hasSession = sessionToken || sessionTokenSecure

  if (!hasSession && !pathname.startsWith('/api/auth')) {
    // Rediriger vers login si route protégée
    if (!pathname.startsWith('/api')) {
      const loginUrl = new URL('/api/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Pour les API, retourner 401
    if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.json(
        { error: 'Non authentifié', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
  }

  // ============================================
  // 4. Routes admin (vérification rôle)
  // ============================================
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    // TODO: Vérifier le rôle admin dans la session
    // Pour l'instant, on bloque
    return NextResponse.json(
      { error: 'Accès interdit', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  // ============================================
  // 5. Rate limiting (optionnel - via Upstash Redis)
  // ============================================
  // Implémentation à venir avec @upstash/ratelimit
  
  return response
}
