// AURA & LOGOS - Rate limiting avec Upstash Redis

import { Redis } from '@upstash/redis'
import { getRedisClient } from '../cache/redis'

export interface RateLimitConfig {
  /**
   * Nombre maximum de requêtes autorisées
   */
  limit: number
  
  /**
   * Fenêtre de temps en secondes
   */
  window: number
  
  /**
   * Identifiant unique pour le rate limit (ex: IP, userId)
   */
  identifier: string
  
  /**
   * Préfixe pour la clé Redis
   */
  prefix?: string
}

export interface RateLimitResult {
  /**
   * Si la requête est autorisée
   */
  success: boolean
  
  /**
   * Limite totale
   */
  limit: number
  
  /**
   * Requêtes restantes
   */
  remaining: number
  
  /**
   * Temps avant réinitialisation (en secondes)
   */
  reset: number
  
  /**
   * Nombre de requêtes dans la fenêtre actuelle
   */
  current: number
}

// Rate limiter basé sur le sliding window
export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const { limit, window: windowSeconds, identifier, prefix = 'ratelimit' } = config
  const redis = getRedisClient()
  
  const key = `${prefix}:${identifier}`
  const now = Date.now()
  const windowStart = now - windowSeconds * 1000
  
  try {
    // Utiliser Lua script pour atomicité (sliding window)
    const script = `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local window = tonumber(ARGV[2])
      local limit = tonumber(ARGV[3])
      
      -- Nettoyer les entrées expirées
      redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
      
      -- Compter les entrées dans la fenêtre
      local current = redis.call('ZCARD', key)
      
      if current < limit then
        -- Ajouter la nouvelle entrée
        redis.call('ZADD', key, now, now)
        redis.call('EXPIRE', key, math.ceil(window / 1000))
        return {1, limit, limit - (current + 1), math.ceil((now + window - now) / 1000), current + 1}
      else
        -- Obtenir la plus ancienne entrée pour le reset
        local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
        local reset = 0
        if #oldest > 0 then
          reset = math.ceil((tonumber(oldest[2]) + window - now) / 1000)
        end
        return {0, limit, 0, reset, current}
      end
    `
    
    const result = await redis.eval(
      script,
      [key],
      [now.toString(), (windowSeconds * 1000).toString(), limit.toString()]
    ) as [number, number, number, number, number]
    
    return {
      success: result[0] === 1,
      limit: result[1],
      remaining: result[2],
      reset: result[3],
      current: result[4],
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // En cas d'erreur, autoriser la requête (fail open)
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: windowSeconds,
      current: 1,
    }
  }
}

// Rate limiter simple basé sur le fixed window
export async function simpleRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const { limit, window: windowSeconds, identifier, prefix = 'simple_ratelimit' } = config
  const redis = getRedisClient()
  
  const key = `${prefix}:${identifier}`
  
  try {
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }
    
    const remaining = Math.max(0, limit - current)
    const ttl = await redis.ttl(key)
    
    return {
      success: current <= limit,
      limit,
      remaining,
      reset: ttl > 0 ? ttl : windowSeconds,
      current,
    }
  } catch (error) {
    console.error('Simple rate limit error:', error)
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: windowSeconds,
      current: 1,
    }
  }
}

// Rate limiters prédéfinis pour différentes parties de l'application
export const rateLimiters = {
  // API générale: 100 requêtes par minute
  api: (identifier: string) => rateLimit({
    limit: 100,
    window: 60,
    identifier,
    prefix: 'api',
  }),
  
  // Génération: 10 requêtes par heure
  generation: (identifier: string) => rateLimit({
    limit: 10,
    window: 3600,
    identifier,
    prefix: 'generation',
  }),
  
  // Auth: 5 tentatives par minute
  auth: (identifier: string) => rateLimit({
    limit: 5,
    window: 60,
    identifier,
    prefix: 'auth',
  }),
  
  // Login: 3 tentatives par minute
  login: (identifier: string) => rateLimit({
    limit: 3,
    window: 60,
    identifier,
    prefix: 'login',
  }),
  
  // Email: 10 emails par heure
  email: (identifier: string) => rateLimit({
    limit: 10,
    window: 3600,
    identifier,
    prefix: 'email',
  }),
  
  // API Keys: 1000 requêtes par jour
  apiKey: (identifier: string) => rateLimit({
    limit: 1000,
    window: 86400,
    identifier,
    prefix: 'apikey',
  }),
}

// Middleware pour les API routes Next.js
export function withRateLimit(limiter: typeof rateLimiters.api) {
  return async (req: Request, handler: () => Promise<Response>) => {
    // Récupérer l'identifiant (IP ou userId)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const result = await limiter(ip)
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Trop de requêtes',
          code: 'RATE_LIMITED',
          reset: result.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': result.reset.toString(),
          },
        }
      )
    }
    
    return handler()
  }
}

// Vérifier si le rate limit est dépassé (pour utilisation dans les composants)
export async function isRateLimited(identifier: string, type: keyof typeof rateLimiters): Promise<boolean> {
  const limiter = rateLimiters[type]
  if (!limiter) return false
  
  const result = await limiter(identifier)
  return !result.success
}

// Obtenir le temps avant réinitialisation
export async function getRateLimitReset(identifier: string, type: keyof typeof rateLimiters): Promise<number> {
  const limiter = rateLimiters[type]
  if (!limiter) return 0
  
  const result = await limiter(identifier)
  return result.reset
}