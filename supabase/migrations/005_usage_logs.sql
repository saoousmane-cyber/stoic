-- AURA & LOGOS - Journal d'utilisation pour analytics

CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  generation_id UUID,
  minutes_used INTEGER NOT NULL,
  plan TEXT NOT NULL,
  niche TEXT,
  language TEXT,
  duration INTEGER,
  cost DECIMAL(10, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour analytics
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_plan ON public.usage_logs(plan);
CREATE INDEX IF NOT EXISTS idx_usage_logs_niche ON public.usage_logs(niche);

COMMENT ON TABLE public.usage_logs IS 'Journal détaillé de l''utilisation pour analytics et facturation';