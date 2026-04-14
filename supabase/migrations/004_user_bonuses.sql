-- AURA & LOGOS - Table des bonus utilisateur (2h offertes après paiement)

CREATE TABLE IF NOT EXISTS public.user_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('welcome_bonus', 'referral_bonus', 'promo_bonus')),
  minutes INTEGER NOT NULL DEFAULT 120,
  minutes_used INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_bonuses_user_id ON public.user_bonuses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_type ON public.user_bonuses(type);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_expires_at ON public.user_bonuses(expires_at);

-- Trigger
CREATE TRIGGER update_user_bonuses_updated_at
  BEFORE UPDATE ON public.user_bonuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.user_bonuses IS 'Bonus offerts aux utilisateurs (ex: 2h après paiement)';