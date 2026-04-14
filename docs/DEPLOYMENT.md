
---

## `docs/DEPLOYMENT.md`

```markdown
# Guide de Déploiement - AURA & LOGOS

## Prérequis

### Comptes nécessaires
- [Vercel](https://vercel.com) - Hébergement
- [Supabase](https://supabase.com) - Base de données
- [Upstash Redis](https://upstash.com) - Cache & Rate limiting
- [OpenRouter](https://openrouter.ai) - LLM (Claude, GPT)
- [OpenAI](https://platform.openai.com) - TTS
- [Stripe](https://stripe.com) - Paiements
- [Resend](https://resend.com) - Emails
- [Pixabay](https://pixabay.com) - Images
- [Pexels](https://pexels.com) - Images

### Technologies requises
- Node.js 18.17+
- npm 9+
- Git

---

## Phase 1 - Développement local

### 1. Cloner le repository
```bash
git clone https://github.com/auraandlogos/aura-and-logos.git
cd aura-and-logos


text

---

## `docs/DEPLOYMENT.md`

```markdown
# Guide de Déploiement - AURA & LOGOS

## Prérequis

### Comptes nécessaires
- [Vercel](https://vercel.com) - Hébergement
- [Supabase](https://supabase.com) - Base de données
- [Upstash Redis](https://upstash.com) - Cache & Rate limiting
- [OpenRouter](https://openrouter.ai) - LLM (Claude, GPT)
- [OpenAI](https://platform.openai.com) - TTS
- [Stripe](https://stripe.com) - Paiements
- [Resend](https://resend.com) - Emails
- [Pixabay](https://pixabay.com) - Images
- [Pexels](https://pexels.com) - Images

### Technologies requises
- Node.js 18.17+
- npm 9+
- Git

---

## Phase 1 - Développement local

### 1. Cloner le repository
```bash
git clone https://github.com/auraandlogos/aura-and-logos.git
cd aura-and-logos
2. Installer les dépendances
bash
npm install
3. Configurer les variables d'environnement
bash
cp .env.example .env.local
# Éditer .env.local avec vos clés API
4. Initialiser Supabase (local)
bash
npx supabase init
npx supabase start
npx supabase migration up
5. Lancer le serveur de développement
bash
npm run dev
6. Accéder à l'application
text
http://localhost:3000
Phase 2 - Déploiement sur Vercel
1. Installer Vercel CLI
bash
npm i -g vercel
2. Connecter Vercel
bash
vercel login
3. Déployer (domaine .vercel.app)
bash
vercel --prod
4. Configurer les variables d'environnement sur Vercel
bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENROUTER_API_KEY
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add RESEND_API_KEY
vercel env add UPSTASH_REDIS_URL
vercel env add UPSTASH_REDIS_TOKEN
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add PIXABAY_API_KEY
vercel env add PEXELS_API_KEY
vercel env add CRON_SECRET_KEY
5. Configurer le domaine personnalisé
bash
vercel domains add auraandlogos.com
vercel domains add www.auraandlogos.com
6. Configurer les variables dans le dashboard Vercel
Aller à Project Settings > Environment Variables

Ajouter toutes les variables du fichier .env.local

Phase 3 - Configuration Supabase (production)
1. Créer un projet Supabase
text
https://supabase.com/dashboard/new/project
2. Exécuter les migrations
sql
-- Copier-coller le contenu de supabase/migrations/001_initial_schema.sql
-- Puis 002, 003, 004, 005, 006, 007
3. Configurer l'authentification
Aller à Authentication > Providers

Activer Google

Ajouter les URLs de redirection:

text
https://auraandlogos.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
4. Configurer les RLS (Row Level Security)
sql
-- Exécuter les fichiers dans supabase/policies/
-- users_policies.sql
-- trials_policies.sql
-- usage_logs_policies.sql
5. Configurer les fonctions automatiques
sql
-- Exécuter les fichiers dans supabase/functions/
-- handle_new_user.sql
-- update_updated_at.sql
-- reset_monthly_quota.sql
-- clean_expired_trials.sql
Phase 4 - Configuration Stripe
1. Créer un produit "Pro"
bash
# Via Stripe Dashboard
# Product: AURA & LOGOS Pro
# Price: 49€/month (price_xxx)
2. Configurer le webhook
bash
# Stripe Dashboard > Webhooks
# Endpoint: https://auraandlogos.com/api/payment/webhook
# Événements à envoyer:
# - checkout.session.completed
# - customer.subscription.created
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.paid
# - invoice.payment_failed
3. Récupérer la clé webhook
bash
STRIPE_WEBHOOK_SECRET=whsec_xxx
Phase 5 - Configuration Google OAuth
1. Créer un projet Google Cloud
text
https://console.cloud.google.com/apis/credentials
2. Configurer l'écran de consentement
User Type: External

