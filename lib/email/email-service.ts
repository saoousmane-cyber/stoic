// AURA & LOGOS - Service d'envoi d'emails

import { getResendClient, EMAIL_FROM } from './resend-client'
import {
  getWelcomeBonusEmail,
  getPasswordResetEmail,
  getPasswordChangedEmail,
  getTrialReminderEmail,
  getConversionConfirmationEmail,
  getRefundConfirmationEmail,
  getInvoiceEmail,
  getNewsletterConfirmationEmail,
  getSecurityAlertEmail,
  getWelcomeEmail,
} from './email-templates'

// Fonction d'envoi d'email générique (exposée)
export async function sendEmail({
  to,
  subject,
  html,
  from = EMAIL_FROM,
}: {
  to: string
  subject: string
  html: string
  from?: string
}): Promise<boolean> {
  try {
    const resend = getResendClient()
    
    // Vérifier si c'est une clé dummy (développement)
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_dummy_key') {
      console.log('[DEV MODE] Email would be sent:', { to, subject, htmlLength: html.length })
      return true
    }
    
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return false
    }

    console.log(`Email sent to ${to}: ${subject}`)
    return true
  } catch (error) {
    console.error('Email service error:', error)
    return false
  }
}

// Email de bienvenue avec bonus
export async function sendWelcomeBonusEmail(params: {
  to: string
  userName?: string
  bonusMinutes?: number
}): Promise<boolean> {
  const { to, userName, bonusMinutes = 120 } = params

  const html = getWelcomeBonusEmail({
    userEmail: to,
    userName,
    bonusMinutes,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '🎁 Bienvenue sur AURA & LOGOS - Vous avez reçu 2h offertes !',
    html,
  })
}

// Email de rappel de fin d'essai
export async function sendTrialReminderEmail(params: {
  to: string
  userName?: string
  remainingDays: number
  remainingMinutes: number
}): Promise<boolean> {
  const { to, userName, remainingDays, remainingMinutes } = params

  const html = getTrialReminderEmail({
    userEmail: to,
    userName,
    remainingDays,
    remainingMinutes,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: `⏰ Votre essai se termine dans ${remainingDays} jours - Profitez de vos minutes restantes`,
    html,
  })
}

// Email de confirmation de conversion (abonnement débuté)
export async function sendConversionConfirmationEmail(params: {
  to: string
  userName?: string
}): Promise<boolean> {
  const { to, userName } = params

  const html = getConversionConfirmationEmail({
    userEmail: to,
    userName,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '✅ Votre abonnement Pro est maintenant actif',
    html,
  })
}

// Email de confirmation de remboursement
export async function sendRefundConfirmationEmail(params: {
  to: string
  userName?: string
}): Promise<boolean> {
  const { to, userName } = params

  const html = getRefundConfirmationEmail({
    userEmail: to,
    userName,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '💰 Confirmation de remboursement - AURA & LOGOS',
    html,
  })
}

// Email de réinitialisation de mot de passe
export async function sendPasswordResetEmail(params: {
  to: string
  userName?: string
  resetLink: string
}): Promise<boolean> {
  const { to, userName, resetLink } = params

  const html = getPasswordResetEmail({
    userEmail: to,
    userName,
    resetLink,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '🔐 Réinitialisation de votre mot de passe AURA & LOGOS',
    html,
  })
}

// Email de confirmation de changement de mot de passe
export async function sendPasswordChangedEmail(params: {
  to: string
  userName?: string
}): Promise<boolean> {
  const { to, userName } = params

  const html = getPasswordChangedEmail({
    userEmail: to,
    userName,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '✅ Votre mot de passe a été modifié',
    html,
  })
}

// Email de facture
export async function sendInvoiceEmail(params: {
  to: string
  userName?: string
  invoiceAmount?: number
  invoiceDate?: string
  invoicePdfUrl?: string
}): Promise<boolean> {
  const { to, userName, invoiceAmount, invoiceDate, invoicePdfUrl } = params

  const html = getInvoiceEmail({
    userEmail: to,
    userName,
    invoiceAmount,
    invoiceDate,
    invoicePdfUrl,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '📄 Votre facture AURA & LOGOS',
    html,
  })
}

// Email de confirmation newsletter
export async function sendNewsletterConfirmationEmail(params: {
  to: string
  userName?: string
}): Promise<boolean> {
  const { to, userName } = params

  const html = getNewsletterConfirmationEmail({
    userEmail: to,
    userName,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '📧 Confirmation d\'inscription à la newsletter',
    html,
  })
}

// Email d'alerte de sécurité
export async function sendSecurityAlertEmail(params: {
  to: string
  userName?: string
  location?: string
  device?: string
}): Promise<boolean> {
  const { to, userName, location, device } = params

  const html = getSecurityAlertEmail({
    userEmail: to,
    userName,
    location,
    device,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '🔒 Alerte de sécurité - Nouvelle connexion détectée',
    html,
  })
}

// Email de bienvenue simple
export async function sendSimpleWelcomeEmail(params: {
  to: string
  userName?: string
}): Promise<boolean> {
  const { to, userName } = params

  const html = getWelcomeEmail({
    userEmail: to,
    userName,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL!,
    supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
  })

  return sendEmail({
    to,
    subject: '✨ Bienvenue sur AURA & LOGOS',
    html,
  })
}