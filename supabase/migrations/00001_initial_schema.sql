-- CarScout Database Schema
-- All prices stored in cents (integer) to avoid floating-point issues

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  province TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Core listings table (modeled after user's Airtable workflow)
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Source info
  source_url TEXT NOT NULL,
  source_marketplace TEXT NOT NULL,
  source_listing_id TEXT,

  -- Vehicle identity
  vin TEXT,
  year INTEGER,
  make TEXT,
  model TEXT,
  trim TEXT,

  -- Vehicle details
  body_type TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  transmission TEXT,
  fuel_type TEXT,
  drivetrain TEXT,
  engine TEXT,
  mileage_km INTEGER,
  vehicle_options JSONB DEFAULT '[]',
  has_winter_tires BOOLEAN,
  add_ons TEXT,

  -- Pricing & negotiation
  listed_price_cad INTEGER,
  negotiated_price_cad INTEGER,
  cbb_low INTEGER,
  cbb_average INTEGER,
  cbb_high INTEGER,
  cbb_link TEXT,
  negotiating_position TEXT,

  -- Condition & history
  accident_history TEXT,
  damage_description TEXT,
  good_service_record BOOLEAN,
  num_owners INTEGER,
  reason_for_selling TEXT,
  carfax_url TEXT,

  -- Location
  city TEXT,
  province TEXT,
  postal_code TEXT,

  -- Seller & communication
  seller_name TEXT,
  seller_type TEXT,
  dealership_name TEXT,
  dealership_website TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  conversation_platform TEXT,
  conversation_link TEXT,

  -- Media
  images JSONB DEFAULT '[]',
  thumbnail_url TEXT,

  -- User research & tracking
  user_notes TEXT,
  red_flags TEXT,
  learnings TEXT,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  status TEXT DEFAULT 'saved',
  is_available BOOLEAN DEFAULT true,
  is_strong_contender BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,

  -- Raw scraper data
  raw_scraped_data JSONB,

  -- Timestamps
  listing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Prevent saving same listing twice
  UNIQUE(user_id, source_marketplace, source_listing_id)
);

-- Price history tracking
CREATE TABLE public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  price_cad INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- User tags for organization
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  UNIQUE(user_id, name)
);

CREATE TABLE public.listing_tags (
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, tag_id)
);

-- Comparison groups
CREATE TABLE public.comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.comparison_listings (
  comparison_id UUID REFERENCES public.comparisons(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (comparison_id, listing_id)
);

-- Guide checklist progress
CREATE TABLE public.checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  checklist_type TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, listing_id, checklist_type)
);

-- Affiliate click tracking
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_listings_user_id ON public.listings(user_id);
CREATE INDEX idx_listings_status ON public.listings(user_id, status);
CREATE INDEX idx_listings_source ON public.listings(source_marketplace);
CREATE INDEX idx_listings_make_model ON public.listings(make, model);
CREATE INDEX idx_listings_price ON public.listings(listed_price_cad);
CREATE INDEX idx_price_history_listing ON public.price_history(listing_id, recorded_at);
CREATE INDEX idx_affiliate_clicks_service ON public.affiliate_clicks(service_name);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own listings"
  ON public.listings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view price history of own listings"
  ON public.price_history FOR ALL
  USING (listing_id IN (SELECT id FROM public.listings WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own tags"
  ON public.tags FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own listing tags"
  ON public.listing_tags FOR ALL
  USING (listing_id IN (SELECT id FROM public.listings WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own comparisons"
  ON public.comparisons FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own comparison listings"
  ON public.comparison_listings FOR ALL
  USING (comparison_id IN (SELECT id FROM public.comparisons WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own checklist progress"
  ON public.checklist_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affiliate clicks"
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own affiliate clicks"
  ON public.affiliate_clicks FOR SELECT
  USING (auth.uid() = user_id);