Domaines autorisés: auraandlogos.com

3. Créer les identifiants OAuth 2.0
Type: Application Web

URI de redirection autorisées:

text
https://auraandlogos.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
4. Récupérer les clés
text
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
Phase 6 - Configuration Resend (Emails)
1. Créer un compte Resend
text
https://resend.com
2. Ajouter un domaine
Domaine: auraandlogos.com

Valider les DNS

3. Créer une clé API
bash
RESEND_API_KEY=re_xxx
4. Configurer le webhook (optionnel)
text
https://auraandlogos.com/api/email/webhook
Phase 7 - Configuration Upstash Redis
1. Créer une base de données Redis
text
https://console.upstash.com
2. Récupérer les informations
bash
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx
Phase 8 - Variables d'environnement complètes
bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://auraandlogos.com
NEXT_PUBLIC_APP_NAME=AURA_AND_LOGOS

# Auth
NEXTAUTH_URL=https://auraandlogos.com
NEXTAUTH_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Cache
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx

# AI
OPENROUTER_API_KEY=sk-or-xxx
OPENAI_API_KEY=sk-proj-xxx

# Images
PIXABAY_API_KEY=xxx
PEXELS_API_KEY=xxx

# Payment
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_PRICE_PRO_MONTHLY=price_xxx

# Email
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@auraandlogos.com

# Monitoring
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=auraandlogos.com
PLAUSIBLE_API_KEY=xxx
SENTRY_DSN=https://xxx@sentry.io/xxx

# Cron Security
CRON_SECRET_KEY=xxx
Phase 9 - Cron Jobs (Vercel)
json
// vercel.json
{
  "crons": [
    {
      "path": "/api/crons/reset-monthly-quotas",
      "schedule": "0 0 1 * *"
    },
    {
      "path": "/api/crons/process-expired-trials",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/crons/send-trial-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/crons/cleanup-expired",
      "schedule": "0 0 * * *"
    }
  ]
}
Phase 10 - Vérifications post-déploiement
1. Tester l'authentification
bash
curl https://auraandlogos.com/api/auth/session
2. Tester la génération
bash
curl -X POST https://auraandlogos.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","niche":"stoicism","language":"fr","duration":5}'
3. Tester Stripe
bash
curl https://auraandlogos.com/api/payment/subscription
4. Vérifier les health checks
bash
curl https://auraandlogos.com/api/health
Dépannage
Erreur: NEXTAUTH_SECRET not configured
bash
# Générer un secret
openssl rand -base64 32
Erreur: Supabase connection failed
Vérifier les variables d'environnement

Vérifier que l'IP est autorisée

Erreur: Stripe webhook signature failed
Vérifier STRIPE_WEBHOOK_SECRET

Vérifier que le webhook est actif

Erreur: Rate limit exceeded
Attendre le reset (headers: X-RateLimit-Reset)

Augmenter les limites si nécessaire

Mise à jour
bash
# Pull les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install

# Migrer la base de données
npx supabase migration up

# Déployer
vercel --prod
Rollback
bash
# Vercel Dashboard > Deployments
# Cliquer sur les trois points > Promote to Production
text

---

## `docs/CONTRIBUTING.md`

```markdown
# Guide de Contribution - AURA & LOGOS

Merci de votre intérêt pour contribuer à AURA & LOGOS ! 🎉

## Code de conduite

En participant à ce projet, vous acceptez de respecter un environnement respectueux et professionnel.

## Comment contribuer ?

### 1. Signaler un bug

Utilisez GitHub Issues avec le template suivant :

```markdown
**Description**
Description claire du bug

**Reproduction**
Étapes pour reproduire :
1. Aller sur '...'
2. Cliquer sur '...'
3. Erreur

**Comportement attendu**
Description de ce qui devrait se passer

**Captures d'écran**
Si applicable

**Environnement**
- OS: Windows/Mac/Linux
- Navigateur: Chrome/Firefox/Safari
- Version: x.x.x
2. Suggérer une fonctionnalité
Utilisez GitHub Issues avec le label enhancement :

