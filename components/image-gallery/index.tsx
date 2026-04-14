// AURA & LOGOS - Galerie d'images
// Affichage des images d'ambiance générées/recherchées

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ImageItem {
  id: string | number
  url: string
  previewUrl: string
  author: string
  source: 'pixabay' | 'pexels'
  width: number
  height: number
}

interface ImageGalleryProps {
  images: ImageItem[]
  onSelect?: (image: ImageItem) => void
  onDownload?: (image: ImageItem) => void
  isPro?: boolean
}

export function ImageGallery({ images, onSelect, onDownload, isPro = true }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [showLightbox, setShowLightbox] = useState(false)

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
    setShowLightbox(true)
    onSelect?.(image)
  }

  const handleDownload = async (image: ImageItem) => {
    if (!isPro) {
      alert('Le téléchargement d\'images est disponible dans le plan Pro')
      return
    }
    
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aura-image-${image.id}.jpg`
      a.click()
      URL.revokeObjectURL(url)
      onDownload?.(image)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  if (!images.length) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🖼️</div>
        <p className="text-gray-500 dark:text-gray-400">
          Aucune image disponible
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Les images apparaîtront ici après la génération
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.previewUrl}
              alt={`Image d'illustration`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload(image)
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                title="Télécharger"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleImageClick(image)
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                title="Agrandir"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>

            {/* Badge source */}
            <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 bg-black/50 text-white rounded">
              {image.source === 'pixabay' ? 'Pixabay' : 'Pexels'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt="Image plein écran"
                className="w-full h-auto rounded-lg"
              />
              
              {/* Informations */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-sm">
                  Source: {selectedImage.source} • Auteur: {selectedImage.author}
                </p>
              </div>

              {/* Bouton fermeture */}
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Bouton téléchargement */}
              <button
                onClick={() => handleDownload(selectedImage)}
                className="absolute bottom-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery