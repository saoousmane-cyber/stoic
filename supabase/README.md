# Supabase Configuration pour AURA & LOGOS

## Structure
supabase/
├── migrations/ # Migrations SQL (ordre chronologique)
├── seeds/ # Données de seed pour le développement
├── functions/ # Fonctions PostgreSQL
├── policies/ # RLS Policies
└── config.toml # Configuration Supabase CLI

## Commandes utiles

```bash
# Démarrer Supabase localement
supabase start

# Arrêter Supabase
supabase stop

# Appliquer les migrations
supabase migration up

# Réinitialiser la base de données
supabase db reset

# Générer les types TypeScript
supabase gen types typescript --local > lib/supabase-types.ts

# Se connecter à la base distante
supabase link --project-ref votre-project-ref
supabase db push