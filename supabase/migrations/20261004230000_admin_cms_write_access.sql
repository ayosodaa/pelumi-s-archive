-- Admin CMS: give the admin role full write access to every content table,
-- add an About page portrait field, and grant the site owner the admin role.

-- 1. Admin write policies on the original content tables.
--    (The resume tables and storage buckets already have these.)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'website_settings','social_links','navigation','journey_eras','projects',
    'writing','podcast_media','tools_lab','junkyard','galleries','gallery_images'
  ]
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('DROP POLICY IF EXISTS "admins manage" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "admins manage" ON public.%I FOR ALL TO authenticated
         USING (public.has_role(auth.uid(), ''admin''))
         WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
  END LOOP;
END $$;

-- 2. About page portrait.
ALTER TABLE public.website_settings
  ADD COLUMN IF NOT EXISTS about_image_path text;

-- 3. Make sure there is exactly one settings row to edit.
INSERT INTO public.website_settings (site_title, site_short)
SELECT 'Oluwapelumi Samuel', 'O. Samuel'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);

-- 4. Site owner becomes admin: now if the account exists, or on sign-up later.
--    To change the owner, edit the email in both places below.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE lower(email) = 'oluwapelumi.d.samuel@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'oluwapelumi.d.samuel@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_owner_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_owner_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_owner_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();
