// AURA & LOGOS - API de génération de contenu
// Endpoint POST /api/generate

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { generateScript, generateScriptEconomy } from '@/services/claude_script'
import { generateVoice } from '@/services/openia_tts'
import { generateSRT } from '@/services/srt_generator'
import { searchImages } from '@/services/pixabay_ambiance'
import { generateSEO } from '@//services/seo_generator'
import { createPackageSimple } from '@/services/zip_package'
import { getNicheBySlug } from '@/config/niches'
import { getLanguageByCode } from '@/config/languages'
import { FREE_TIER_MINUTES_PER_MONTH, PRO_TIER_MINUTES_PER_MONTH } from '@/config/constants'

interface GenerateRequest {
  topic: string
  niche: string
  language: string
  duration: number
}

export async function POST(request: NextRequest) {
  try {
    // 1. Vérification authentification
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // 2. Récupération des paramètres
    const body: GenerateRequest = await request.json()
    const { topic, niche, language, duration } = body

    if (!topic || !niche || !language || !duration) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Validation durée (max 60 min)
    if (duration > 60) {
      return NextResponse.json(
        { error: 'Durée maximale de 60 minutes' },
        { status: 400 }
      )
    }

    // 3. Vérification du quota (à implémenter avec Supabase)
    // TODO: Récupérer quota utilisateur depuis base de données
    const userPlan = 'free' // free ou pro
    const userUsedMinutes = 0
    const maxMinutes = userPlan === 'free' ? FREE_TIER_MINUTES_PER_MONTH : PRO_TIER_MINUTES_PER_MONTH
    
    if (userUsedMinutes + duration > maxMinutes) {
      return NextResponse.json(
        { 
          error: 'Quota dépassé',
          upgradeRequired: true,
          message: userPlan === 'free' 
            ? 'Vous avez épuisé vos 5 minutes gratuites. Passez au plan Pro pour continuer.'
            : 'Vous avez épuisé votre quota mensuel.'
        },
        { status: 403 }
      )
    }

    // 4. Validation niche et langue
    const nicheData = getNicheBySlug(niche)
    if (!nicheData) {
      return NextResponse.json(
        { error: 'Niche non valide' },
        { status: 400 }
      )
    }

    const languageData = getLanguageByCode(language)
    if (!languageData) {
      return NextResponse.json(
        { error: 'Langue non supportée' },
        { status: 400 }
      )
    }

    // 5. Génération du script
    console.log(`Génération du script pour "${topic}" (${niche}, ${language}, ${duration}min)`)
    
    const scriptResult = await generateScript({
      topic,
      niche,
      language,
      durationMinutes: duration,
    })

    if (!scriptResult.success) {
      console.error('Script generation failed:', scriptResult.error)
      return NextResponse.json(
        { error: 'Erreur de génération du script', details: scriptResult.error },
        { status: 500 }
      )
    }

    console.log(`Script généré : ${scriptResult.wordCount} mots, ~${scriptResult.estimatedDuration} min`)

    // 6. Génération de la voix
    console.log('Génération de la voix...')
    
    const voiceResult = await generateVoice({
      text: scriptResult.script,
      language,
      voice: languageData.openAIVoice,
      model: 'tts-1-hd',
    })

    if (!voiceResult.success || !voiceResult.audioBuffer) {
      console.error('Voice generation failed:', voiceResult.error)
      return NextResponse.json(
        { error: 'Erreur de génération de la voix', details: voiceResult.error },
        { status: 500 }
      )
    }

    console.log(`Voix générée : ${voiceResult.durationSeconds} secondes`)

    // 7. Génération des sous-titres SRT
    console.log('Génération des sous-titres...')
    
    const srtContent = await generateSRT({
      script: scriptResult.script,
      audioDurationSeconds: voiceResult.durationSeconds,
      language,
    })

    // 8. Génération SEO bundle
    console.log('Génération du bundle SEO...')
    
    const seoBundle = await generateSEO({
      topic,
      niche,
      script: scriptResult.script,
      language,
      targetPlatform: 'youtube',
    })

    // 9. Recherche d'images d'ambiance
    console.log('Recherche d\'images...')
    
    const imagesResult = await searchImages({
      query: topic,
      niche,
      count: 5,
      orientation: 'horizontal',
    })

    // 10. Création du package ZIP
    console.log('Création du package...')
    
    const packageResult = await createPackageSimple({
      audioBuffer: voiceResult.audioBuffer,
      audioFilename: seoBundle.suggestedFilename,
      srtContent,
      srtFilename: seoBundle.suggestedFilename,
      metadata: {
        title: seoBundle.title,
        niche,
        language,
        durationSeconds: voiceResult.durationSeconds,
        generatedAt: new Date().toISOString(),
        seoTitle: seoBundle.title,
        seoDescription: seoBundle.description,
        tags: seoBundle.tags,
        wordCount: scriptResult.wordCount,
        modelUsed: scriptResult.modelUsed,
        cost: scriptResult.cost,
      },
      includeImages: imagesResult.success && imagesResult.images.length > 0,
      imagesBuffers: imagesResult.success 
        ? await downloadImagesBuffers(imagesResult.images.slice(0, 3))
        : [],
    })

    // 11. Mise à jour du quota utilisateur (TODO)
    // await updateUserQuota(session.user.email, duration)

    // 12. Retour du résultat
    return NextResponse.json({
      success: true,
      generationId: Date.now().toString(),
      downloadUrl: packageResult.zipBuffer ? '/api/download/temp' : null,
      metadata: {
        title: seoBundle.title,
        description: seoBundle.description,
        tags: seoBundle.tags,
        hashtags: seoBundle.hashtags,
        thumbnailPrompt: seoBundle.thumbnailPrompt,
        seoScore: seoBundle.seoScore,
      },
      stats: {
        wordCount: scriptResult.wordCount,
        audioDuration: voiceResult.durationSeconds,
        imagesFound: imagesResult.images.length,
        estimatedCost: (scriptResult.cost || 0) + (voiceResult.estimatedCost || 0),
      },
    })

  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Helper pour télécharger les images
async function downloadImagesBuffers(images: Array<{ downloadUrl: string }>): Promise<Array<{ buffer: Buffer; filename: string }>> {
  const results = []
  
  for (let i = 0; i < images.length; i++) {
    try {
      const response = await fetch(images[i].downloadUrl)
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer())
        results.push({
          buffer,
          filename: `image_${i + 1}.jpg`,
        })
      }
    } catch (error) {
      console.error(`Failed to download image ${i}:`, error)
    }
  }
  
  return results
}