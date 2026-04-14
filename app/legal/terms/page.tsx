// AURA & LOGOS - Conditions Générales d'Utilisation
// /legal/terms

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Dernière mise à jour : 15 janvier 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Présentation</h2>
            <p>
              AURA & LOGOS (ci-après "la Société") édite une plateforme SaaS permettant la génération automatisée de contenu audio/vidéo (ci-après "le Service").
            </p>

            <h2>2. Acceptation</h2>
            <p>
              L'utilisation du Service implique l'acceptation pleine et entière des présentes CGU.
            </p>

            <h2>3. Comptes</h2>
            <ul>
              <li>L'utilisateur doit créer un compte via Google OAuth.</li>
              <li>Une seule personne physique par compte.</li>
              <li>L'utilisateur est responsable de la confidentialité de son compte.</li>
            </ul>

            <h2>4. Plans tarifaires</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Plan</th>
                    <th className="text-left p-2">Prix</th>
                    <th className="text-left p-2">Caractéristiques</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Gratuit "L'Éveil"</td>
                    <td className="p-2">0 €</td>
                    <td className="p-2">1 génération / mois (5 min max) + filigrane</td>
                  </tr>
                  <tr>
                    <td className="p-2">Pro</td>
                    <td className="p-2">49 € / mois</td>
                    <td className="p-2">20h de génération / mois, sans filigrane</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>5. Propriété intellectuelle</h2>
            <ul>
              <li>L'utilisateur conserve la propriété du contenu généré.</li>
              <li>AURA & LOGOS ne revendique aucun droit sur vos créations.</li>
              <li>Les API tierces (OpenAI, etc.) ont leurs propres conditions.</li>
            </ul>

            <h2>6. Utilisation acceptable</h2>
            <p>Sont interdits :</p>
            <ul>
              <li>Contenu illégal, haineux, discriminatoire</li>
              <li>Spam, désinformation, harcèlement</li>
              <li>Tentative de contournement des quotas</li>
              <li>Reverse engineering du Service</li>
            </ul>

            <h2>7. Résiliation</h2>
            <ul>
              <li>Compte gratuit : suppression immédiate en cas de violation.</li>
              <li>Compte Pro : résiliation possible par l'utilisateur à tout depuis le dashboard.</li>
            </ul>

            <h2>8. Garantie</h2>
            <p>
              Le Service est fourni "en l'état". Nous ne garantissons pas une disponibilité ininterrompue
              ni l'absence d'erreurs dans le contenu généré (vérification humaine recommandée).
            </p>

            <h2>9. Responsabilité</h2>
            <p>
              AURA & LOGOS ne saurait être tenu responsable des usages du contenu généré par l'utilisateur
              sur ses propres chaînes (YouTube, TikTok, etc.).
            </p>

            <h2>10. Modification</h2>
            <p>
              Les CGU peuvent être modifiées à tout moment. Les utilisateurs en seront informés par email.
            </p>

            <h2>11. Contact</h2>
            <p>Pour toute question : <a href="mailto:legal@auraandlogos.com">legal@auraandlogos.com</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}