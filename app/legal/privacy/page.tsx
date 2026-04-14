
// AURA & LOGOS - Politique de Confidentialité
// /legal/privacy

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Dernière mise à jour : 15 janvier 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Données collectées</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Catégorie</th>
                    <th className="text-left p-2">Données</th>
                    <th className="text-left p-2">Finalité</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Identité</td>
                    <td className="p-2">Nom, email (via Google)</td>
                    <td className="p-2">Authentification, communication</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Utilisation</td>
                    <td className="p-2">Quotas, nombre de générations, niche préférée</td>
                    <td className="p-2">Facturation, optimisation</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">Paiement</td>
                    <td className="p-2">Informations Stripe (nous ne stockons pas les CB)</td>
                    <td className="p-2">Abonnement</td>
                  </tr>
                  <tr>
                    <td className="p-2">Technique</td>
                    <td className="p-2">Adresse IP, user-agent, logs</td>
                    <td className="p-2">Sécurité, debugging</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>2. Base légale</h2>
            <ul>
              <li>Exécution du contrat (fournir le Service)</li>
              <li>Consentement (cookies marketing optionnels)</li>
              <li>Intérêt légitime (sécurité, analytics)</li>
            </ul>

            <h2>3. Cookies</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2">Cookie</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">session</td>
                    <td className="p-2">Technique</td>
                    <td className="p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="p-2">auth</td>
                    <td className="p-2">Authentification</td>
                    <td className="p-2">30 jours</td>
                  </tr>
                  <tr>
                    <td className="p-2">preferences</td>
                    <td className="p-2">Fonctionnel</td>
                    <td className="p-2">1 an</td>
                  </tr>
                  <tr>
                    <td className="p-2">analytics (opt-in)</td>
                    <td className="p-2">Statistiques</td>
                    <td className="p-2">1 an</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>4. Partage des données</h2>
            <ul>
              <li><strong>Supabase</strong> : hébergement de la base de données (GDPR compliant)</li>
              <li><strong>Stripe</strong> : traitement des paiements</li>
              <li><strong>OpenAI / OpenRouter</strong> : génération de contenu (anonymisé)</li>
              <li><strong>Resend</strong> : envoi d'emails transactionnels</li>
            </ul>
            <p>Aucune donnée n'est vendue à des tiers.</p>

            <h2>5. Vos droits (RGPD)</h2>
            <ul>
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p>Pour exercer vos droits : <a href="mailto:dpo@auraandlogos.com">dpo@auraandlogos.com</a></p>

            <h2>6. Conservation</h2>
            <ul>
              <li>Données comptes : jusqu'à suppression du compte</li>
              <li>Logs techniques : 30 jours</li>
              <li>Données de paiement : conformité fiscale (10 ans)</li>
            </ul>

            <h2>7. Sécurité</h2>
            <ul>
              <li>Chiffrement TLS</li>
              <li>Clés API dans variables d'environnement (non commitées)</li>
              <li>Accès restreint à la base de données</li>
            </ul>

            <h2>8. Transferts hors UE</h2>
            <p>OpenAI (USA) - Transfert encadré par les Clés Contractuelles Types (SCC).</p>

            <h2>9. Mineurs</h2>
            <p>Le Service n'est pas destiné aux moins de 16 ans.</p>

            <h2>10. Modifications</h2>
            <p>Toute modification sera notifiée par email aux utilisateurs actifs.</p>
          </div>
        </div>
      </div>
    </main>
  )
}