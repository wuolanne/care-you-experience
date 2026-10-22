-- Keep public content policies independent from the admin-only has_role() function.
-- The anon role must not need EXECUTE on has_role() to read published content.

DROP POLICY IF EXISTS customer_reviews_public_read ON public.customer_reviews;
DROP POLICY IF EXISTS customer_reviews_admin_read ON public.customer_reviews;

CREATE POLICY customer_reviews_public_read ON public.customer_reviews
  FOR SELECT TO anon, authenticated
  USING (published = true AND consent_granted = true AND hidden = false);

CREATE POLICY customer_reviews_admin_read ON public.customer_reviews
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS social_links_public_read ON public.social_links;
DROP POLICY IF EXISTS social_links_admin_read ON public.social_links;

CREATE POLICY social_links_public_read ON public.social_links
  FOR SELECT TO anon, authenticated
  USING (visible = true);

CREATE POLICY social_links_admin_read ON public.social_links
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
