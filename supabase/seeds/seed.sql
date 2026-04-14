-- AURA & LOGOS - Données de seed pour le développement

-- Insertion d'un utilisateur de test (uniquement en développement)
INSERT INTO public.users (id, email, name, plan, quota_limit, quota_used)
VALUES 
  ('test-user-1', 'test@auraandlogos.com', 'Test User', 'free', 5, 0)
ON CONFLICT (email) DO NOTHING;

-- Insertion d'un essai prépayé de test
INSERT INTO public.prepaid_trials (user_id, user_email, stripe_subscription_id, stripe_customer_id, status, started_at, ends_at, quota_limit)
SELECT 
  'test-user-1',
  'test@auraandlogos.com',
  'sub_test_123',
  'cus_test_123',
  'active',
  NOW(),
  NOW() + INTERVAL '7 days',
  120
WHERE EXISTS (SELECT 1 FROM public.users WHERE id = 'test-user-1')
ON CONFLICT DO NOTHING;

-- Mise à jour de l'utilisateur pour l'essai
UPDATE public.users 
SET plan = 'prepaid_trial', trial_ends_at = NOW() + INTERVAL '7 days', quota_limit = 120
WHERE id = 'test-user-1';

-- Insertion d'un bonus de test
INSERT INTO public.user_bonuses (user_id, type, minutes, expires_at)
SELECT 'test-user-1', 'welcome_bonus', 120, NOW() + INTERVAL '30 days'
WHERE EXISTS (SELECT 1 FROM public.users WHERE id = 'test-user-1')
ON CONFLICT DO NOTHING;