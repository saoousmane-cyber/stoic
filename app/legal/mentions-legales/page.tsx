// AURA & LOGOS - Mentions Légales
// /legal/mentions-legales

export default function LegalMentionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mentions Légales
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Dernière mise à jour : 15 janvier 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>Éditeur</h2>
            <p>
              <strong>AURA & LOGOS</strong><br />
              Société en cours d'immatriculation (micro-entreprise / LLC)<br />
              Email : <a href="mailto:contact@auraandlogos.com">contact@auraandlogos.com</a><br />
              SIRET : (à venir)
            </p>

            <h2>Directeur de publication</h2>
            <p>Le fondateur (nom à venir)</p>

            <h2>Hébergement</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>

            <h2>Sous-traitants techniques</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Supabase</td>
                    <td className="p-2">Base de données</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Stripe</td>
                    <td className="p-2">Paiements</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">OpenAI</td>
                    <td className="p-2">Génération IA</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">OpenRouter</td>
                    <td className="p-2">Routage LLM</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Resend</td>
                    <td className="p-2">Emails</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Upstash</td>
                    <td className="p-2">Cache Redis</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Pixabay / Pexels</td>
                    <td className="p-2">Images libres</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Crédits</h2>
            <ul>
              <li>Icônes : Lucide Icons (MIT)</li>
              <li>Typographie : Google Fonts (Inter, Playfair Display)</li>
            </ul>

            <h2>Droit applicable</h2>
            <p>Droit français (RGPD inclus). Tribunal compétent : Paris.</p>

            <h2>Contact DPO</h2>
            <p>
              Pour toute question relative à la protection des données :
              <a href="mailto:dpo@auraandlogos.com"> dpo@auraandlogos.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}