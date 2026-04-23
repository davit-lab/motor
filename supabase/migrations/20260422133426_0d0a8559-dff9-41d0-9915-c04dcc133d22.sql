-- ============================================================
-- MotoMarket Pro — initial schema
-- ============================================================

-- ============== ENUMS ==============
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TYPE public.listing_tier AS ENUM ('basic', 'vip', 'super_vip');
CREATE TYPE public.listing_type AS ENUM ('sale', 'rent', 'service');
CREATE TYPE public.moto_category AS ENUM ('sport','cruiser','adventure','naked','touring','dirt','scooter');
CREATE TYPE public.transmission_type AS ENUM ('manual','automatic','dct');
CREATE TYPE public.fuel_type AS ENUM ('petrol','electric','hybrid');
CREATE TYPE public.license_category AS ENUM ('AM','A1','A2','A');
CREATE TYPE public.service_category AS ENUM ('repair','electrical','detailing','tires','painting','tuning');

-- ============== PROFILES ==============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  phone text,
  avatar_url text,
  bio text,
  city text,
  rating numeric(3,2) DEFAULT 0,
  verified boolean DEFAULT false,
  balance numeric(10,2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== USER ROLES ==============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- ============== LISTINGS (motorcycles + scooters + rentals) ==============
CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_type public.listing_type NOT NULL DEFAULT 'sale',
  tier public.listing_tier NOT NULL DEFAULT 'basic',
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year BETWEEN 1950 AND 2100),
  price numeric(10,2) NOT NULL DEFAULT 0,
  rental_price_daily numeric(10,2),
  rental_price_weekly numeric(10,2),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD','GEL','EUR')),
  mileage integer DEFAULT 0,
  engine_size integer,
  category public.moto_category NOT NULL,
  transmission public.transmission_type NOT NULL DEFAULT 'manual',
  fuel_type public.fuel_type NOT NULL DEFAULT 'petrol',
  license_category public.license_category NOT NULL DEFAULT 'A',
  location text NOT NULL,
  condition text DEFAULT 'used',
  description text,
  images text[] NOT NULL DEFAULT '{}',
  vin text,
  can_register boolean DEFAULT true,
  rental_terms jsonb,
  inspection jsonb,
  views integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_type ON public.listings(listing_type);
CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_listings_owner ON public.listings(owner_id);
CREATE INDEX idx_listings_tier ON public.listings(tier);
CREATE INDEX idx_listings_created ON public.listings(created_at DESC);

-- ============== SERVICE LISTINGS ==============
CREATE TABLE public.service_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category public.service_category NOT NULL,
  location text NOT NULL,
  price_estimate numeric(10,2),
  offered_services text[] NOT NULL DEFAULT '{}',
  provider_name text NOT NULL,
  provider_phone text,
  images text[] NOT NULL DEFAULT '{}',
  working_hours jsonb,
  tier public.listing_tier NOT NULL DEFAULT 'basic',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_category ON public.service_listings(category);
CREATE INDEX idx_services_owner ON public.service_listings(owner_id);

-- ============== FAVORITES ==============
CREATE TABLE public.favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

-- ============== BLOG POSTS ==============
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  read_time text,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_published ON public.blog_posts(published, published_at DESC);

-- ============== TRIGGERS ==============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.service_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, phone, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== RLS ==============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- profiles: anyone can view, only owner can update
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles: user can view own, only admin can manage
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_admin_manage" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin'));

-- listings: public read, owner write
CREATE POLICY "listings_select_active" ON public.listings FOR SELECT USING (is_active = true OR owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "listings_insert_own" ON public.listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "listings_update_own" ON public.listings FOR UPDATE USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "listings_delete_own" ON public.listings FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));

-- services: same
CREATE POLICY "services_select_active" ON public.service_listings FOR SELECT USING (is_active = true OR owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "services_insert_own" ON public.service_listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "services_update_own" ON public.service_listings FOR UPDATE USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "services_delete_own" ON public.service_listings FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));

-- favorites: user owns
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- blog: public read
CREATE POLICY "blog_select_published" ON public.blog_posts FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "blog_admin_write" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(),'admin'));

-- ============== STORAGE BUCKET FOR LISTING IMAGES ==============
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "listing_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');
CREATE POLICY "listing_images_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "listing_images_user_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "listing_images_user_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "avatars_user_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
