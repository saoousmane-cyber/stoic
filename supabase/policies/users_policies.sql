-- AURA & LOGOS - Row Level Security policies pour la table users

-- Activer RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid()::text = id);

-- Politique: Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid()::text = id);

-- Politique: Les admins peuvent voir tous les profils (optionnel)
CREATE POLICY "Admins can view all profiles"
  ON public.users
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Politique: Insertion automatique (gérée par trigger)
CREATE POLICY "System can insert users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);