'use client'

import { Toaster as SonnerToaster } from 'sonner'

interface SonnerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  richColors?: boolean
  closeButton?: boolean
}

export function Sonner({
  position = 'bottom-right',
  richColors = true,
  closeButton = true,
}: SonnerProps) {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      toastOptions={{
        duration: 4000,
        className: 'border border-gray-200 dark:border-gray-800',
      }}
    />
  )
}

// Fonctions utilitaires pour afficher des toasts avec sonner
import { toast } from 'sonner'

export const sonner = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
    })
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
    })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
    })
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
    })
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  dismiss: (id?: string | number) => {
    toast.dismiss(id)
  },
}