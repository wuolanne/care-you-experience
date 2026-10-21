-- Allow verified administrators to read the request data shown in the admin dashboard.
-- Existing migrations 0000-0007 remain unchanged.
GRANT SELECT ON public.booking_requests TO authenticated;
CREATE POLICY booking_admin_read
  ON public.booking_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- The dashboard only selects delivery metadata from this table. The policy keeps
-- the outbox inaccessible to anonymous and non-admin authenticated users.
GRANT SELECT ON public.email_outbox TO authenticated;
CREATE POLICY email_outbox_admin_read
  ON public.email_outbox
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
