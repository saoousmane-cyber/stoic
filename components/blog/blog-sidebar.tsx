'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogSearch } from './blog-search'
import { BlogCategories } from './blog-categories'

interface BlogSidebarProps {
  categories: Array<{ name: string; slug: string; count: number }>
  popularPosts: Array<{
    slug: string
    title: string
    date: string
    readTime: number
  }>
}

export function BlogSidebar({ categories, popularPosts }: BlogSidebarProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setSubscribeMessage(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubscribeMessage({ type: 'success', text: 'Inscription réussie ! Vérifiez votre email.' })
        setEmail('')
      } else {
        throw new Error('Erreur')
      }
    } catch (error) {
      setSubscribeMessage({ type: 'error', text: 'Erreur lors de l\'inscription' })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubscribeMessage(null), 5000)
    }
  }

  return (
    <aside className="space-y-6">
      {/* Recherche */}
      <BlogSearch />

      {/* Catégories */}
      <BlogCategories categories={categories} />

      {/* Articles populaires */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>🔥</span> Articles populaires
        </h3>
        <div className="space-y-3">
          {popularPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                  📷
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition text-sm line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>{post.readTime} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="text-center">
          <div className="text-3xl mb-2">📧</div>
          <h3 className="font-semibold mb-1">Newsletter</h3>
          <p className="text-sm text-indigo-100 mb-3">
            Recevez nos meilleurs articles chaque semaine
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Inscription...' : 'S\'abonner'}
            </button>
          </form>
          {subscribeMessage && (
            <p className={`text-xs mt-2 ${subscribeMessage.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
              {subscribeMessage.text}
            </p>
          )}
          <p className="text-xs text-indigo-200 mt-3">
            Pas de spam. Désinscription en un clic.
          </p>
        </div>
      </div>

      {/* Tags populaires */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span>🏷️</span> Tags populaires
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Stoïcisme', 'Méditation', 'Histoire', 'Philosophie', 'Psychologie', 'Spiritualité', 'Développement personnel', 'Mythologie'].map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase()}`}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}