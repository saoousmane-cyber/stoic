'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface GenerationParams {
  topic: string
  niche: string
  language: string
  duration: number
}

interface GenerationResult {
  success: boolean
  generationId?: string
  downloadUrl?: string
  error?: string
  metadata?: {
    title: string
    description: string
    tags: string[]
    seoScore: number
  }
}

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const generate = useCallback(async (params: GenerationParams): Promise<GenerationResult> => {
    setIsGenerating(true)
    setProgress(0)
    setError(null)

    // Simuler la progression
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de génération')
      }

      setProgress(100)

      if (data.downloadUrl) {
        // Téléchargement direct
        window.location.href = data.downloadUrl
      } else if (data.generationId) {
        // Redirection vers la page de résultat
        router.push(`/dashboard/generation/${data.generationId}`)
      }

      return {
        success: true,
        generationId: data.generationId,
        downloadUrl: data.downloadUrl,
        metadata: data.metadata,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
      return { success: false, error: message }
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }, [router])

  const cancel = useCallback(() => {
    setIsGenerating(false)
    setProgress(0)
  }, [])

  return {
    generate,
    cancel,
    isGenerating,
    progress,
    error,
  }
}