-- Admin v2 content, public images, reviews and social links.
-- Migration 0009 is intentionally left unused because a separate Lovable branch
-- may contain a migration with that name. This migration is not applied remotely
-- by this change; run it only after review and backup.

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_content jsonb,
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (page_key, lang)
);

CREATE TABLE IF NOT EXISTS public.site_contact_details (
  id text PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  public_email text,
  public_phone text,
  public_address text,
  business_id text NOT NULL DEFAULT '3664346-2' CHECK (business_id ~ '^[0-9]{7}-[0-9]$'),
  public_text jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  slot_key text NOT NULL,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_path text,
  published_path text,
  draft_alt_text text NOT NULL DEFAULT '',
  published_alt_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (page_key, slot_key, lang)
);

CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  public_name text NOT NULL,
  customer_type text NOT NULL CHECK (customer_type IN ('private', 'business', 'relative', 'other')),
  review_text text NOT NULL,
  rating integer CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  consent_granted boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CHECK (published = false OR consent_granted = true)
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key text NOT NULL UNIQUE CHECK (service_key IN ('linkedin', 'facebook', 'instagram', 'tiktok', 'whatsapp')),
  label text NOT NULL,
  url text NOT NULL DEFAULT '' CHECK (url = '' OR url ~* '^https?://'),
  visible boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS site_content_public_idx
  ON public.site_content (page_key, lang)
  WHERE published_content IS NOT NULL;
CREATE INDEX IF NOT EXISTS site_images_public_idx
  ON public.site_images (page_key, slot_key, lang)
  WHERE published_path IS NOT NULL;
CREATE INDEX IF NOT EXISTS customer_reviews_public_idx
  ON public.customer_reviews (lang, display_order)
  WHERE published = true AND consent_granted = true AND hidden = false;

CREATE OR REPLACE FUNCTION public.touch_admin_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_content_touch_updated_at ON public.site_content;
CREATE TRIGGER site_content_touch_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS site_contact_details_touch_updated_at ON public.site_contact_details;
CREATE TRIGGER site_contact_details_touch_updated_at
  BEFORE UPDATE ON public.site_contact_details
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS site_images_touch_updated_at ON public.site_images;
CREATE TRIGGER site_images_touch_updated_at
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS customer_reviews_touch_updated_at ON public.customer_reviews;
CREATE TRIGGER customer_reviews_touch_updated_at
  BEFORE UPDATE ON public.customer_reviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS social_links_touch_updated_at ON public.social_links;
CREATE TRIGGER social_links_touch_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.site_contact_details TO anon, authenticated;
GRANT SELECT ON public.customer_reviews TO anon, authenticated;
GRANT SELECT ON public.social_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_contact_details, public.customer_reviews, public.social_links TO authenticated;

-- Draft columns are never exposed through the table API. Public clients use the
-- read-only views below and admins use SECURITY DEFINER functions after the
-- role check. This prevents authenticated non-admins from selecting drafts.
REVOKE ALL ON public.site_content FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.site_images FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS site_content_public_read ON public.site_content;
DROP POLICY IF EXISTS site_content_admin_read ON public.site_content;
CREATE POLICY site_content_admin_read ON public.site_content
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS site_content_admin_write ON public.site_content;
CREATE POLICY site_content_admin_write ON public.site_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS site_contact_public_read ON public.site_contact_details;
CREATE POLICY site_contact_public_read ON public.site_contact_details
  FOR SELECT TO anon, authenticated
  USING (id = 'default');
DROP POLICY IF EXISTS site_contact_admin_write ON public.site_contact_details;
CREATE POLICY site_contact_admin_write ON public.site_contact_details
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND id = 'default');

