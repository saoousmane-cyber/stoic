-- AURA & LOGOS - RLS policies pour les tables d'essais

-- Table trials
ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trials"
  ON public.trials
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can manage trials"
  ON public.trials
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Table prepaid_trials
ALTER TABLE public.prepaid_trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prepaid trials"
  ON public.prepaid_trials
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can manage prepaid trials"
  ON public.prepaid_trials
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Table user_bonuses
ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bonuses"
  ON public.user_bonuses
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can manage bonuses"
  ON public.user_bonuses
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');