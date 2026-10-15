BEGIN;
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  first_name TEXT NOT NULL, last_name TEXT NOT NULL, company TEXT,
  plan TEXT DEFAULT 'professional', subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL, nom TEXT NOT NULL,
  entreprise TEXT, telephone TEXT, statut TEXT DEFAULT 'nouveau', notes TEXT, source TEXT DEFAULT 'direct',
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES public.users(id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL, description TEXT, date_interaction TIMESTAMPTZ DEFAULT now(), created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON public.interactions(lead_id);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.users, public.leads, public.interactions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users, public.leads, public.interactions TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.users_id_seq TO service_role;

CREATE TABLE IF NOT EXISTS public.lb_auth_limits (
  bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, window_start TIMESTAMPTZ NOT NULL
);
ALTER TABLE public.lb_auth_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lb_auth_limits FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.lb_auth_allowed(bucket_key TEXT, attempt_limit INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n INTEGER;
BEGIN
  INSERT INTO public.lb_auth_limits(bucket,attempts,window_start) VALUES(bucket_key,1,now())
  ON CONFLICT(bucket) DO UPDATE SET
    attempts=CASE WHEN lb_auth_limits.window_start<now()-interval '15 minutes' THEN 1 ELSE lb_auth_limits.attempts+1 END,
    window_start=CASE WHEN lb_auth_limits.window_start<now()-interval '15 minutes' THEN now() ELSE lb_auth_limits.window_start END
  RETURNING attempts INTO n;
  DELETE FROM public.lb_auth_limits WHERE window_start<now()-interval '1 day';
  RETURN n<=attempt_limit;
END;
$$;
REVOKE ALL ON FUNCTION public.lb_auth_allowed(TEXT,INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lb_auth_allowed(TEXT,INTEGER) TO service_role;
DO $$ DECLARE item RECORD; BEGIN
  FOR item IN SELECT p.oid::regprocedure AS signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='execute_sql'
  LOOP EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated',item.signature); END LOOP;
END $$;
COMMIT;
