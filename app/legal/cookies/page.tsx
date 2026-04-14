// AURA & LOGOS - Politique des Cookies
// /legal/cookies

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Politique des Cookies
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Dernière mise à jour : 15 janvier 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre navigateur lors de la visite d'un site.
              Il permet de stocker des informations sur votre navigation.
            </p>

            <h2>Cookies utilisés</h2>

            <h3>Cookies obligatoires (pas de consentement requis)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Durée</th>
                    <th className="text-left p-2">Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">session</td>
                    <td className="p-2">Session</td>
                    <td className="p-2">Maintien de la connexion</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">auth</td>
                    <td className="p-2">30 jours</td>
                    <td className="p-2">Reconnexion automatique</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">csrf</td>
                    <td className="p-2">Session</td>
                    <td className="p-2">Protection contre les attaques</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Cookies fonctionnels (consentement optionnel)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Durée</th>
                    <th className="text-left p-2">Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">preferences</td>
                    <td className="p-2">1 an</td>
                    <td className="p-2">Mémoriser niche préférée, langue</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">ui_theme</td>
                    <td className="p-2">1 an</td>
                    <td className="p-2">Thème clair/sombre</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Cookies statistiques (consentement requis)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">_ga</td>
                    <td className="p-2">Google Analytics</td>
                    <td className="p-2">2 ans</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">_ga_*</td>
                    <td className="p-2">Google Analytics</td>
                    <td className="p-2">2 ans</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Gérer vos cookies</h2>
            <ul>
              <li><strong>Popup de consentement</strong> : apparaît à la première visite</li>
              <li><strong>Modifier</strong> : lien "Gérer les cookies" en bas de page</li>
              <li><strong>Navigateur</strong> : paramètres de confidentialité</li>
            </ul>

            <h2>Refus</h2>
            <p>
              Le refus des cookies non-obligatoires n'affecte pas la fonctionnalité de base du Service
              (connexion, génération de contenu).
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}