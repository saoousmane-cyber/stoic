// AURA & LOGOS - Page article de blog
// /blog/[slug]

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarIcon, UserIcon, ClockIcon, ArrowLeftIcon } from 'lucide-react'

// Données mock des articles (à remplacer par une vraie API plus tard)
const articlesData: Record<string, any> = {
  'comment-creer-videos-stoicisme-ia': {
    title: 'Comment créer des vidéos de stoïcisme avec l\'IA',
    author: 'Jean Dupont',
    date: '2024-01-15',
    readTime: 5,
    category: 'Tutoriel',
    content: `
      <p>Le stoïcisme connaît un regain d'intérêt sur les réseaux sociaux. Des millions de personnes recherchent chaque jour des contenus inspirants sur la philosophie antique.</p>
      
      <h2>Pourquoi le stoïcisme fonctionne sur YouTube ?</h2>
      
      <p>Les vidéos de stoïcisme répondent à un besoin profond de sens et de résilience. Les citations de Marc Aurèle, Sénèque ou Épictète offrent une sagesse intemporelle qui résonne particulièrement dans notre époque.</p>
      
      <h2>Comment AURA & LOGOS peut vous aider</h2>
      
      <p>Notre plateforme génère automatiquement des scripts, voix off et sous-titres pour des vidéos de stoïcisme. Il vous suffit de choisir un sujet et de laisser l'IA travailler.</p>
      
      <ul>
        <li>Scripts inspirés des textes originaux</li>
        <li>Voix off calme et posée</li>
        <li>Images d'ambiance de statues antiques</li>
        <li>Citations sourcées</li>
      </ul>
      
      <h2>Exemple de prompt pour l'IA</h2>
      
      <p>Voici un exemple de sujet qui fonctionne bien : "Les 4 vertus stoïciennes expliquées simplement". L'IA générera un script structuré avec une introduction, le développement des 4 vertus (sagesse, courage, justice, tempérance), et une conclusion inspirante.</p>
      
      <h2>Conseils pour maximiser l'engagement</h2>
      
      <p>Pour que vos vidéos de stoïcisme performent, n'oubliez pas de :</p>
      <ul>
        <li>Ajouter des images évocatrices (statues, paysages antiques)</li>
        <li>Utiliser une musique de fond apaisante</li>
        <li>Publier régulièrement (1-2 vidéos par semaine)</li>
        <li>Interagir avec votre communauté en commentaires</li>
      </ul>
      
      <p>Prêt à vous lancer ? Commencez dès aujourd'hui avec notre essai gratuit de 2h.</p>
    `,
  },
  'guide-complet-voix-off-ia': {
    title: 'Guide complet de la voix off IA pour créateurs',
    author: 'Marie Martin',
    date: '2024-01-10',
    readTime: 8,
    category: 'Guide',
    content: `
      <p>La voix off est un élément crucial de vos vidéos. Une voix naturelle et agréable retient l'attention, tandis qu'une voix robotique fait fuir les spectateurs.</p>
      
      <h2>Les avantages de la voix off IA</h2>
      
      <p>Fini le temps où il fallait louer un studio ou passer des heures à enregistrer. L'IA génère des voix naturelles en quelques secondes.</p>
      
      <h2>Comment choisir la bonne voix</h2>
      
      <p>Notre plateforme propose plusieurs voix (nova, alloy, echo, etc.) adaptées à différents types de contenu :</p>
      <ul>
        <li>Nova : voix féminine claire - idéale pour les tutoriels</li>
        <li>Alloy : voix neutre - parfaite pour les documentaires</li>
        <li>Echo : voix masculine profonde - pour les récits épiques</li>
      </ul>
      
      <h2>Optimiser la qualité audio</h2>
      
      <p>Pour un résultat professionnel, veillez à :</p>
      <ul>
        <li>Utiliser la qualité HD (tts-1-hd)</li>
        <li>Ajuster la vitesse selon votre niche</li>
        <li>Ajouter une musique de fond en ducking</li>
        <li>Générer des sous-titres pour l'accessibilité</li>
      </ul>
      
      <p>Avec AURA & LOGOS, obtenez une voix off naturelle en quelques clics.</p>
    `,
  },
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const article = articlesData[params.slug]

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Navigation retour */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour au blog
        </Link>

        {/* Article */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* En-tête */}
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">
                {article.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <UserIcon className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {article.readTime} min de lecture
              </span>
            </div>
          </div>

          {/* Image d'en-tête */}
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">📷 Image de l'article</span>
          </div>

          {/* Contenu */}
          <div
            className="p-6 md:p-8 prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* CTA finale */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Prêt à créer vos vidéos ?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Essayez AURA & LOGOS gratuitement pendant 2h
              </p>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}