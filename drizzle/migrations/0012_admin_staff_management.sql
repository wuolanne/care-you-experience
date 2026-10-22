-- Admin v2 shared about image and staff management.
-- Review and apply separately after 0011. This migration is not run by the app.

CREATE TABLE IF NOT EXISTS public.site_image_alt_texts (
  image_key text NOT NULL,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_alt_text text NOT NULL DEFAULT '',
  published_alt_text text NOT NULL DEFAULT '',
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (image_key, lang)
);

CREATE TABLE IF NOT EXISTS public.staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_display_name text NOT NULL DEFAULT '',
  published_display_name text NOT NULL DEFAULT '',
  draft_display_order integer NOT NULL DEFAULT 0 CHECK (draft_display_order >= 0),
  published_display_order integer NOT NULL DEFAULT 0 CHECK (published_display_order >= 0),
  draft_visible boolean NOT NULL DEFAULT false,
  published_visible boolean NOT NULL DEFAULT false,
  draft_image_path text,
  published_image_path text,
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CHECK (draft_image_path IS NULL OR draft_image_path ~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$'),
  CHECK (published_image_path IS NULL OR published_image_path ~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$')
);

CREATE TABLE IF NOT EXISTS public.staff_member_texts (
  staff_id uuid NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_job_title text NOT NULL DEFAULT '',
  published_job_title text NOT NULL DEFAULT '',
  draft_bio text NOT NULL DEFAULT '',
  published_bio text NOT NULL DEFAULT '',
  draft_alt_text text NOT NULL DEFAULT '',
  published_alt_text text NOT NULL DEFAULT '',
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (staff_id, lang)
);

CREATE INDEX IF NOT EXISTS staff_members_public_idx
  ON public.staff_members (published_visible, published_display_order);

ALTER TABLE public.site_image_alt_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_member_texts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.site_image_alt_texts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.staff_members FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.staff_member_texts FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS site_image_alt_texts_admin_read ON public.site_image_alt_texts;
CREATE POLICY site_image_alt_texts_admin_read ON public.site_image_alt_texts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS staff_members_admin_read ON public.staff_members;
CREATE POLICY staff_members_admin_read ON public.staff_members
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS staff_member_texts_admin_read ON public.staff_member_texts;
CREATE POLICY staff_member_texts_admin_read ON public.staff_member_texts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS site_image_alt_texts_touch_updated_at ON public.site_image_alt_texts;
CREATE TRIGGER site_image_alt_texts_touch_updated_at
  BEFORE UPDATE ON public.site_image_alt_texts
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS staff_members_touch_updated_at ON public.staff_members;
CREATE TRIGGER staff_members_touch_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS staff_member_texts_touch_updated_at ON public.staff_member_texts;
CREATE TRIGGER staff_member_texts_touch_updated_at
  BEFORE UPDATE ON public.staff_member_texts
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

-- Keep the existing about/fi image as the initial shared image when available.
INSERT INTO public.site_image_alt_texts (image_key, lang, draft_alt_text, published_alt_text)
VALUES
  ('about-main', 'fi', COALESCE((SELECT draft_alt_text FROM public.site_images WHERE page_key = 'about' AND slot_key = 'main' AND lang = 'fi' LIMIT 1), ''), COALESCE((SELECT published_alt_text FROM public.site_images WHERE page_key = 'about' AND slot_key = 'main' AND lang = 'fi' LIMIT 1), '')),
  ('about-main', 'sv', '', ''),
  ('about-main', 'es', '', ''),
  ('about-main', 'en', '', '')
ON CONFLICT (image_key, lang) DO NOTHING;

CREATE OR REPLACE VIEW public.public_shared_about_image AS
SELECT
  t.lang,
  i.published_path,
  t.published_alt_text
FROM public.site_images AS i
JOIN public.site_image_alt_texts AS t ON t.image_key = 'about-main'
WHERE i.page_key = 'about'
  AND i.slot_key = 'main'
  AND i.lang = 'fi'
  AND i.published_path IS NOT NULL;

CREATE OR REPLACE VIEW public.public_staff_members AS
SELECT
  m.id,
  m.published_display_name AS display_name,
  m.published_display_order AS display_order,
  m.published_image_path AS image_path
FROM public.staff_members AS m
WHERE m.published_visible = true
  AND (
    btrim(m.published_display_name) <> ''
    OR m.published_image_path IS NOT NULL
    OR EXISTS (
      SELECT 1
      FROM public.staff_member_texts AS t
      WHERE t.staff_id = m.id
        AND (btrim(t.published_job_title) <> '' OR btrim(t.published_bio) <> '')
    )
  );

CREATE OR REPLACE VIEW public.public_staff_member_texts AS
SELECT
  t.staff_id,
  t.lang,
  t.published_job_title AS job_title,
  t.published_bio AS bio,
  t.published_alt_text AS alt_text
FROM public.staff_member_texts AS t
JOIN public.public_staff_members AS m ON m.id = t.staff_id;

REVOKE ALL ON public.public_shared_about_image,
  public.public_staff_members,
  public.public_staff_member_texts FROM PUBLIC;
GRANT SELECT ON public.public_shared_about_image,
  public.public_staff_members,
  public.public_staff_member_texts TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_about_image()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN jsonb_build_object(
    'image', COALESCE((
      SELECT to_jsonb(i)
      FROM public.site_images AS i
      WHERE i.page_key = 'about' AND i.slot_key = 'main' AND i.lang = 'fi'
    ), '{}'::jsonb),
    'texts', COALESCE((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.lang)
      FROM public.site_image_alt_texts AS t
      WHERE t.image_key = 'about-main'
    ), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_about_image(
  p_draft_path text,
  p_published_path text,
  p_texts jsonb,
  p_publish boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  text_row jsonb;
  lang_value text;
  draft_alt_value text;
  existing_published_path text;
  existing_published_alt text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_texts IS NULL OR jsonb_typeof(p_texts) <> 'array' THEN
    RAISE EXCEPTION 'invalid alt text payload';
  END IF;
  IF p_draft_path IS NOT NULL AND p_draft_path !~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$' THEN
    RAISE EXCEPTION 'invalid draft image path';
  END IF;
  IF p_publish AND (p_published_path IS NULL OR p_published_path !~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$') THEN
    RAISE EXCEPTION 'invalid published image path';
  END IF;

  SELECT i.published_path, i.published_alt_text
  INTO existing_published_path, existing_published_alt
  FROM public.site_images AS i
  WHERE i.page_key = 'about' AND i.slot_key = 'main' AND i.lang = 'fi';

  INSERT INTO public.site_images (
    page_key, slot_key, lang, draft_path, published_path,
    draft_alt_text, published_alt_text, updated_by
  )
  VALUES (
    'about', 'main', 'fi', p_draft_path,
    CASE WHEN p_publish THEN p_published_path ELSE existing_published_path END,
    COALESCE((SELECT btrim(value->>'draftAltText') FROM jsonb_array_elements(p_texts) WHERE value->>'lang' = 'fi' LIMIT 1), ''),
    CASE WHEN p_publish THEN COALESCE((SELECT btrim(value->>'draftAltText') FROM jsonb_array_elements(p_texts) WHERE value->>'lang' = 'fi' LIMIT 1), '') ELSE COALESCE(existing_published_alt, '') END,
    auth.uid()
  )
  ON CONFLICT (page_key, slot_key, lang) DO UPDATE SET
    draft_path = EXCLUDED.draft_path,
    published_path = CASE WHEN p_publish THEN EXCLUDED.published_path ELSE public.site_images.published_path END,
    draft_alt_text = EXCLUDED.draft_alt_text,
    published_alt_text = CASE WHEN p_publish THEN EXCLUDED.published_alt_text ELSE public.site_images.published_alt_text END,
    updated_by = auth.uid();

  FOR text_row IN SELECT value FROM jsonb_array_elements(p_texts)
  LOOP
    lang_value := text_row->>'lang';
    draft_alt_value := btrim(COALESCE(text_row->>'draftAltText', ''));
    IF lang_value NOT IN ('fi', 'sv', 'es', 'en') THEN
      RAISE EXCEPTION 'invalid language';
    END IF;
    INSERT INTO public.site_image_alt_texts (
      image_key, lang, draft_alt_text, published_alt_text, published_at, updated_by
    )
    VALUES (
      'about-main', lang_value, draft_alt_value,
      CASE WHEN p_publish THEN draft_alt_value ELSE '' END,
      CASE WHEN p_publish THEN now() ELSE NULL END,
      auth.uid()
    )
    ON CONFLICT (image_key, lang) DO UPDATE SET
      draft_alt_text = EXCLUDED.draft_alt_text,
      draft_updated_at = now(),
      updated_by = auth.uid(),
      published_alt_text = CASE WHEN p_publish THEN EXCLUDED.published_alt_text ELSE public.site_image_alt_texts.published_alt_text END,
      published_at = CASE WHEN p_publish THEN now() ELSE public.site_image_alt_texts.published_at END;
  END LOOP;

  RETURN public.admin_about_image();
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_staff_members()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'members', COALESCE((SELECT jsonb_agg(to_jsonb(m) ORDER BY m.draft_display_order, m.created_at) FROM public.staff_members AS m), '[]'::jsonb),
    'texts', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY t.staff_id, t.lang) FROM public.staff_member_texts AS t), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_staff_member(
  p_id uuid,
  p_member jsonb,
  p_texts jsonb,
  p_publish boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  member_id_value uuid := COALESCE(p_id, gen_random_uuid());
  display_name_value text := btrim(COALESCE(p_member->>'displayName', ''));
  display_order_value integer := COALESCE((p_member->>'displayOrder')::integer, 0);
  visible_value boolean := COALESCE((p_member->>'visible')::boolean, false);
  draft_image_path_value text := NULLIF(btrim(p_member->>'draftImagePath'), '');
  published_image_path_value text := NULLIF(btrim(p_member->>'publishedImagePath'), '');
  text_row jsonb;
  lang_value text;
  job_title_value text;
  bio_value text;
  alt_text_value text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_member IS NULL OR jsonb_typeof(p_member) <> 'object' OR p_texts IS NULL OR jsonb_typeof(p_texts) <> 'array' THEN
    RAISE EXCEPTION 'invalid staff payload';
  END IF;
  IF display_order_value < 0 THEN
    RAISE EXCEPTION 'display order must be non-negative';
  END IF;
  IF draft_image_path_value IS NOT NULL AND draft_image_path_value !~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$' THEN
    RAISE EXCEPTION 'invalid draft staff image path';
  END IF;
  IF published_image_path_value IS NOT NULL AND published_image_path_value !~ '^[a-z0-9/_-]+\.(png|jpe?g|webp|avif)$' THEN
    RAISE EXCEPTION 'invalid published staff image path';
  END IF;
  IF p_publish AND display_name_value = '' AND published_image_path_value IS NULL AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_texts) AS value
    WHERE btrim(COALESCE(value->>'draftJobTitle', '')) <> ''
       OR btrim(COALESCE(value->>'draftBio', '')) <> ''
  ) THEN
    RAISE EXCEPTION 'cannot publish an empty staff member';
  END IF;

  INSERT INTO public.staff_members (
    id, draft_display_name, published_display_name,
    draft_display_order, published_display_order,
    draft_visible, published_visible,
    draft_image_path, published_image_path, published_at, updated_by
  )
  VALUES (
    member_id_value, display_name_value,
    CASE WHEN p_publish THEN display_name_value ELSE '' END,
    display_order_value,
    CASE WHEN p_publish THEN display_order_value ELSE 0 END,
    visible_value,
    CASE WHEN p_publish THEN visible_value ELSE false END,
    draft_image_path_value,
    CASE WHEN p_publish THEN published_image_path_value ELSE NULL END,
    CASE WHEN p_publish THEN now() ELSE NULL END,
    auth.uid()
  )
  ON CONFLICT (id) DO UPDATE SET
    draft_display_name = EXCLUDED.draft_display_name,
    draft_display_order = EXCLUDED.draft_display_order,
    draft_visible = EXCLUDED.draft_visible,
    draft_image_path = EXCLUDED.draft_image_path,
    draft_updated_at = now(),
    updated_by = auth.uid(),
    published_display_name = CASE WHEN p_publish THEN EXCLUDED.published_display_name ELSE public.staff_members.published_display_name END,
    published_display_order = CASE WHEN p_publish THEN EXCLUDED.published_display_order ELSE public.staff_members.published_display_order END,
    published_visible = CASE WHEN p_publish THEN EXCLUDED.published_visible ELSE public.staff_members.published_visible END,
    published_image_path = CASE WHEN p_publish THEN EXCLUDED.published_image_path ELSE public.staff_members.published_image_path END,
    published_at = CASE WHEN p_publish THEN now() ELSE public.staff_members.published_at END;

  FOR text_row IN SELECT value FROM jsonb_array_elements(p_texts)
  LOOP
    lang_value := text_row->>'lang';
    job_title_value := btrim(COALESCE(text_row->>'draftJobTitle', ''));
    bio_value := btrim(COALESCE(text_row->>'draftBio', ''));
    alt_text_value := btrim(COALESCE(text_row->>'draftAltText', ''));
    IF lang_value NOT IN ('fi', 'sv', 'es', 'en') THEN
      RAISE EXCEPTION 'invalid language';
    END IF;
    INSERT INTO public.staff_member_texts (
      staff_id, lang, draft_job_title, published_job_title,
      draft_bio, published_bio, draft_alt_text, published_alt_text,
      published_at, updated_by
    )
    VALUES (
      member_id_value, lang_value, job_title_value,
      CASE WHEN p_publish THEN job_title_value ELSE '' END,
      bio_value, CASE WHEN p_publish THEN bio_value ELSE '' END,
      alt_text_value, CASE WHEN p_publish THEN alt_text_value ELSE '' END,
      CASE WHEN p_publish THEN now() ELSE NULL END,
      auth.uid()
    )
    ON CONFLICT (staff_id, lang) DO UPDATE SET
      draft_job_title = EXCLUDED.draft_job_title,
      draft_bio = EXCLUDED.draft_bio,
      draft_alt_text = EXCLUDED.draft_alt_text,
      draft_updated_at = now(),
      updated_by = auth.uid(),
      published_job_title = CASE WHEN p_publish THEN EXCLUDED.published_job_title ELSE public.staff_member_texts.published_job_title END,
      published_bio = CASE WHEN p_publish THEN EXCLUDED.published_bio ELSE public.staff_member_texts.published_bio END,
      published_alt_text = CASE WHEN p_publish THEN EXCLUDED.published_alt_text ELSE public.staff_member_texts.published_alt_text END,
      published_at = CASE WHEN p_publish THEN now() ELSE public.staff_member_texts.published_at END;
  END LOOP;

  RETURN public.admin_staff_members();
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_staff_member(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted_member jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  SELECT jsonb_build_object(
    'id', m.id,
    'draftImagePath', m.draft_image_path,
    'publishedImagePath', m.published_image_path
  ) INTO deleted_member
  FROM public.staff_members AS m
  WHERE m.id = p_id;
  DELETE FROM public.staff_members WHERE id = p_id;
  RETURN COALESCE(deleted_member, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_staff_visibility(
  p_id uuid,
  p_visible boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  UPDATE public.staff_members
  SET published_visible = p_visible,
      published_at = now(),
      updated_by = auth.uid()
  WHERE id = p_id;
  RETURN public.admin_staff_members();
END;
$$;

REVOKE ALL ON FUNCTION public.admin_about_image() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_upsert_about_image(text, text, jsonb, boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_staff_members() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_upsert_staff_member(uuid, jsonb, jsonb, boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_delete_staff_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_set_staff_visibility(uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_about_image() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_about_image(text, text, jsonb, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_staff_members() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_staff_member(uuid, jsonb, jsonb, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_staff_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_staff_visibility(uuid, boolean) TO authenticated;
