'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { LanguageSwitcher } from '@/components/language-switcher'

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AURA & LOGOS
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">
              Tarifs
            </Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">
              Blog
            </Link>
            <Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">
              Documentation
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Bouton menu mobile (pour ouvrir le sidebar) */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Thème */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" />

            {/* Auth */}
            {status === 'loading' ? (
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Connexion
              </Link>
            )}

            {/* Mobile menu toggle (pour le menu déroulant) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/pricing"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link
                href="/blog"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/docs"
                className="py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="py-2 text-indigo-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}