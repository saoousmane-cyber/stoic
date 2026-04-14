// AURA & LOGOS - Configuration Plausible Analytics
// Analytics respectueux de la vie privée

export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'auraandlogos.com'
export const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY

export interface PlausibleEvent {
  name: string
  url?: string
  referrer?: string
  props?: Record<string, string | number | boolean>
}

// Envoyer un événement personnalisé à Plausible
export async function trackEvent(event: PlausibleEvent): Promise<void> {
  if (typeof window === 'undefined') return
  
  try {
    const { name, url, referrer, props } = event
    
    // Vérifier si Plausible est chargé
    if ((window as any).plausible) {
      ;(window as any).plausible(name, {
        callback: () => {},
        props: props || {},
        u: url,
        r: referrer,
      })
    } else {
      // Fallback: envoyer via API si plausible n'est pas chargé
      await fetch('/api/analytics/plausible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, referrer, props }),
      })
    }
  } catch (error) {
    console.error('Plausible tracking error:', error)
  }
}

// Événements prédéfinis
export const trackPageView = (url?: string) => {
  trackEvent({ name: 'pageview', url })
}

export const trackSignUp = (method: 'google' | 'email') => {
  trackEvent({ name: 'signup', props: { method } })
}

export const trackLogin = (method: 'google' | 'email') => {
  trackEvent({ name: 'login', props: { method } })
}

export const trackGeneration = (params: {
  niche: string
  duration: number
  language: string
  plan: string
}) => {
  trackEvent({ name: 'generation', props: params })
}

export const trackUpgrade = (plan: 'monthly' | 'yearly') => {
  trackEvent({ name: 'upgrade', props: { plan } })
}

export const trackTrialStart = () => {
  trackEvent({ name: 'trial_start' })
}

export const trackTrialConversion = () => {
  trackEvent({ name: 'trial_conversion' })
}

export const trackCancel = (cancelReason?: string) => {
  trackEvent({ name: 'cancel', props: { reason: cancelReason || 'unknown' } })
}

// Obtenir les statistiques (côté serveur)
export async function getPlausibleStats(params: {
  period?: 'day' | '7d' | '30d' | 'month' | 'year'
  metrics?: string[]
  filters?: Record<string, string>
}): Promise<any> {
  if (!PLAUSIBLE_API_KEY) {
    console.warn('PLAUSIBLE_API_KEY not configured')
    return null
  }

  const { period = '30d', metrics = ['visitors', 'pageviews', 'bounce_rate', 'visit_duration'], filters = {} } = params

  const url = new URL(`https://plausible.io/api/v1/stats/aggregate`)
  url.searchParams.append('site_id', PLAUSIBLE_DOMAIN)
  url.searchParams.append('period', period)
  url.searchParams.append('metrics', metrics.join(','))

  for (const [key, value] of Object.entries(filters)) {
    url.searchParams.append(`filters[${key}]`, value)
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${PLAUSIBLE_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Plausible API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Get Plausible stats error:', error)
    return null
  }
}

// Script d'injection Plausible (à mettre dans le head)
export const getPlausibleScript = () => {
  if (!PLAUSIBLE_DOMAIN) return ''
  
  return `
    <script defer data-domain="${PLAUSIBLE_DOMAIN}" src="https://plausible.io/js/script.js"></script>
    <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
  `
}