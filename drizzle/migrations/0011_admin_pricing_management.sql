-- Admin v2 pricing management.
-- This migration must be reviewed and applied separately after 0010.

CREATE TABLE IF NOT EXISTS public.service_pricing_packages (
  package_key text PRIMARY KEY,
  service_type text NOT NULL CHECK (service_type IN ('home', 'business')),
  display_order integer NOT NULL CHECK (display_order > 0),
  draft_name text NOT NULL CHECK (char_length(btrim(draft_name)) BETWEEN 1 AND 200),
  published_name text NOT NULL CHECK (char_length(btrim(published_name)) BETWEEN 1 AND 200),
  draft_monthly_price numeric(12, 2) NOT NULL CHECK (draft_monthly_price >= 0),
  published_monthly_price numeric(12, 2) NOT NULL CHECK (published_monthly_price >= 0),
  draft_hours numeric(8, 2) NOT NULL CHECK (draft_hours > 0),
  published_hours numeric(8, 2) NOT NULL CHECK (published_hours > 0),
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.service_pricing_package_texts (
  package_key text NOT NULL REFERENCES public.service_pricing_packages(package_key) ON DELETE CASCADE,
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_description text NOT NULL CHECK (char_length(btrim(draft_description)) BETWEEN 1 AND 20000),
  published_description text CHECK (published_description IS NULL OR char_length(btrim(published_description)) BETWEEN 1 AND 20000),
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (package_key, lang)
);

CREATE TABLE IF NOT EXISTS public.service_pricing_settings (
  service_type text PRIMARY KEY CHECK (service_type IN ('home', 'business')),
  draft_hourly_price numeric(12, 2) NOT NULL CHECK (draft_hourly_price >= 0),
  published_hourly_price numeric(12, 2) NOT NULL CHECK (published_hourly_price >= 0),
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.service_pricing_texts (
  service_type text NOT NULL CHECK (service_type IN ('home', 'business')),
  lang text NOT NULL CHECK (lang IN ('fi', 'sv', 'es', 'en')),
  draft_pricing_heading text NOT NULL CHECK (char_length(btrim(draft_pricing_heading)) BETWEEN 1 AND 500),
  published_pricing_heading text CHECK (published_pricing_heading IS NULL OR char_length(btrim(published_pricing_heading)) BETWEEN 1 AND 500),
  draft_pricing_note text NOT NULL CHECK (char_length(btrim(draft_pricing_note)) BETWEEN 1 AND 20000),
  published_pricing_note text CHECK (published_pricing_note IS NULL OR char_length(btrim(published_pricing_note)) BETWEEN 1 AND 20000),
  draft_monthly_heading text NOT NULL CHECK (char_length(btrim(draft_monthly_heading)) BETWEEN 1 AND 500),
  published_monthly_heading text CHECK (published_monthly_heading IS NULL OR char_length(btrim(published_monthly_heading)) BETWEEN 1 AND 500),
  draft_vat_notice text NOT NULL CHECK (char_length(btrim(draft_vat_notice)) BETWEEN 1 AND 20000),
  published_vat_notice text CHECK (published_vat_notice IS NULL OR char_length(btrim(published_vat_notice)) BETWEEN 1 AND 20000),
  draft_package_description text NOT NULL CHECK (char_length(btrim(draft_package_description)) BETWEEN 1 AND 20000),
  published_package_description text CHECK (published_package_description IS NULL OR char_length(btrim(published_package_description)) BETWEEN 1 AND 20000),
  draft_hourly_heading text NOT NULL CHECK (char_length(btrim(draft_hourly_heading)) BETWEEN 1 AND 500),
  published_hourly_heading text CHECK (published_hourly_heading IS NULL OR char_length(btrim(published_hourly_heading)) BETWEEN 1 AND 500),
  draft_hourly_description text NOT NULL CHECK (char_length(btrim(draft_hourly_description)) BETWEEN 1 AND 20000),
  published_hourly_description text CHECK (published_hourly_description IS NULL OR char_length(btrim(published_hourly_description)) BETWEEN 1 AND 20000),
  draft_deduction_title text,
  published_deduction_title text,
  draft_deduction_body text,
  published_deduction_body text,
  draft_deduction_link_label text,
  published_deduction_link_label text,
  draft_updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (service_type, lang)
);

CREATE INDEX IF NOT EXISTS service_pricing_packages_public_idx
  ON public.service_pricing_packages (service_type, display_order);

ALTER TABLE public.service_pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing_package_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing_texts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.service_pricing_packages FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_pricing_package_texts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_pricing_settings FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.service_pricing_texts FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS service_pricing_packages_admin_read ON public.service_pricing_packages;
CREATE POLICY service_pricing_packages_admin_read ON public.service_pricing_packages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS service_pricing_package_texts_admin_read ON public.service_pricing_package_texts;
CREATE POLICY service_pricing_package_texts_admin_read ON public.service_pricing_package_texts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS service_pricing_settings_admin_read ON public.service_pricing_settings;
CREATE POLICY service_pricing_settings_admin_read ON public.service_pricing_settings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS service_pricing_texts_admin_read ON public.service_pricing_texts;
CREATE POLICY service_pricing_texts_admin_read ON public.service_pricing_texts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.service_pricing_packages (
  package_key, service_type, display_order,
  draft_name, published_name,
  draft_monthly_price, published_monthly_price,
  draft_hours, published_hours
)
VALUES
  ('home-mini', 'home', 1, 'TGN Mini', 'TGN Mini', 158.13, 158.13, 3, 3),
  ('home-medium', 'home', 2, 'TGN Medium', 'TGN Medium', 308.73, 308.73, 6, 6),
  ('home-maxi', 'home', 3, 'TGN Maxi', 'TGN Maxi', 602.40, 602.40, 12, 12),
  ('home-premium', 'home', 4, 'TGN Premium', 'TGN Premium', 1174.68, 1174.68, 24, 24),
  ('business-mini', 'business', 1, 'TGN Mini B2B', 'TGN Mini B2B', 180, 180, 4, 4),
  ('business-medium', 'business', 2, 'TGN Medium B2B', 'TGN Medium B2B', 350, 350, 8, 8),
  ('business-maxi', 'business', 3, 'TGN Maxi B2B', 'TGN Maxi B2B', 680, 680, 16, 16),
  ('business-premium', 'business', 4, 'TGN Premium B2B', 'TGN Premium B2B', 1312, 1312, 32, 32)
ON CONFLICT (package_key) DO NOTHING;

INSERT INTO public.service_pricing_settings (
  service_type, draft_hourly_price, published_hourly_price
)
VALUES
  ('home', 65.26, 65.26),
  ('business', 55, 55)
ON CONFLICT (service_type) DO NOTHING;

CREATE OR REPLACE VIEW public.public_service_pricing_packages AS
SELECT
  package_key,
  service_type,
  display_order,
  published_name AS name,
  published_monthly_price AS monthly_price,
  published_hours AS hours
FROM public.service_pricing_packages;

CREATE OR REPLACE VIEW public.public_service_pricing_package_texts AS
SELECT package_key, lang, published_description AS description
FROM public.service_pricing_package_texts;

CREATE OR REPLACE VIEW public.public_service_pricing_settings AS
SELECT service_type, published_hourly_price AS hourly_price
FROM public.service_pricing_settings;

CREATE OR REPLACE VIEW public.public_service_pricing_texts AS
SELECT
  service_type,
  lang,
  published_pricing_heading AS pricing_heading,
  published_pricing_note AS pricing_note,
  published_monthly_heading AS monthly_heading,
  published_vat_notice AS vat_notice,
  published_package_description AS package_description,
  published_hourly_heading AS hourly_heading,
  published_hourly_description AS hourly_description,
  published_deduction_title AS deduction_title,
  published_deduction_body AS deduction_body,
  published_deduction_link_label AS deduction_link_label
FROM public.service_pricing_texts;

REVOKE ALL ON public.public_service_pricing_packages,
  public.public_service_pricing_package_texts,
  public.public_service_pricing_settings,
  public.public_service_pricing_texts FROM PUBLIC;
GRANT SELECT ON public.public_service_pricing_packages,
  public.public_service_pricing_package_texts,
  public.public_service_pricing_settings,
  public.public_service_pricing_texts TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_service_pricing()
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
    'packages', COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.service_type, p.display_order)
      FROM public.service_pricing_packages AS p), '[]'::jsonb),
    'packageTexts', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY t.package_key, t.lang)
      FROM public.service_pricing_package_texts AS t), '[]'::jsonb),
    'settings', COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.service_type)
      FROM public.service_pricing_settings AS s), '[]'::jsonb),
    'texts', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY t.service_type, t.lang)
      FROM public.service_pricing_texts AS t), '[]'::jsonb)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_upsert_service_pricing(
  p_service_type text,
  p_lang text,
  p_packages jsonb,
  p_settings jsonb,
  p_texts jsonb,
  p_publish boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  package jsonb;
  package_key_value text;
  package_name text;
  package_description text;
  monthly_price_value numeric;
  hours_value numeric;
  hourly_price_value numeric;
  expected_package_count integer;
  supplied_package_count integer;
  text_value text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_service_type NOT IN ('home', 'business') THEN
    RAISE EXCEPTION 'invalid service_type';
  END IF;
  IF p_lang NOT IN ('fi', 'sv', 'es', 'en') THEN
    RAISE EXCEPTION 'invalid language';
  END IF;
  IF jsonb_typeof(p_packages) <> 'array' OR jsonb_typeof(p_settings) <> 'object' OR jsonb_typeof(p_texts) <> 'object' THEN
    RAISE EXCEPTION 'invalid pricing payload';
  END IF;

  SELECT count(*) INTO expected_package_count
  FROM public.service_pricing_packages
  WHERE service_type = p_service_type;
  SELECT count(DISTINCT value->>'packageKey') INTO supplied_package_count
  FROM jsonb_array_elements(p_packages);
  IF expected_package_count <> supplied_package_count OR jsonb_array_length(p_packages) <> expected_package_count THEN
    RAISE EXCEPTION 'all service packages must be supplied exactly once';
  END IF;

  hourly_price_value := (p_settings->>'hourlyPrice')::numeric;
  IF hourly_price_value IS NULL OR hourly_price_value < 0 OR scale(hourly_price_value) > 2 THEN
    RAISE EXCEPTION 'hourly price must be non-negative';
  END IF;

  FOREACH text_value IN ARRAY ARRAY[
    p_texts->>'pricingHeading',
    p_texts->>'pricingNote',
    p_texts->>'monthlyHeading',
    p_texts->>'vatNotice',
    p_texts->>'packageDescription',
    p_texts->>'hourlyHeading',
    p_texts->>'hourlyDescription'
  ] LOOP
    IF text_value IS NULL OR char_length(btrim(text_value)) = 0 THEN
      RAISE EXCEPTION 'required pricing text is missing';
    END IF;
  END LOOP;

  IF p_service_type = 'home' THEN
    FOREACH text_value IN ARRAY ARRAY[
      p_texts->>'deductionTitle',
      p_texts->>'deductionBody',
      p_texts->>'deductionLinkLabel'
    ] LOOP
      IF text_value IS NULL OR char_length(btrim(text_value)) = 0 THEN
        RAISE EXCEPTION 'required household deduction text is missing';
      END IF;
    END LOOP;
  END IF;

  FOR package IN SELECT value FROM jsonb_array_elements(p_packages)
  LOOP
    package_key_value := package->>'packageKey';
    package_name := btrim(package->>'name');
    package_description := btrim(package->>'description');
    monthly_price_value := (package->>'monthlyPrice')::numeric;
    hours_value := (package->>'hours')::numeric;

    IF NOT EXISTS (
      SELECT 1 FROM public.service_pricing_packages
      WHERE package_key = package_key_value AND service_type = p_service_type
    ) THEN
      RAISE EXCEPTION 'unknown service package';
    END IF;
    IF package_name IS NULL OR char_length(package_name) = 0
      OR monthly_price_value IS NULL OR monthly_price_value < 0 OR scale(monthly_price_value) > 2
      OR hours_value IS NULL OR hours_value <= 0 OR scale(hours_value) > 2
      OR package_description IS NULL OR char_length(package_description) = 0 THEN
      RAISE EXCEPTION 'invalid service package values';
    END IF;

    UPDATE public.service_pricing_packages
    SET draft_name = package_name,
        draft_monthly_price = monthly_price_value,
        draft_hours = hours_value,
        draft_updated_at = now(),
        updated_at = now(),
        updated_by = auth.uid(),
        published_name = CASE WHEN p_publish THEN package_name ELSE published_name END,
        published_monthly_price = CASE WHEN p_publish THEN monthly_price_value ELSE published_monthly_price END,
        published_hours = CASE WHEN p_publish THEN hours_value ELSE published_hours END,
        published_at = CASE WHEN p_publish THEN now() ELSE published_at END
    WHERE package_key = package_key_value AND service_type = p_service_type;

    INSERT INTO public.service_pricing_package_texts (
      package_key, lang, draft_description, published_description, published_at, updated_by
    )
    VALUES (
      package_key_value, p_lang, package_description,
      CASE WHEN p_publish THEN package_description ELSE NULL END,
      CASE WHEN p_publish THEN now() ELSE NULL END,
      auth.uid()
    )
    ON CONFLICT (package_key, lang) DO UPDATE SET
      draft_description = EXCLUDED.draft_description,
      draft_updated_at = now(),
      updated_at = now(),
      updated_by = auth.uid(),
      published_description = CASE WHEN p_publish THEN EXCLUDED.published_description ELSE service_pricing_package_texts.published_description END,
      published_at = CASE WHEN p_publish THEN now() ELSE service_pricing_package_texts.published_at END;
  END LOOP;

  UPDATE public.service_pricing_settings
  SET draft_hourly_price = hourly_price_value,
      draft_updated_at = now(),
      updated_at = now(),
      updated_by = auth.uid(),
      published_hourly_price = CASE WHEN p_publish THEN hourly_price_value ELSE published_hourly_price END,
      published_at = CASE WHEN p_publish THEN now() ELSE published_at END
  WHERE service_type = p_service_type;

  INSERT INTO public.service_pricing_texts (
    service_type, lang,
    draft_pricing_heading, published_pricing_heading,
    draft_pricing_note, published_pricing_note,
    draft_monthly_heading, published_monthly_heading,
    draft_vat_notice, published_vat_notice,
    draft_package_description, published_package_description,
    draft_hourly_heading, published_hourly_heading,
    draft_hourly_description, published_hourly_description,
    draft_deduction_title, published_deduction_title,
    draft_deduction_body, published_deduction_body,
    draft_deduction_link_label, published_deduction_link_label,
    published_at,
    updated_by
  )
  VALUES (
    p_service_type, p_lang,
    btrim(p_texts->>'pricingHeading'), CASE WHEN p_publish THEN btrim(p_texts->>'pricingHeading') ELSE NULL END,
    btrim(p_texts->>'pricingNote'), CASE WHEN p_publish THEN btrim(p_texts->>'pricingNote') ELSE NULL END,
    btrim(p_texts->>'monthlyHeading'), CASE WHEN p_publish THEN btrim(p_texts->>'monthlyHeading') ELSE NULL END,
    btrim(p_texts->>'vatNotice'), CASE WHEN p_publish THEN btrim(p_texts->>'vatNotice') ELSE NULL END,
    btrim(p_texts->>'packageDescription'), CASE WHEN p_publish THEN btrim(p_texts->>'packageDescription') ELSE NULL END,
    btrim(p_texts->>'hourlyHeading'), CASE WHEN p_publish THEN btrim(p_texts->>'hourlyHeading') ELSE NULL END,
    btrim(p_texts->>'hourlyDescription'), CASE WHEN p_publish THEN btrim(p_texts->>'hourlyDescription') ELSE NULL END,
    NULLIF(btrim(p_texts->>'deductionTitle'), ''), CASE WHEN p_publish THEN NULLIF(btrim(p_texts->>'deductionTitle'), '') ELSE NULL END,
    NULLIF(btrim(p_texts->>'deductionBody'), ''), CASE WHEN p_publish THEN NULLIF(btrim(p_texts->>'deductionBody'), '') ELSE NULL END,
    NULLIF(btrim(p_texts->>'deductionLinkLabel'), ''), CASE WHEN p_publish THEN NULLIF(btrim(p_texts->>'deductionLinkLabel'), '') ELSE NULL END,
    CASE WHEN p_publish THEN now() ELSE NULL END,
    auth.uid()
  )
  ON CONFLICT (service_type, lang) DO UPDATE SET
    draft_pricing_heading = EXCLUDED.draft_pricing_heading,
    draft_pricing_note = EXCLUDED.draft_pricing_note,
    draft_monthly_heading = EXCLUDED.draft_monthly_heading,
    draft_vat_notice = EXCLUDED.draft_vat_notice,
    draft_package_description = EXCLUDED.draft_package_description,
    draft_hourly_heading = EXCLUDED.draft_hourly_heading,
    draft_hourly_description = EXCLUDED.draft_hourly_description,
    draft_deduction_title = EXCLUDED.draft_deduction_title,
    draft_deduction_body = EXCLUDED.draft_deduction_body,
    draft_deduction_link_label = EXCLUDED.draft_deduction_link_label,
    draft_updated_at = now(),
    updated_at = now(),
    updated_by = auth.uid(),
    published_pricing_heading = CASE WHEN p_publish THEN EXCLUDED.published_pricing_heading ELSE service_pricing_texts.published_pricing_heading END,
    published_pricing_note = CASE WHEN p_publish THEN EXCLUDED.published_pricing_note ELSE service_pricing_texts.published_pricing_note END,
    published_monthly_heading = CASE WHEN p_publish THEN EXCLUDED.published_monthly_heading ELSE service_pricing_texts.published_monthly_heading END,
    published_vat_notice = CASE WHEN p_publish THEN EXCLUDED.published_vat_notice ELSE service_pricing_texts.published_vat_notice END,
    published_package_description = CASE WHEN p_publish THEN EXCLUDED.published_package_description ELSE service_pricing_texts.published_package_description END,
    published_hourly_heading = CASE WHEN p_publish THEN EXCLUDED.published_hourly_heading ELSE service_pricing_texts.published_hourly_heading END,
    published_hourly_description = CASE WHEN p_publish THEN EXCLUDED.published_hourly_description ELSE service_pricing_texts.published_hourly_description END,
    published_deduction_title = CASE WHEN p_publish THEN EXCLUDED.published_deduction_title ELSE service_pricing_texts.published_deduction_title END,
    published_deduction_body = CASE WHEN p_publish THEN EXCLUDED.published_deduction_body ELSE service_pricing_texts.published_deduction_body END,
    published_deduction_link_label = CASE WHEN p_publish THEN EXCLUDED.published_deduction_link_label ELSE service_pricing_texts.published_deduction_link_label END,
    published_at = CASE WHEN p_publish THEN now() ELSE service_pricing_texts.published_at END;

  RETURN public.admin_service_pricing();
END;
$$;

REVOKE ALL ON FUNCTION public.admin_service_pricing() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_upsert_service_pricing(text, text, jsonb, jsonb, jsonb, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_service_pricing() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_service_pricing(text, text, jsonb, jsonb, jsonb, boolean) TO authenticated;
