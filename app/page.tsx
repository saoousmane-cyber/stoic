// AURA & LOGOS - Landing page principale
// Présentation du produit, des niches, et appel à l'action

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Lancé par des créateurs pour des créateurs
            </div>
            
            {/* Titre */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Créez du contenu qui captive
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Sans monter. Sans tourner. Sans stress.
            </p>
            
            {/* Description */}
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              AURA & LOGOS génère automatiquement des scripts, voix off, sous-titres et images pour vos vidéos YouTube, podcasts et réseaux sociaux.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/api/auth/login"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="#demo"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Voir la démo
              </Link>
            </div>
            
            {/* Statistiques */}
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">8</div>
                <div className="text-sm text-gray-500">Niches disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">6</div>
                <div className="text-sm text-gray-500">Langues supportées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">500+</div>
                <div className="text-sm text-gray-500">Créateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">20h</div>
                <div className="text-sm text-gray-500">de contenu par mois</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 piliers */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi les créateurs nous choisissent
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Une solution complète pour automatiser votre création de contenu
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pilier 1 */}
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Génération automatique</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Scripts optimisés SEO, voix off naturelle, sous-titres synchronisés et images d'ambiance
              </p>
            </div>
            
            {/* Pilier 2 */}
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Gain de temps</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Plusieurs heures de montage réduites à quelques minutes. Publiez plus, travaillez moins.
              </p>
            </div>
            
            {/* Pilier 3 */}
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Qualité professionnelle</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Voix HD, ducking audio, sous-titres précis, et contenu adapté à chaque niche.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 niches */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              8 niches, des possibilités infinies
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Du stoïcisme à la mythologie, trouvez votre voix
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {niches.map((niche) => (
              <div key={niche.slug} className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition">
                <span className="text-3xl mb-2 block">{niche.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{niche.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Des prix transparents
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Commencez gratuitement, passez à Pro quand vous êtes prêt
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan gratuit */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 bg-white dark:bg-gray-800">
              <h3 className="text-2xl font-bold mb-2">L'Éveil</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Pour découvrir la plateforme</p>
              <div className="text-4xl font-bold mb-6">0€<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">✓ 1 génération par mois</li>
                <li className="flex items-center gap-2 text-sm">✓ Jusqu'à 5 minutes</li>
                <li className="flex items-center gap-2 text-sm">✓ Accès aux 8 niches</li>
                <li className="flex items-center gap-2 text-sm text-gray-400">✗ Filigrane sonore</li>
                <li className="flex items-center gap-2 text-sm text-gray-400">✗ Qualité standard</li>
              </ul>
              <Link
                href="/api/auth/login"
                className="block text-center py-3 px-4 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Commencer gratuitement
              </Link>
            </div>
            
            {/* Plan Pro */}
            <div className="border-2 border-indigo-500 rounded-xl p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <div className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mb-4">POPULAIRE</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Pour les créateurs sérieux</p>
              <div className="text-4xl font-bold mb-6">49€<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">✓ 20h de génération par mois</li>
                <li className="flex items-center gap-2 text-sm">✓ Jusqu'à 60 minutes par vidéo</li>
                <li className="flex items-center gap-2 text-sm">✓ Accès aux 8 niches</li>
                <li className="flex items-center gap-2 text-sm">✓ Sans filigrane</li>
                <li className="flex items-center gap-2 text-sm">✓ Voix HD, ducking audio</li>
                <li className="flex items-center gap-2 text-sm">✓ Pack images inclus</li>
              </ul>
              <Link
                href="/api/auth/login"
                className="block text-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Passer à Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2024 AURA &amp; LOGOS. Tous droits réservés.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/legal/terms" className="text-sm hover:text-white transition">CGU</Link>
            <Link href="/legal/privacy" className="text-sm hover:text-white transition">Confidentialité</Link>
            <Link href="/legal/mentions-legales" className="text-sm hover:text-white transition">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

const niches = [
  { slug: 'stoicism', name: 'Stoïcisme', icon: '🏛️' },
  { slug: 'meditation', name: 'Méditation', icon: '🧘' },
  { slug: 'history', name: 'Histoire', icon: '📜' },
  { slug: 'philosophy', name: 'Philosophie', icon: '💭' },
  { slug: 'psychology', name: 'Psychologie', icon: '🧠' },
  { slug: 'spirituality', name: 'Spiritualité', icon: '✨' },
  { slug: 'self-improvement', name: 'Développement personnel', icon: '📈' },
  { slug: 'mythology', name: 'Mythologie', icon: '⚡' },
]