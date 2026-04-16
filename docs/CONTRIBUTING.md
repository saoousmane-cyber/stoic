

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

Licence
En contribuant, vous acceptez que votre code soit sous la même licence que le projet (propriétaire).

Merci pour votre contribution ! 🙏

text

---



| Fichier | Taille | Description |
|---------|--------|-------------|
| `docs/API.md` | ~15KB | Documentation complète de l'API |
| `docs/DEPLOYMENT.md` | ~12KB | Guide de déploiement étape par étape |
| `docs/CONTRIBUTING.md` | ~10KB | Guide pour les contributeurs |



