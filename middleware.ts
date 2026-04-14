// AURA & LOGOS - Middleware global
// Authentification, rate limiting, protection des routes, logging

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

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
  '/branding',
  '/pricing',
]

// Routes API protégées
const PROTECTED_API_ROUTES = [
  '/api/generate',
  '/api/user',
  '/api/payment/create-checkout',
  '/api/payment/create-portal',
  '/api/free/check-limits',
]

// Routes dashboard (redirection si non authentifié)
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/',
  '/dashboard/generation',
  '/dashboard/settings',
  '/dashboard/billing',
]

// Routes admin (réservées)
const ADMIN_ROUTES = [
  '/api/admin',
  '/api/crons',
]

// Whitelist d'IPs pour les webhooks (sécurité)
const WEBHOOK_IPS = [
  '54.187.174.169',  // Stripe
  '54.187.205.235',  // Stripe
  '54.187.216.72',   // Stripe
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const startTime = Date.now()

  // ============================================
  // 1. Logging des requêtes (développement)
  // ============================================
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`)
  }

  // ============================================
  // 2. Headers de sécurité
  // ============================================
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')
  
  // CSP en production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.openai.com https://openrouter.ai https://*.supabase.co https://api.pixabay.com https://api.pexels.com"
    )
  }

  // ============================================
  // 3. Routes publiques (pas de vérification)
  // ============================================
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    // Ajouter cache pour les assets statiques
    if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|webp)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }
    return response
  }

  // ============================================
  // 4. Vérification de la session
  // ============================================
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isAuthenticated = !!token

  // Routes dashboard : rediriger vers login si non authentifié
  if (DASHBOARD_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/api/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // ============================================
  // 5. Routes API protégées
  // ============================================
  if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Non authentifié', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
    return response
  }

  // ============================================
  // 6. Routes admin (vérification rôle)
  // ============================================
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    // Vérifier si l'utilisateur est admin
    const isAdmin = token?.role === 'admin' || token?.email === process.env.ADMIN_EMAIL
    
    if (!isAuthenticated || !isAdmin) {
      return NextResponse.json(
        { error: 'Accès interdit', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }
    return response
  }

  // ============================================
  // 7. Rate limiting (API uniquement)
  // ============================================
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/webhook')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const key = `ratelimit:${ip}:${pathname}`
    
    // Rate limit: 60 requêtes par minute par IP
    // TODO: Implémenter avec Upstash Redis
    // const { success, limit, reset, remaining } = await ratelimit.limit(key)
    
    // Pour l'instant, on passe
    // response.headers.set('X-RateLimit-Limit', limit.toString())
    // response.headers.set('X-RateLimit-Remaining', remaining.toString())
    // response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
    
    // if (!success) {
    //   return NextResponse.json(
    //     { error: 'Trop de requêtes', code: 'RATE_LIMITED' },
    //     { status: 429 }
    //   )
    // }
  }

  // ============================================
  // 8. Webhook IP whitelist (optionnel)
  // ============================================
  if (pathname === '/api/payment/webhook') {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    
    if (process.env.NODE_ENV === 'production' && clientIp && !WEBHOOK_IPS.includes(clientIp)) {
      console.warn(`Webhook blocked from IP: ${clientIp}`)
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }
  }

  // ============================================
  // 9. Ajout du temps de réponse en dev
  // ============================================
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - startTime
    response.headers.set('X-Response-Time', `${duration}ms`)
  }

  return response
}
