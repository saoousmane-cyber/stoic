'use client'

// AURA & LOGOS - Bibliothèque d'images
// /dashboard/images

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

interface ImageItem {
  id: string
  url: string
  previewUrl: string
  author: string
  source: 'pixabay' | 'pexels'
  width: number
  height: number
}

export default function ImagesPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)

  const niches = [
    { value: 'all', label: 'Toutes', icon: '🎨' },
    { value: 'stoicism', label: 'Stoïcisme', icon: '🏛️' },
    { value: 'meditation', label: 'Méditation', icon: '🧘' },
    { value: 'history', label: 'Histoire', icon: '📜' },
    { value: 'philosophy', label: 'Philosophie', icon: '💭' },
    { value: 'nature', label: 'Nature', icon: '🌿' },
    { value: 'spiritual', label: 'Spirituel', icon: '✨' },
  ]

  const searchImages = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/images/search?q=${encodeURIComponent(searchQuery)}&niche=${selectedNiche}`)
      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Failed to search images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (image: ImageItem) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aura-image-${image.id}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🖼️ Bibliothèque d'images</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Images libres de droits pour illustrer vos vidéos
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchImages()}
              placeholder="Rechercher des images..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            {niches.map((niche) => (
              <option key={niche.value} value={niche.value}>
                {niche.icon} {niche.label}
              </option>
            ))}
          </select>
          <button
            onClick={searchImages}
            disabled={isLoading || !searchQuery.trim()}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Recherche...' : '🔍 Rechercher'}
          </button>
        </div>
      </div>

      {/* Grille d'images */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.previewUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(image)
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                >
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-2 right-2 text-xs px-1.5 py-0.5 bg-black/50 text-white rounded">
                {image.source}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Recherchez des images
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Entrez un mot-clé pour trouver des images libres de droits
          </p>
        </div>
      )}

      {/* Modal lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImage.url}
              alt=""
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}