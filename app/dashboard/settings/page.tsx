'use client'

// AURA & LOGOS - Paramètres utilisateur
// /dashboard/settings

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'fr',
    notifications: true,
    marketingEmails: false,
  })

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        language: 'fr',
        notifications: true,
        marketingEmails: false,
      })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      })
      
      if (response.ok) {
        await update({ name: formData.name })
        alert('Paramètres mis à jour')
      }
    } catch (error) {
      console.error('Update failed:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return
    if (!confirm('Dernier avertissement : toutes vos données seront perdues.')) return
    
    try {
      const response = await fetch('/api/user/profile', { method: 'DELETE' })
      if (response.ok) {
        router.push('/api/auth/signout')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⚙️ Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulaire profil */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profil
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Langue
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : '💾 Enregistrer'}
            </button>
          </form>
        </div>

        {/* Préférences */}
        <div className="space-y-6">
          {/* Thème */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Apparence
            </h2>
            <div className="flex gap-3">
              <button
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">Notifications push</span>
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 dark:text-gray-300">Emails marketing</span>
                <input
                  type="checkbox"
                  checked={formData.marketingEmails}
                  onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">
              ⚠️ Zone dangereuse
            </h2>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              La suppression de votre compte est irréversible. Toutes vos données seront perdues.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}