'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

interface SettingsFormData {
  name: string
  email: string
  language: string
  notifications: boolean
  marketingEmails: boolean
}

export function SettingsForm() {
  const { data: session, update } = useSession()
  const { theme, setTheme } = useTheme()
  const [formData, setFormData] = useState<SettingsFormData>({
    name: '',
    email: '',
    language: 'fr',
    notifications: true,
    marketingEmails: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          preferences: {
            language: formData.language,
            notifications: formData.notifications,
            marketingEmails: formData.marketingEmails,
          },
        }),
      })

      if (response.ok) {
        await update({ name: formData.name })
        setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès' })
        
        // Sauvegarder la langue dans localStorage
        localStorage.setItem('aura-language', formData.language)
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des paramètres' })
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return
    if (!confirm('Dernier avertissement : toutes vos données seront perdues.')) return

    try {
      const response = await fetch('/api/user/profile', { method: 'DELETE' })
      if (response.ok) {
        window.location.href = '/api/auth/signout'
      }
    } catch (error) {
      alert('Erreur lors de la suppression du compte')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message de feedback */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom d'affichage
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Email (non modifiable) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
      </div>

      {/* Langue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Langue de l'interface
        </label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="fr">Français 🇫🇷</option>
          <option value="en">English 🇬🇧</option>
          <option value="es">Español 🇪🇸</option>
          <option value="de">Deutsch 🇩🇪</option>
          <option value="it">Italiano 🇮🇹</option>
          <option value="pt">Português 🇵🇹</option>
        </select>
      </div>

      {/* Thème */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Thème
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex-1 py-2 rounded-lg border transition ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            ☀️ Clair
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex-1 py-2 rounded-lg border transition ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            🌙 Sombre
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex-1 py-2 rounded-lg border transition ${
              theme === 'system'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            💻 Système
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700 dark:text-gray-300">Notifications push</span>
          <input
            type="checkbox"
            checked={formData.notifications}
            onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700 dark:text-gray-300">Emails marketing</span>
          <input
            type="checkbox"
            checked={formData.marketingEmails}
            onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>
      </div>

      {/* Bouton de sauvegarde */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
      </button>

      {/* Zone dangereuse */}
      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">⚠️ Zone dangereuse</h4>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="w-full py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          Supprimer mon compte
        </button>
      </div>
    </form>
  )
}