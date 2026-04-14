/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // Image domains pour les images distantes (Pixabay, Pexels)
  images: {
    domains: [
      'pixabay.com',
      'images.pexels.com',
      'www.pexels.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Swc minification (plus rapide)
  swcMinify: true,

  // React strict mode (détection bugs)
  reactStrictMode: true,

  // Production source maps (désactivé en prod par défaut)
  productionBrowserSourceMaps: false,

  // Headers additionnels
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()'
          }
        ]
      }
    ]
  },

  // Webpack personnalisé
  webpack: (config, { isServer, dev }) => {
    // Ignorer les warnings spécifiques
    config.ignoreWarnings = [{ module: /node_modules\/node-fetch/ }]

    // Fallbacks pour les packages Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    return config
  },

  // Transpiler certains packages
  transpilePackages: ['@supabase/supabase-js', '@upstash/redis'],

  // Logs d'erreur améliorés
  onError: (err, req, res) => {
    console.error('Next.js error:', err)
    if (isProd) {
      // Envoyer à Sentry (optionnel)
      // Sentry.captureException(err)
    }
  },

  // Experimental (optimisations)
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverActions: {
      allowedOrigins: ['localhost:3000', 'aura-and-logos.vercel.app'],
      bodySizeLimit: '10mb'
    }
  },

  // Timeout pour les Server Actions
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig