CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'fi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.booking_requests TO anon;
GRANT ALL ON public.booking_requests TO service_role;

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous visitors can submit booking requests"
  ON public.booking_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);