-- Admin v2 service cards and customer benefits.
-- Prepared only: do not run remotely without explicit approval.

CREATE TABLE IF NOT EXISTS public.service_sections (
  service_type text NOT NULL CHECK (service_type IN ('home', 'business')),
  section_type text NOT NULL CHECK (section_type IN ('services', 'benefits')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (service_type, section_type)
);

CREATE TABLE IF NOT EXISTS public.service_section_texts (
  service_type text NOT NULL,
  section_type text NOT NULL,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_title text NOT NULL DEFAULT '',
  published_title text NOT NULL DEFAULT '',
  draft_body text NOT NULL DEFAULT '',
  published_body text NOT NULL DEFAULT '',
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (service_type, section_type, lang),
  FOREIGN KEY (service_type, section_type)
    REFERENCES public.service_sections(service_type, section_type) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.service_section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL CHECK (service_type IN ('home', 'business')),
  section_type text NOT NULL CHECK (section_type IN ('services', 'benefits')),
  draft_display_order integer NOT NULL DEFAULT 0 CHECK (draft_display_order >= 0),
  published_display_order integer NOT NULL DEFAULT 0 CHECK (published_display_order >= 0),
  draft_icon text NOT NULL DEFAULT 'house' CHECK (draft_icon IN ('house', 'panels', 'sparkles', 'leaf', 'footprints', 'package', 'truck', 'building', 'snowflake', 'refresh', 'contact', 'shield', 'calendar')),
  published_icon text NOT NULL DEFAULT 'house' CHECK (published_icon IN ('house', 'panels', 'sparkles', 'leaf', 'footprints', 'package', 'truck', 'building', 'snowflake', 'refresh', 'contact', 'shield', 'calendar')),
  draft_visible boolean NOT NULL DEFAULT true,
  published_visible boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  FOREIGN KEY (service_type, section_type)
    REFERENCES public.service_sections(service_type, section_type) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.service_section_item_texts (
  item_id uuid NOT NULL REFERENCES public.service_section_items(id) ON DELETE CASCADE,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_title text NOT NULL DEFAULT '',
  published_title text NOT NULL DEFAULT '',
  draft_description text NOT NULL DEFAULT '',
  published_description text NOT NULL DEFAULT '',
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (item_id, lang)
);

CREATE INDEX IF NOT EXISTS service_section_items_public_idx
  ON public.service_section_items (service_type, section_type, published_visible, published_display_order)
  WHERE deleted_at IS NULL;

ALTER TABLE public.service_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_section_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_section_item_texts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.service_sections FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_section_texts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_section_items FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_section_item_texts FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS service_sections_admin_read ON public.service_sections;
CREATE POLICY service_sections_admin_read ON public.service_sections
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS service_section_texts_admin_read ON public.service_section_texts;
CREATE POLICY service_section_texts_admin_read ON public.service_section_texts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS service_section_items_admin_read ON public.service_section_items;
CREATE POLICY service_section_items_admin_read ON public.service_section_items
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS service_section_item_texts_admin_read ON public.service_section_item_texts;
CREATE POLICY service_section_item_texts_admin_read ON public.service_section_item_texts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS service_sections_touch_updated_at ON public.service_sections;
CREATE TRIGGER service_sections_touch_updated_at
  BEFORE UPDATE ON public.service_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS service_section_texts_touch_updated_at ON public.service_section_texts;
CREATE TRIGGER service_section_texts_touch_updated_at
  BEFORE UPDATE ON public.service_section_texts
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS service_section_items_touch_updated_at ON public.service_section_items;
CREATE TRIGGER service_section_items_touch_updated_at
  BEFORE UPDATE ON public.service_section_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

DROP TRIGGER IF EXISTS service_section_item_texts_touch_updated_at ON public.service_section_item_texts;
CREATE TRIGGER service_section_item_texts_touch_updated_at
  BEFORE UPDATE ON public.service_section_item_texts
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_content_updated_at();

CREATE OR REPLACE VIEW public.public_service_sections AS
SELECT service_type, section_type, lang,
  published_title AS title,
  published_body AS body
FROM public.service_section_texts
WHERE btrim(published_title) <> '' OR btrim(published_body) <> '';

CREATE OR REPLACE VIEW public.public_service_section_items AS
SELECT id, service_type, section_type,
  published_display_order AS display_order,
  published_icon AS icon
FROM public.service_section_items
WHERE deleted_at IS NULL AND published_visible = true;

CREATE OR REPLACE VIEW public.public_service_section_item_texts AS
SELECT item_id, lang,
  published_title AS title,
  published_description AS description
FROM public.service_section_item_texts
WHERE btrim(published_title) <> '' OR btrim(published_description) <> '';

REVOKE ALL ON public.public_service_sections,
  public.public_service_section_items,
  public.public_service_section_item_texts FROM PUBLIC;
GRANT SELECT ON public.public_service_sections,
  public.public_service_section_items,
  public.public_service_section_item_texts TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_service_sections()
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
    'sectionTexts', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY t.service_type, t.section_type, t.lang) FROM public.service_section_texts AS t), '[]'::jsonb),
    'items', COALESCE((SELECT jsonb_agg(to_jsonb(i) ORDER BY i.service_type, i.section_type, i.draft_display_order, i.created_at) FROM public.service_section_items AS i WHERE i.deleted_at IS NULL), '[]'::jsonb),
    'itemTexts', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY t.item_id, t.lang) FROM public.service_section_item_texts AS t), '[]'::jsonb),
    'deletedItemIds', COALESCE((SELECT jsonb_agg(i.id) FROM public.service_section_items AS i WHERE i.deleted_at IS NOT NULL), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_service_section(
  p_service_type text,
  p_section_type text,
  p_lang text,
  p_title text,
  p_body text,
  p_items jsonb,
  p_publish boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  item jsonb;
  item_id_value uuid;
  item_service_type text;
  item_section_type text;
  icon_value text;
  display_order_value integer;
  visible_value boolean;
  title_value text;
  description_value text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_service_type NOT IN ('home', 'business') OR p_section_type NOT IN ('services', 'benefits') THEN
    RAISE EXCEPTION 'invalid service section';
  END IF;
  IF p_lang NOT IN ('fi', 'sv', 'es', 'en') OR jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'invalid service section payload';
  END IF;

  INSERT INTO public.service_sections (service_type, section_type, updated_by)
  VALUES (p_service_type, p_section_type, auth.uid())
  ON CONFLICT (service_type, section_type) DO UPDATE SET updated_by = auth.uid();

  INSERT INTO public.service_section_texts (
    service_type, section_type, lang,
    draft_title, published_title, draft_body, published_body,
    published_at, updated_by
  )
  VALUES (
    p_service_type, p_section_type, p_lang,
    btrim(COALESCE(p_title, '')),
    CASE WHEN p_publish THEN btrim(COALESCE(p_title, '')) ELSE '' END,
    btrim(COALESCE(p_body, '')),
    CASE WHEN p_publish THEN btrim(COALESCE(p_body, '')) ELSE '' END,
    CASE WHEN p_publish THEN now() ELSE NULL END,
    auth.uid()
  )
  ON CONFLICT (service_type, section_type, lang) DO UPDATE SET
    draft_title = EXCLUDED.draft_title,
    draft_body = EXCLUDED.draft_body,
    draft_updated_at = now(),
    updated_by = auth.uid(),
    published_title = CASE WHEN p_publish THEN EXCLUDED.published_title ELSE service_section_texts.published_title END,
    published_body = CASE WHEN p_publish THEN EXCLUDED.published_body ELSE service_section_texts.published_body END,
    published_at = CASE WHEN p_publish THEN now() ELSE service_section_texts.published_at END;

  FOR item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    item_id_value := NULLIF(item->>'id', '')::uuid;
    icon_value := COALESCE(item->>'icon', 'house');
    display_order_value := COALESCE((item->>'displayOrder')::integer, 0);
    visible_value := COALESCE((item->>'visible')::boolean, false);
    title_value := btrim(COALESCE(item->>'title', ''));
    description_value := btrim(COALESCE(item->>'description', ''));
    IF item_id_value IS NULL OR display_order_value < 0 OR icon_value NOT IN ('house', 'panels', 'sparkles', 'leaf', 'footprints', 'package', 'truck', 'building', 'snowflake', 'refresh', 'contact', 'shield', 'calendar') THEN
      RAISE EXCEPTION 'invalid service section item';
    END IF;
    SELECT i.service_type, i.section_type
    INTO item_service_type, item_section_type
    FROM public.service_section_items AS i
    WHERE i.id = item_id_value;
    IF item_service_type IS NOT NULL AND (item_service_type <> p_service_type OR item_section_type <> p_section_type) THEN
      RAISE EXCEPTION 'service section item belongs to another section';
    END IF;

    INSERT INTO public.service_section_items (
      id, service_type, section_type,
      draft_display_order, published_display_order,
      draft_icon, published_icon,
      draft_visible, published_visible,
      deleted_at, published_at, updated_by
    )
    VALUES (
      item_id_value, p_service_type, p_section_type,
      display_order_value,
      CASE WHEN p_publish THEN display_order_value ELSE 0 END,
      icon_value,
      CASE WHEN p_publish THEN icon_value ELSE 'house' END,
      visible_value,
      CASE WHEN p_publish THEN visible_value ELSE false END,
      NULL,
      CASE WHEN p_publish THEN now() ELSE NULL END,
      auth.uid()
    )
    ON CONFLICT (id) DO UPDATE SET
      draft_display_order = EXCLUDED.draft_display_order,
      draft_icon = EXCLUDED.draft_icon,
      draft_visible = EXCLUDED.draft_visible,
      draft_updated_at = now(),
      deleted_at = NULL,
      updated_by = auth.uid(),
      published_display_order = CASE WHEN p_publish THEN EXCLUDED.published_display_order ELSE service_section_items.published_display_order END,
      published_icon = CASE WHEN p_publish THEN EXCLUDED.published_icon ELSE service_section_items.published_icon END,
      published_visible = CASE WHEN p_publish THEN EXCLUDED.published_visible ELSE service_section_items.published_visible END,
      published_at = CASE WHEN p_publish THEN now() ELSE service_section_items.published_at END;

    INSERT INTO public.service_section_item_texts (
      item_id, lang, draft_title, published_title,
      draft_description, published_description, published_at, updated_by
    )
    VALUES (
      item_id_value, p_lang, title_value,
      CASE WHEN p_publish THEN title_value ELSE '' END,
      description_value,
      CASE WHEN p_publish THEN description_value ELSE '' END,
      CASE WHEN p_publish THEN now() ELSE NULL END,
      auth.uid()
    )
    ON CONFLICT (item_id, lang) DO UPDATE SET
      draft_title = EXCLUDED.draft_title,
      draft_description = EXCLUDED.draft_description,
      draft_updated_at = now(),
      updated_by = auth.uid(),
      published_title = CASE WHEN p_publish THEN EXCLUDED.published_title ELSE service_section_item_texts.published_title END,
      published_description = CASE WHEN p_publish THEN EXCLUDED.published_description ELSE service_section_item_texts.published_description END,
      published_at = CASE WHEN p_publish THEN now() ELSE service_section_item_texts.published_at END;
  END LOOP;

  RETURN public.admin_service_sections();
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_service_section_item(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  UPDATE public.service_section_items
  SET deleted_at = now(), draft_visible = false, published_visible = false, updated_by = auth.uid()
  WHERE id = p_id;
  RETURN public.admin_service_sections();
END;
$$;

REVOKE ALL ON FUNCTION public.admin_service_sections() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_upsert_service_section(text, text, text, text, text, jsonb, boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_delete_service_section_item(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_service_sections() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_service_section(text, text, text, text, text, jsonb, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_service_section_item(uuid) TO authenticated;
