-- AURA & LOGOS - Table des essais gratuits (ancien système)
-- Conservée pour compatibilité

CREATE TABLE IF NOT EXISTS public.trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'converted', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  converted_at TIMESTAMP WITH TIME ZONE,
  quota_used INTEGER DEFAULT 0,
  quota_limit INTEGER DEFAULT 120,
  stripe_checkout_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_trials_user_id ON public.trials(user_id);
CREATE INDEX IF NOT EXISTS idx_trials_status ON public.trials(status);
CREATE INDEX IF NOT EXISTS idx_trials_expires_at ON public.trials(expires_at);
CREATE INDEX IF NOT EXISTS idx_trials_stripe_customer_id ON public.trials(stripe_customer_id);

-- Trigger
CREATE TRIGGER update_trials_updated_at
  BEFORE UPDATE ON public.trials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.trials IS 'Historique des essais gratuits des utilisateurs';