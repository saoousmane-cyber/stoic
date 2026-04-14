'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { href: '/dashboard/generate', label: 'Nouvelle génération', icon: '✨' },
  { href: '/dashboard/history', label: 'Historique', icon: '📜' },
  { href: '/dashboard/images', label: 'Bibliothèque d\'images', icon: '🖼️' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙️' },
  { href: '/dashboard/billing', label: 'Facturation', icon: '💳' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25 }}
        className={`fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Logo sidebar */}
          <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AURA & LOGOS
            </h2>
            <p className="text-xs text-gray-400 mt-1">Espace créateur</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Quota info (sera connecté plus tard) */}
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Minutes restantes</span>
              <span className="font-semibold text-indigo-600">5/5</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
            </div>
            <button className="w-full mt-3 py-1.5 text-xs text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
              Passer à Pro
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}