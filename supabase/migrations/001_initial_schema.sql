-- AURA & LOGOS - Migration initiale
-- Tables de base pour les utilisateurs et l'authentification

-- Table users (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'trial', 'prepaid_trial')),
  quota_used INTEGER DEFAULT 0,
  quota_limit INTEGER DEFAULT 5,
  quota_reset_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_id UUID,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Commentaires
COMMENT ON TABLE public.users IS 'Utilisateurs de l''application AURA & LOGOS';
COMMENT ON COLUMN public.users.plan IS 'Plan de l''utilisateur: free, pro, trial, prepaid_trial';
COMMENT ON COLUMN public.users.quota_limit IS 'Nombre de minutes maximum par mois (5 pour free, 1200 pour pro)';