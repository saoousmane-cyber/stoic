'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface Category {
  name: string
  slug: string
  count: number
  icon?: string
}

interface BlogCategoriesProps {
  categories: Category[]
  showCount?: boolean
  variant?: 'sidebar' | 'header'
}

const defaultCategories: Category[] = [
  { name: 'Tous les articles', slug: 'all', count: 12, icon: '📝' },
  { name: 'Tutoriel', slug: 'tutoriel', count: 4, icon: '🎓' },
  { name: 'Guide', slug: 'guide', count: 3, icon: '📖' },
  { name: 'SEO', slug: 'seo', count: 2, icon: '🔍' },
  { name: 'Stratégie', slug: 'strategie', count: 2, icon: '🎯' },
  { name: 'Productivité', slug: 'productivite', count: 1, icon: '⚡' },
]

export function BlogCategories({ categories = defaultCategories, showCount = true, variant = 'sidebar' }: BlogCategoriesProps) {
  const pathname = usePathname()
  const currentCategory = pathname?.split('/').pop() || 'all'

  if (variant === 'header') {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={cat.slug === 'all' ? '/blog' : `/blog/category/${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              currentCategory === cat.slug
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.icon && <span className="mr-1">{cat.icon}</span>}
            {cat.name}
            {showCount && (
              <span className={`ml-1 text-xs ${currentCategory === cat.slug ? 'text-indigo-200' : 'text-gray-400'}`}>
                ({cat.count})
              </span>
            )}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>📂</span> Catégories
      </h3>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={cat.slug === 'all' ? '/blog' : `/blog/category/${cat.slug}`}
              className={`flex items-center justify-between p-2 rounded-lg transition ${
                currentCategory === cat.slug
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3" />
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </span>
              {showCount && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}