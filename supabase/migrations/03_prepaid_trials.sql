-- AURA & LOGOS - Table des essais prépayés (2h / 7 jours)
-- Système principal de gestion des essais

CREATE TABLE IF NOT EXISTS public.prepaid_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'exhausted', 'converted', 'refunded')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  quota_limit INTEGER DEFAULT 120,
  quota_used INTEGER DEFAULT 0,
  refunded_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_prepaid_trials_user_id ON public.prepaid_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_prepaid_trials_status ON public.prepaid_trials(status);
CREATE INDEX IF NOT EXISTS idx_prepaid_trials_ends_at ON public.prepaid_trials(ends_at);
CREATE INDEX IF NOT EXISTS idx_prepaid_trials_stripe_subscription_id ON public.prepaid_trials(stripe_subscription_id);

-- Trigger
CREATE TRIGGER update_prepaid_trials_updated_at
  BEFORE UPDATE ON public.prepaid_trials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.prepaid_trials IS 'Essais prépayés: 2h offertes sur 7 jours avant début abonnement';
COMMENT ON COLUMN public.prepaid_trials.status IS 'active: en cours, exhausted: quota épuisé, converted: converti en abonnement, refunded: remboursé';
-- Mise à jour de la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;
