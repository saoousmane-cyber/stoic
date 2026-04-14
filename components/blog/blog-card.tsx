'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CalendarIcon, UserIcon, ClockIcon } from 'lucide-react'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: number
  category: string
  image?: string
}

interface BlogCardProps {
  post: BlogPost
  variant?: 'default' | 'featured' | 'compact'
  index?: number
}

export function BlogCard({ post, variant = 'default', index = 0 }: BlogCardProps) {
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (isCompact) {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
      >
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
          📷
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${post.slug}`}>
            <h4 className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 transition line-clamp-2 text-sm">
              {post.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{post.readTime} min</span>
          </div>
        </div>
      </motion.article>
    )
  }

  if (isFeatured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            📷 Image principale
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {post.readTime} min
              </span>
            </div>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <UserIcon className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
    >
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
        📷 Illustration
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            {post.readTime} min
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>
      </div>
    </motion.article>
  )
}