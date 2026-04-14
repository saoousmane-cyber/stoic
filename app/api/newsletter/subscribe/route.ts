// AURA & LOGOS - API d'inscription à la newsletter
// POST /api/newsletter/subscribe

import { NextRequest, NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email/resend-client'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Vérifier si l'email est déjà inscrit (simulé - à remplacer par une vraie DB)
    // const existing = await supabase.from('newsletter').select('*').eq('email', email).single()
    // if (existing) {
    //   return NextResponse.json({ error: 'Déjà inscrit' }, { status: 400 })
    // }

    // Sauvegarder l'inscription (à implémenter avec Supabase)
    // await supabase.from('newsletter').insert({ email, name, subscribed_at: new Date() })

    // Envoyer email de confirmation avec Resend
    const resend = getResendClient()
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?email=${encodeURIComponent(email)}`

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'newsletter@auraandlogos.com',
      to: email,
      subject: 'Confirmation d\'inscription à la newsletter AURA & LOGOS',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4f46e5;">✨ AURA & LOGOS</h1>
          <p>Bonjour${name ? ` ${name}` : ''},</p>
          <p>Merci de vous être inscrit à notre newsletter !</p>
          <p>Vous recevrez chaque semaine nos meilleurs articles, astuces et actualités.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #4b5563;">📧 <strong>${email}</strong></p>
          </div>
          <p>Pour confirmer votre inscription, cliquez sur le lien ci-dessous :</p>
          <a href="${confirmUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Confirmer mon inscription</a>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">Vous pouvez vous désinscrire à tout moment en cliquant sur le lien en bas de chaque email.</p>
        </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie ! Vérifiez votre email pour confirmer.',
    })

  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}