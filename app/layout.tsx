// AURA & LOGOS - Layout racine

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://stoic.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'AURA & LOGOS | Générateur de contenu vidéo/audio pour créateurs',
    template: '%s | AURA & LOGOS',
  },
  description: 'Créez automatiquement des vidéos et audios pour YouTube, TikTok et podcasts. Stoïcisme, méditation, histoire, philosophie et plus encore.',
  keywords: ['générateur vidéo IA', 'création contenu automatique', 'voix off IA', 'stoïcisme', 'méditation', 'histoire', 'philosophie', 'développement personnel'],
  authors: [{ name: 'AURA & LOGOS' }],
  creator: 'AURA & LOGOS',
  publisher: 'AURA & LOGOS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: APP_URL,
    siteName: 'AURA & LOGOS',
    title: 'AURA & LOGOS - Générateur de contenu pour créateurs',
    description: 'Créez des vidéos qui captivent. Sans monter. Sans tourner. Sans stress.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AURA & LOGOS - Création automatique de contenu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA & LOGOS - Générateur de contenu pour créateurs',
    description: 'Créez des vidéos qui captivent. Sans monter. Sans tourner. Sans stress.',
    images: ['/og-image.jpg'],
    creator: '@auraandlogos',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'fr': `${APP_URL}/fr`,
      'en': `${APP_URL}/en`,
      'es': `${APP_URL}/es`,
    },
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}