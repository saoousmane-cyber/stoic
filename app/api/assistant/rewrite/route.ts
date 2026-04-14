// AURA & LOGOS - API de réécriture de texte par IA
// POST /api/assistant/rewrite

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface RewriteRequest {
  text: string
  action: 'improve' | 'shorten' | 'lengthen' | 'simplify' | 'formal' | 'casual'
  language?: string
}

const actionPrompts: Record<string, string> = {
  improve: 'Améliore la qualité d\'écriture de ce texte. Rends-le plus fluide, plus engageant et mieux structuré.',
  shorten: 'Raccourcis ce texte de manière significative. Supprime les redondances et garde uniquement l\'essentiel.',
  lengthen: 'Développe ce texte. Ajoute des détails, des exemples et des explications supplémentaires.',
  simplify: 'Simplifie ce texte. Utilise un vocabulaire plus accessible et des phrases plus courtes.',
  formal: 'Réécris ce texte dans un style plus formel et professionnel.',
  casual: 'Réécris ce texte dans un style plus décontracté et conversationnel, comme si tu parlais à un ami.',
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id || session.user.email

    // Vérifier que l'utilisateur est Pro
    const { data: user } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()

    if (!user || user.plan !== 'pro') {
      return NextResponse.json(
        { error: 'Cette fonctionnalité est réservée aux abonnés Pro' },
        { status: 403 }
      )
    }

    const { text, action, language = 'fr' } = await request.json() as RewriteRequest

    if (!text || !action) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Texte trop long (maximum 5000 caractères)' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Service temporairement indisponible' },
        { status: 503 }
      )
    }

    const prompt = `${actionPrompts[action]}

Texte original :
${text}

Texte réécrit :`

    // Appel à OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'AURA_AND_LOGOS',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en réécriture de texte. Tu réponds uniquement avec le texte réécrit, sans commentaires, sans explications, sans guillemets. La langue cible est le ${language === 'fr' ? 'français' : language === 'en' ? 'anglais' : language}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    const rewrittenText = data.choices[0].message.content.trim()

    // Nettoyer le texte (enlever les guillemets si présents)
    const cleanedText = rewrittenText
      .replace(/^["']|["']$/g, '')
      .replace(/^Voici le texte réécrit :\s*/i, '')
      .trim()

    return NextResponse.json({
      success: true,
      originalText: text,
      rewrittenText: cleanedText,
      action,
      language,
    })

  } catch (error) {
    console.error('Rewrite error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réécriture du texte' },
      { status: 500 }
    )
  }
}