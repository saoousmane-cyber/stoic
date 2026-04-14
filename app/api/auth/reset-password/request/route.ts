// app/api/auth/reset-password/request/route.ts
// POST /api/auth/reset-password/request

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPasswordResetEmail } from '@/lib/email/email-service'
import { randomBytes } from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single()

    if (!user) {
      // Pour des raisons de sécurité, on retourne un succès même si l'email n'existe pas
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
      })
    }

    // Générer un token unique
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // Expire dans 1 heure

    // Stocker le token dans la base de données
    await supabase
      .from('users')
      .update({
        reset_password_token: resetToken,
        reset_password_expires: resetTokenExpiry.toISOString(),
      })
      .eq('id', user.id)

    // Construire le lien de réinitialisation
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    // Envoyer l'email
    await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetLink,
    })

    return NextResponse.json({
      success: true,
      message: 'Un email de réinitialisation a été envoyé.',
    })

  } catch (error) {
    console.error('Reset password request error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}