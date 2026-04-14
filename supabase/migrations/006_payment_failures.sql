-- AURA & LOGOS - Suivi des échecs de paiement

CREATE TABLE IF NOT EXISTS public.payment_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_payment_failures_user_id ON public.payment_failures(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_failures_created_at ON public.payment_failures(created_at);

COMMENT ON TABLE public.payment_failures IS 'Historique des échecs de paiement Stripe';