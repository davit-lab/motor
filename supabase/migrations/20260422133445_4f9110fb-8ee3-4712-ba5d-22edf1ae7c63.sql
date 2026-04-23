-- Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Restrict broad listing on public buckets:
-- public buckets still allow direct object reads via CDN (object-key needed),
-- but we drop the wildcard SELECT policy that lets anonymous clients enumerate files.
DROP POLICY IF EXISTS "listing_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
