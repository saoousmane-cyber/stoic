'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SOUND_URLS, preloadSound, playSound, stopAllSounds } from '@/lib/sound-effects/sound-loader'

export interface SoundEffect {
  id: string
  name: string
  url: string
  duration: number
  volume: number
}

interface UseSoundEffectsReturn {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  playEffect: (effectId: string, volume?: number) => Promise<void>
  stopAll: () => void
  setMasterVolume: (volume: number) => void
  isPlaying: boolean
  availableEffects: SoundEffect[]
  previewEffect: (effectId: string) => Promise<void>
}

const DEFAULT_SOUND_EFFECTS: SoundEffect[] = [
  { id: 'transition', name: 'Transition', url: SOUND_URLS.transition, duration: 2, volume: 0.3 },
  { id: 'emphasis', name: 'Emphase', url: SOUND_URLS.emphasis, duration: 1, volume: 0.4 },
  { id: 'notification', name: 'Notification', url: SOUND_URLS.notification, duration: 1.5, volume: 0.35 },
  { id: 'success', name: 'Succès', url: SOUND_URLS.success, duration: 2, volume: 0.4 },
  { id: 'error', name: 'Erreur', url: SOUND_URLS.error, duration: 1.5, volume: 0.4 },
]

export function useSoundEffects(): UseSoundEffectsReturn {
  const [isEnabled, setIsEnabled] = useState<boolean>(true)
  const [masterVolume, setMasterVolume] = useState<number>(0.5)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sound-effects-enabled')
    if (saved !== null) {
      setIsEnabled(saved === 'true')
    }
    
    // Précharger les sons au montage
    DEFAULT_SOUND_EFFECTS.forEach((effect) => {
      preloadSound(effect.url)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('sound-effects-enabled', String(isEnabled))
  }, [isEnabled])

  const playEffect = useCallback(async (effectId: string, volume?: number): Promise<void> => {
    if (!isEnabled) return

    const effect = DEFAULT_SOUND_EFFECTS.find(e => e.id === effectId)
    if (!effect) {
      console.warn(`Sound effect ${effectId} not found`)
      return
    }

    // Arrêter l'effet en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    
    setIsPlaying(true)
    
    const finalVolume = (volume ?? effect.volume) * masterVolume
    
    try {
      await playSound(effect.url, finalVolume)
    } catch (error) {
      console.error('Error playing sound effect:', error)
    } finally {
      setIsPlaying(false)
    }
  }, [isEnabled, masterVolume])

  const stopAll = useCallback((): void => {
    stopAllSounds()
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const previewEffect = useCallback(async (effectId: string): Promise<void> => {
    await playEffect(effectId, 0.5)
  }, [playEffect])

  return {
    isEnabled,
    setIsEnabled,
    playEffect,
    stopAll,
    setMasterVolume,
    isPlaying,
    availableEffects: DEFAULT_SOUND_EFFECTS,
    previewEffect,
  }
}