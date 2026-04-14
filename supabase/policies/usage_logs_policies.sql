-- AURA & LOGOS - RLS policies pour les logs

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres logs
CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Seul le système peut insérer des logs
CREATE POLICY "System can insert usage logs"
  ON public.usage_logs
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Les admins peuvent voir tous les logs
CREATE POLICY "Admins can view all logs"
  ON public.usage_logs
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');