DROP POLICY IF EXISTS site_images_public_read ON public.site_images;
DROP POLICY IF EXISTS site_images_admin_read ON public.site_images;
CREATE POLICY site_images_admin_read ON public.site_images
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS site_images_admin_write ON public.site_images;
CREATE POLICY site_images_admin_write ON public.site_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS customer_reviews_public_read ON public.customer_reviews;
CREATE POLICY customer_reviews_public_read ON public.customer_reviews
  FOR SELECT TO anon, authenticated
  USING ((published = true AND consent_granted = true AND hidden = false) OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS customer_reviews_admin_write ON public.customer_reviews;
CREATE POLICY customer_reviews_admin_write ON public.customer_reviews
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS social_links_public_read ON public.social_links;
CREATE POLICY social_links_public_read ON public.social_links
  FOR SELECT TO anon, authenticated
  USING (visible = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS social_links_admin_write ON public.social_links;
CREATE POLICY social_links_admin_write ON public.social_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif']::text[]
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images-drafts',
  'site-images-drafts',
  false,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif']::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS site_images_bucket_public_read ON storage.objects;
CREATE POLICY site_images_bucket_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS site_images_bucket_admin_insert ON storage.objects;
CREATE POLICY site_images_bucket_admin_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'site-images'
    AND public.has_role(auth.uid(), 'admin')
    AND name ~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$'
  );

DROP POLICY IF EXISTS site_images_bucket_admin_update ON storage.objects;
CREATE POLICY site_images_bucket_admin_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS site_images_bucket_admin_delete ON storage.objects;
CREATE POLICY site_images_bucket_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS site_images_drafts_admin_read ON storage.objects;
CREATE POLICY site_images_drafts_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-images-drafts' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS site_images_drafts_admin_insert ON storage.objects;
CREATE POLICY site_images_drafts_admin_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'site-images-drafts'
    AND public.has_role(auth.uid(), 'admin')
    AND name ~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$'
  );

DROP POLICY IF EXISTS site_images_drafts_admin_update ON storage.objects;
CREATE POLICY site_images_drafts_admin_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images-drafts' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-images-drafts' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS site_images_drafts_admin_delete ON storage.objects;
CREATE POLICY site_images_drafts_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images-drafts' AND public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE VIEW public.public_site_content AS
SELECT id, page_key, lang, published_content, published_at
FROM public.site_content
WHERE published_content IS NOT NULL;

CREATE OR REPLACE VIEW public.public_site_images AS
SELECT id, page_key, slot_key, lang, published_path, published_alt_text
FROM public.site_images
WHERE published_path IS NOT NULL;

REVOKE ALL ON public.public_site_content, public.public_site_images FROM PUBLIC;
GRANT SELECT ON public.public_site_content, public.public_site_images TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_site_content()
RETURNS SETOF public.site_content
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT c.*
  FROM public.site_content AS c
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY c.page_key, c.lang;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_site_content(
  p_page_key text,
  p_lang text,
  p_draft_content jsonb,
  p_published_content jsonb,
  p_published_at timestamptz
)
RETURNS public.site_content
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result public.site_content;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.site_content (
    page_key, lang, draft_content, published_content, published_at,
    draft_updated_at, updated_by
  )
  VALUES (
    p_page_key, p_lang, p_draft_content, p_published_content, p_published_at,
    now(), auth.uid()
  )
  ON CONFLICT (page_key, lang) DO UPDATE SET
    draft_content = EXCLUDED.draft_content,
    published_content = EXCLUDED.published_content,
    published_at = EXCLUDED.published_at,
    draft_updated_at = now(),
    updated_by = auth.uid()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_site_images()
RETURNS SETOF public.site_images
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT i.*
  FROM public.site_images AS i
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY i.page_key, i.slot_key, i.lang;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_site_image(
  p_page_key text,
  p_slot_key text,
  p_lang text,
  p_draft_path text,
  p_published_path text,
  p_draft_alt_text text,
  p_published_alt_text text
)
RETURNS public.site_images
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result public.site_images;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.site_images (
    page_key, slot_key, lang, draft_path, published_path,
    draft_alt_text, published_alt_text, updated_by
  )
  VALUES (
    p_page_key, p_slot_key, p_lang, p_draft_path, p_published_path,
    p_draft_alt_text, p_published_alt_text, auth.uid()
  )
  ON CONFLICT (page_key, slot_key, lang) DO UPDATE SET
    draft_path = EXCLUDED.draft_path,
    published_path = EXCLUDED.published_path,
    draft_alt_text = EXCLUDED.draft_alt_text,
    published_alt_text = EXCLUDED.published_alt_text,
    updated_by = auth.uid()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_site_content() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_upsert_site_content(text, text, jsonb, jsonb, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_site_images() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_upsert_site_image(text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_site_content() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_site_content(text, text, jsonb, jsonb, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_site_images() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_site_image(text, text, text, text, text, text, text) TO authenticated;
