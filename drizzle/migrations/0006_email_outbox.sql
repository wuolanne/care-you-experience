CREATE TABLE public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL CHECK (request_type IN ('contact', 'booking', 'service_start')),
  request_id uuid NOT NULL,
  recipient_key text NOT NULL CHECK (recipient_key IN ('contact', 'booking', 'service_start')),
  recipient text,
  reply_to text,
  subject text NOT NULL,
  payload jsonb NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'accepted', 'failed', 'blocked')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  provider_id text,
  last_error text,
  available_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX email_outbox_delivery_idx
  ON public.email_outbox (status, available_at);

ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.email_outbox TO service_role;
REVOKE ALL ON public.email_outbox FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_contact_submission_with_notification(
  p_email text,
  p_message text,
  p_lang text,
  p_recipient text,
  p_reply_to text,
  p_subject text,
  p_payload jsonb,
  p_idempotency_key text
) RETURNS TABLE(request_id uuid, outbox_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  existing_request uuid;
  existing_outbox uuid;
  new_request uuid;
  new_outbox uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_idempotency_key));

  SELECT e.request_id, e.id INTO existing_request, existing_outbox
    FROM public.email_outbox e
    WHERE e.idempotency_key = p_idempotency_key;
  IF existing_outbox IS NOT NULL THEN
    RETURN QUERY SELECT existing_request, existing_outbox;
    RETURN;
  END IF;

  INSERT INTO public.contact_submissions (email, message, lang)
    VALUES (p_email, p_message, p_lang)
    RETURNING id INTO new_request;

  INSERT INTO public.email_outbox (
    request_type, request_id, recipient_key, recipient, reply_to, subject,
    payload, idempotency_key, status
  ) VALUES (
    'contact', new_request, 'contact', NULLIF(btrim(p_recipient), ''),
    NULLIF(btrim(p_reply_to), ''), p_subject, p_payload, p_idempotency_key,
    CASE WHEN NULLIF(btrim(p_recipient), '') IS NULL THEN 'blocked' ELSE 'pending' END
  ) RETURNING id INTO new_outbox;

  RETURN QUERY SELECT new_request, new_outbox;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_booking_request_with_notification(
  p_meeting_date date,
  p_preferred_time text,
  p_contact_email text,
  p_lang text,
  p_recipient text,
  p_reply_to text,
  p_subject text,
  p_payload jsonb,
  p_idempotency_key text
) RETURNS TABLE(request_id uuid, outbox_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  existing_request uuid;
  existing_outbox uuid;
  new_request uuid;
  new_outbox uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_idempotency_key));

  SELECT e.request_id, e.id INTO existing_request, existing_outbox
    FROM public.email_outbox e
    WHERE e.idempotency_key = p_idempotency_key;
  IF existing_outbox IS NOT NULL THEN
    RETURN QUERY SELECT existing_request, existing_outbox;
    RETURN;
  END IF;

  INSERT INTO public.booking_requests (meeting_date, preferred_time, contact_email, lang)
    VALUES (p_meeting_date, p_preferred_time, p_contact_email, p_lang)
    RETURNING id INTO new_request;

  INSERT INTO public.email_outbox (
    request_type, request_id, recipient_key, recipient, reply_to, subject,
    payload, idempotency_key, status
  ) VALUES (
    'booking', new_request, 'booking', NULLIF(btrim(p_recipient), ''),
    NULLIF(btrim(p_reply_to), ''), p_subject, p_payload, p_idempotency_key,
    CASE WHEN NULLIF(btrim(p_recipient), '') IS NULL THEN 'blocked' ELSE 'pending' END
  ) RETURNING id INTO new_outbox;

  RETURN QUERY SELECT new_request, new_outbox;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_service_start_request_with_notification(
  p_customer_name text,
  p_contact_person text,
  p_email text,
  p_work_address text,
  p_start_date date,
  p_start_time text,
  p_service_type text,
  p_once_details text,
  p_package_name text,
  p_lang text,
  p_recipient text,
  p_reply_to text,
  p_subject text,
  p_payload jsonb,
  p_idempotency_key text
) RETURNS TABLE(request_id uuid, outbox_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  existing_request uuid;
  existing_outbox uuid;
  new_request uuid;
  new_outbox uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_idempotency_key));

  SELECT e.request_id, e.id INTO existing_request, existing_outbox
    FROM public.email_outbox e
    WHERE e.idempotency_key = p_idempotency_key;
  IF existing_outbox IS NOT NULL THEN
    RETURN QUERY SELECT existing_request, existing_outbox;
    RETURN;
  END IF;

  INSERT INTO public.service_start_requests (
    customer_name, contact_person, email, work_address, start_date, start_time,
    service_type, once_details, package_name, lang
  ) VALUES (
    p_customer_name, p_contact_person, p_email, p_work_address, p_start_date,
    p_start_time, p_service_type, p_once_details, p_package_name, p_lang
  ) RETURNING id INTO new_request;

  INSERT INTO public.email_outbox (
    request_type, request_id, recipient_key, recipient, reply_to, subject,
    payload, idempotency_key, status
  ) VALUES (
    'service_start', new_request, 'service_start', NULLIF(btrim(p_recipient), ''),
    NULLIF(btrim(p_reply_to), ''), p_subject, p_payload, p_idempotency_key,
    CASE WHEN NULLIF(btrim(p_recipient), '') IS NULL THEN 'blocked' ELSE 'pending' END
  ) RETURNING id INTO new_outbox;

  RETURN QUERY SELECT new_request, new_outbox;
END;
$$;

REVOKE ALL ON FUNCTION public.create_contact_submission_with_notification(text, text, text, text, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_booking_request_with_notification(date, text, text, text, text, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_service_start_request_with_notification(text, text, text, text, date, text, text, text, text, text, text, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_contact_submission_with_notification(text, text, text, text, text, text, jsonb, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_booking_request_with_notification(date, text, text, text, text, text, text, jsonb, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_service_start_request_with_notification(text, text, text, text, date, text, text, text, text, text, text, text, text, jsonb, text) TO service_role;

CREATE OR REPLACE FUNCTION public.throttle_booking_requests() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  recent integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('booking_requests' || lower(NEW.contact_email)));
  SELECT count(*) INTO recent
    FROM public.booking_requests
    WHERE lower(contact_email) = lower(NEW.contact_email)
      AND created_at > now() - interval '1 minute';
  IF recent >= 3 THEN
    RAISE EXCEPTION 'Too many requests';
  END IF;
  NEW.created_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.throttle_booking_requests() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS booking_throttle ON public.booking_requests;
CREATE TRIGGER booking_throttle
  BEFORE INSERT ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.throttle_booking_requests();
