-- AURA & LOGOS - Réinitialisation des quotas mensuels
-- À exécuter le 1er de chaque mois (via CRON ou pg_cron)

CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Réinitialiser les quotas des utilisateurs free
  UPDATE public.users
  SET 
    quota_used = 0,
    quota_limit = 5,
    quota_reset_date = DATE_TRUNC('month', NOW() + INTERVAL '1 month')
  WHERE plan = 'free'
    AND (quota_reset_date IS NULL OR quota_reset_date <= NOW());
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Réinitialiser les quotas des utilisateurs pro
  UPDATE public.users
  SET 
    quota_used = 0,
    quota_reset_date = DATE_TRUNC('month', NOW() + INTERVAL '1 month')
  WHERE plan = 'pro'
    AND (quota_reset_date IS NULL OR quota_reset_date <= NOW());
  
  RETURN updated_count;
END;
$$;

COMMENT ON FUNCTION public.reset_monthly_quotas IS 'Réinitialise les quotas de tous les utilisateurs au début du mois';