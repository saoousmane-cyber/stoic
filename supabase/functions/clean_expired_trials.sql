-- AURA & LOGOS - Nettoyage des essais expirés
-- À exécuter quotidiennement

CREATE OR REPLACE FUNCTION public.clean_expired_trials()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Marquer les essais expirés
  UPDATE public.prepaid_trials
  SET status = 'expired'
  WHERE status = 'active' 
    AND ends_at < NOW();
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Rétrograder les utilisateurs dont l'essai est expiré sans conversion
  UPDATE public.users
  SET plan = 'free', quota_limit = 5, quota_used = 0
  WHERE id IN (
    SELECT user_id 
    FROM public.prepaid_trials 
    WHERE status = 'expired'
  );
  
  RETURN updated_count;
END;
$$;

COMMENT ON FUNCTION public.clean_expired_trials IS 'Nettoie les essais expirés et rétrograde les utilisateurs';