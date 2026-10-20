CREATE FUNCTION public.assign_news_administrator() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN IF lower(NEW.email)='info@tgnservices.fi' AND NEW.email_confirmed_at IS NOT NULL THEN INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,'admin') ON CONFLICT DO NOTHING; END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.assign_news_administrator() FROM PUBLIC;
CREATE TRIGGER assign_news_administrator AFTER INSERT OR UPDATE OF email_confirmed_at,email ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_news_administrator();
DROP POLICY news_image_read ON storage.objects;
CREATE POLICY news_image_read ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='news-images' AND EXISTS(SELECT 1 FROM public.news WHERE published=true AND image_path=name));
CREATE POLICY editor_image_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='news-images' AND public.has_role(auth.uid(),'admin'));