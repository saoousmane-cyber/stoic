'use client'

import { useState, useCallback, createContext, useContext, useEffect } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ duration = 5000, ...props }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    setToasts((prev) => [...prev, { id, duration, ...props }])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  // Nettoyer automatiquement les toasts après la durée
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    toasts.forEach((toastItem) => {
      if (toastItem.duration && toastItem.duration > 0) {
        const timer = setTimeout(() => {
          dismiss(toastItem.id)
        }, toastItem.duration)
        timers.push(timer)
      }
    })
    
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, dismiss])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Composant Toaster - version standalone qui utilise useToast
export function Toaster() {
  const context = useContext(ToastContext)
  
  // Si le contexte n'existe pas, ne pas afficher les toasts
  if (!context) {
    return null
  }
  
  const { toasts, dismiss } = context

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`relative max-w-sm p-4 rounded-lg shadow-lg animate-in slide-in-from-right ${
            toastItem.variant === 'destructive'
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : toastItem.variant === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {toastItem.title && (
            <h4 className={`font-semibold text-sm pr-6 ${
              toastItem.variant === 'destructive'
                ? 'text-red-700 dark:text-red-300'
                : toastItem.variant === 'success'
                ? 'text-green-700 dark:text-green-300'
                : 'text-gray-900 dark:text-white'
            }`}>
              {toastItem.title}
            </h4>
          )}
          {toastItem.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {toastItem.description}
            </p>
          )}
          <button
            onClick={() => dismiss(toastItem.id)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition rounded-lg"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}