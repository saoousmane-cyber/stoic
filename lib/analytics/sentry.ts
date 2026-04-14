// AURA & LOGOS - Configuration Sentry pour le monitoring des erreurs

import * as Sentry from '@sentry/nextjs'

export const SENTRY_DSN = process.env.SENTRY_DSN
export const SENTRY_ENVIRONMENT = process.env.NODE_ENV || 'development'
export const SENTRY_RELEASE = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'

// Initialiser Sentry (côté client et serveur)
export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('SENTRY_DSN not configured, Sentry disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    release: SENTRY_RELEASE,
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.2 : 1.0,
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  })
}

// Capturer une erreur
export function captureError(error: Error | string, context?: Record<string, any>) {
  if (!SENTRY_DSN) {
    console.error('Sentry not configured:', error)
    return
  }

  if (typeof error === 'string') {
    Sentry.captureMessage(error, {
      level: 'error',
      extra: context,
    })
  } else {
    Sentry.captureException(error, {
      extra: context,
    })
  }
}

// Capturer un message
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  if (!SENTRY_DSN) return

  Sentry.captureMessage(message, {
    level,
    extra: context,
  })
}

// Définir l'utilisateur pour le contexte Sentry
export function setSentryUser(user: { id: string; email: string; plan?: string }) {
  if (!SENTRY_DSN) return

  Sentry.setUser({
    id: user.id,
    email: user.email,
    plan: user.plan,
  })
}

// Nettoyer l'utilisateur
export function clearSentryUser() {
  if (!SENTRY_DSN) return
  Sentry.setUser(null)
}

// Ajouter des tags pour le contexte
export function setSentryTag(key: string, value: string) {
  if (!SENTRY_DSN) return
  Sentry.setTag(key, value)
}

// Démarrer une transaction (pour mesurer les performances)
export function startTransaction(name: string, op: string) {
  if (!SENTRY_DSN) return null
  
  return Sentry.startTransaction({
    name,
    op,
  })
}

// Fonction wrapper pour capturer les erreurs dans les API routes
export function withSentry<T>(
  handler: () => Promise<T>,
  context?: Record<string, any>
): Promise<T | null> {
  return handler().catch((error) => {
    captureError(error, context)
    return null
  })
}

// Middleware pour capturer les erreurs dans les API routes Next.js
export function sentryApiHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      captureError(error as Error, { url: args[0]?.url })
      throw error
    }
  }
}