markdown
**Problème à résoudre**
Description du problème

**Solution proposée**
Description de la solution

**Alternatives envisagées**
Autres solutions possibles

**Contexte supplémentaire**
Informations utiles
3. Proposer une Pull Request
Prérequis
bash
# Fork le repository
# Cloner votre fork
git clone https://github.com/votre-username/aura-and-logos.git
cd aura-and-logos

# Ajouter le remote upstream
git remote add upstream https://github.com/auraandlogos/aura-and-logos.git

# Installer les dépendances
npm install

# Créer une branche
git checkout -b feature/ma-fonctionnalite
Standards de code
TypeScript:

typescript
// ✅ Bon
interface User {
  id: string;
  email: string;
  name?: string;
}

// ❌ Mauvais
interface user {
  Id: string;
  Email: string;
  Name: string;
}
React:

tsx
// ✅ Bon
export function UserCard({ user, onEdit }: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  return <div>...</div>;
}

// ❌ Mauvais
export default function userCard(props) {
  const [loading, setLoading] = useState();
  return <div>...</div>;
}
Tailwind CSS:

tsx
// ✅ Bon
<div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">

// ❌ Mauvais
<div style={{ display: 'flex', padding: '24px' }}>
Commits
Format:

text
type(scope): description

[optional body]

[optional footer]
Types:

feat: Nouvelle fonctionnalité

fix: Correction de bug

docs: Documentation

style: Formatage

refactor: Refactorisation

test: Tests

chore: Maintenance

Exemples:

text
feat(auth): add Google OAuth login

fix(api): handle rate limit errors correctly

docs(readme): update installation guide
Tests
bash
# Linter
npm run lint

# Type checking
npm run type-check
Pull Request
Mettre à jour votre branche

bash
git fetch upstream
git rebase upstream/main
Pousser les changements

bash
git push origin feature/ma-fonctionnalite
Créer la PR sur GitHub

Titre clair

Description détaillée

Lier les issues concernées

Structure du projet
text
aura-and-logos/
├── app/              # Next.js App Router
├── components/       # Composants React
├── config/          # Configuration
├── hooks/           # React Hooks
├── lib/             # Bibliothèques
├── services/        # Services externes
├── types/           # TypeScript types
├── utils/           # Utilitaires
└── public/          # Fichiers statiques
Standards de code
Nommage
Type	Convention	Exemple
Composants	PascalCase	UserProfile.tsx
Hooks	camelCase + use	useAuth.ts
Services	kebab-case	stripe-client.ts
Types	PascalCase	User.ts
Variables	camelCase	userName
Constantes	UPPER_SNAKE	API_BASE_URL
Imports
typescript
// 1. Imports externes
import { useState } from 'react';
import { useSession } from 'next-auth/react';

// 2. Imports internes
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// 3. Types
import type { User } from '@/types';
Gestion des erreurs
typescript
// ✅ Bon
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed to fetch data:', error);
  return { error: 'Une erreur est survenue' };
}

// ❌ Mauvais
try {
  const data = await fetchData();
} catch (error) {
  console.log(error);
}
Variables d'environnement
Ne jamais commiter .env.local. Utiliser .env.example comme template.

bash
# Ajouter une nouvelle variable
# 1. Mettre à jour .env.example
# 2. Documenter dans README.md
# 3. Ajouter à la documentation de déploiement
Performance
Bonnes pratiques
Optimisation des images

tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  loading="lazy"
/>
Code splitting dynamique

tsx
const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <Skeleton />,
});
Mise en cache

typescript
// Utiliser Redis pour les appels coûteux
const cached = await cacheGetOrSet(key, fetcher, TTL);
Sécurité
Bonnes pratiques
Jamais de clés API dans le code client

typescript
// ✅ Bon
const apiKey = process.env.SECRET_KEY;

// ❌ Mauvais
const apiKey = 'sk-xxx';
Validation des entrées

typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
Headers de sécurité

typescript
// middleware.ts
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
Revue de code
Checklist
Le code respecte les standards

Les tests passent

La documentation est mise à jour

Pas de secrets dans le code

Les performances sont bonnes

L'accessibilité est prise en compte

Labels GitHub
Label	Utilisation
bug	Bug reporté
enhancement	Nouvelle fonctionnalité
documentation	Documentation
good-first-issue	Pour les débutants
help-wanted	Besoin d'aide
question	Question
wontfix	Ne sera pas corrigé
