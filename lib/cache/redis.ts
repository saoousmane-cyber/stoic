// AURA & LOGOS - Client Redis (Upstash) pour le caching

import { Redis } from '@upstash/redis'

let redisInstance: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_URL
    const token = process.env.UPSTASH_REDIS_TOKEN

    if (!url || !token) {
      console.warn('UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN not configured, using in-memory fallback')
      // Fallback: créer un client mock pour le développement
      redisInstance = new MockRedis() as unknown as Redis
    } else {
      redisInstance = new Redis({
        url,
        token,
      })
    }
  }
  return redisInstance
}

// Mock Redis pour le développement (fallback)
class MockRedis {
  private store: Map<string, { value: string; expiresAt: number | null }> = new Map()

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key)
      return null
    }
    return JSON.parse(item.value) as T
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<void> {
    const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : null
    this.store.set(key, {
      value: JSON.stringify(value),
      expiresAt,
    })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key)
    if (!item) return 0
    item.expiresAt = Date.now() + seconds * 1000
    return 1
  }

  async incr(key: string): Promise<number> {
    const current = await this.get<number>(key) || 0
    const newValue = current + 1
    await this.set(key, newValue)
    return newValue
  }
}

// Types de cache prédéfinis
export const CACHE_TTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 heure
  DAY: 86400,          // 24 heures
  WEEK: 604800,        // 7 jours
}

// Fonctions utilitaires de cache
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient()
  return await redis.get<T>(key)
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  const redis = getRedisClient()
  if (ttlSeconds) {
    await redis.set(key, value, { ex: ttlSeconds })
  } else {
    await redis.set(key, value)
  }
}

export async function cacheDel(key: string): Promise<void> {
  const redis = getRedisClient()
  await redis.del(key)
}

export async function cacheExists(key: string): Promise<boolean> {
  const redis = getRedisClient()
  return (await redis.exists(key)) === 1
}

// Cache avec fonction de génération
export async function cacheGetOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds?: number
): Promise<T> {
  const cached = await cacheGet<T>(key)
  if (cached !== null) {
    return cached
  }

  const fresh = await fetcher()
  await cacheSet(key, fresh, ttlSeconds)
  return fresh
}

// Cache pour les scripts générés (réduction des coûts API)
export async function getCachedScript(topic: string, niche: string, language: string): Promise<string | null> {
  const key = `script:${niche}:${language}:${topic.toLowerCase().replace(/\s/g, '_')}`
  return await cacheGet<string>(key)
}

export async function cacheScript(topic: string, niche: string, language: string, script: string): Promise<void> {
  const key = `script:${niche}:${language}:${topic.toLowerCase().replace(/\s/g, '_')}`
  await cacheSet(key, script, CACHE_TTL.WEEK)
}

// Cache pour les images recherchées
export async function getCachedImages(query: string, niche: string): Promise<any[] | null> {
  const key = `images:${niche}:${query.toLowerCase().replace(/\s/g, '_')}`
  return await cacheGet<any[]>(key)
}

export async function cacheImages(query: string, niche: string, images: any[]): Promise<void> {
  const key = `images:${niche}:${query.toLowerCase().replace(/\s/g, '_')}`
  await cacheSet(key, images, CACHE_TTL.DAY)
}

// Cache pour le quota utilisateur (réduction des appels DB)
export async function getUserQuotaCache(userId: string): Promise<{ used: number; limit: number } | null> {
  const key = `quota:${userId}`
  return await cacheGet<{ used: number; limit: number }>(key)
}

export async function setUserQuotaCache(userId: string, used: number, limit: number): Promise<void> {
  const key = `quota:${userId}`
  await cacheSet(key, { used, limit }, CACHE_TTL.SHORT)
}

export async function invalidateUserQuotaCache(userId: string): Promise<void> {
  const key = `quota:${userId}`
  await cacheDel(key)
}