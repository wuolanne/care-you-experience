CREATE TABLE IF NOT EXISTS public.form_rate_limits (
  bucket_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0)
);
GRANT ALL ON public.form_rate_limits TO service_role;
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN RAISE NOTICE 'outbox schema: %', (select string_agg(n.nspname,',') from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relname='email_outbox'); END $$;