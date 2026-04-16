import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
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
  description: 'Créez automatiquement des vidéos et audios pour YouTube, TikTok et podcasts.',
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
        alt: 'AURA & LOGOS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA & LOGOS - Générateur de contenu pour créateurs',
    description: 'Créez des vidéos qui captivent.',
    images: ['/og-image.jpg'],
    creator: '@auraandlogos',
  },
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