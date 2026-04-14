
---

## `supabase/migrations/007_generation_history.sql`

```sql
-- AURA & LOGOS - Table d'historique des générations

CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  niche TEXT NOT NULL,
  language TEXT NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  script TEXT,
  audio_url TEXT,
  srt_url TEXT,
  zip_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON public.generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at);
CREATE INDEX IF NOT EXISTS idx_generations_niche ON public.generations(niche);

-- RLS
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON public.generations
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own generations"
  ON public.generations
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own generations"
  ON public.generations
  FOR UPDATE
  USING (auth.uid()::text = user_id);

COMMENT ON TABLE public.generations IS 'Historique des générations de contenu des utilisateurs';