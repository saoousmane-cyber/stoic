// AURA & LOGOS - Client Resend pour l'envoi d'emails

import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === 're_dummy_key') {
      console.warn('RESEND_API_KEY is not defined, using mock client')
      // Créer un client factice pour éviter les erreurs
      resendInstance = new Resend('re_dummy_key')
    } else {
      resendInstance = new Resend(apiKey)
    }
  }
  return resendInstance
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@auraandlogos.com'
export const EMAIL_SUPPORT = 'support@auraandlogos.com'

// Vérifier la configuration Resend
export async function verifyResendConnection(): Promise<boolean> {
  try {
    const resend = getResendClient()
    await resend.domains.list()
    return true
  } catch (error) {
    console.error('Resend connection failed:', error)
    return false
  }
}