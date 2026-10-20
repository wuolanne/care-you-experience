REVOKE EXECUTE ON FUNCTION public.assign_news_administrator() FROM anon,authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) TO authenticated;