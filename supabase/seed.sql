-- CarScout Demo Seed Data
-- ============================================================
-- HOW TO USE:
--   1. Sign up at /auth/signup to create your account first
--   2. Open your Supabase project → SQL Editor
--   3. Paste this entire file and click "Run"
--   4. Reload the CarScout dashboard — 13 listings will appear
--
-- Safe to run multiple times — uses ON CONFLICT DO NOTHING.
-- Seeds listings into the first user account found.
-- ============================================================

DO $$
DECLARE
  demo_user_id UUID;

  -- Stable UUIDs so this is idempotent (safe to re-run)
  id_1  UUID := 'a0000000-0000-0000-0000-000000000001';
  id_2  UUID := 'a0000000-0000-0000-0000-000000000002';
  id_3  UUID := 'a0000000-0000-0000-0000-000000000003';
  id_4  UUID := 'a0000000-0000-0000-0000-000000000004';
  id_5  UUID := 'a0000000-0000-0000-0000-000000000005';
  id_6  UUID := 'a0000000-0000-0000-0000-000000000006';
  id_7  UUID := 'a0000000-0000-0000-0000-000000000007';
  id_8  UUID := 'a0000000-0000-0000-0000-000000000008';
  id_9  UUID := 'a0000000-0000-0000-0000-000000000009';
  id_10 UUID := 'a0000000-0000-0000-0000-000000000010';
  id_11 UUID := 'a0000000-0000-0000-0000-000000000011';
  id_12 UUID := 'a0000000-0000-0000-0000-000000000012';
  id_13 UUID := 'a0000000-0000-0000-0000-000000000013';

BEGIN

  -- Get the first user (sign up first if this errors)
  SELECT id INTO demo_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Create an account at /auth/signup first, then re-run this seed.';
  END IF;

  RAISE NOTICE 'Seeding listings for user: %', demo_user_id;

  -- ============================================================
  -- LISTINGS  (all prices in CENTS, i.e. CAD × 100)
  -- ============================================================
  INSERT INTO public.listings (
    id, user_id,
    source_url, source_marketplace, source_listing_id,
    year, make, model, trim,
    body_type, exterior_color, transmission, fuel_type, drivetrain,
    mileage_km, listed_price_cad,
    cbb_low, cbb_average, cbb_high,
    city, province,
    seller_type, seller_name, dealership_name,
    accident_history, good_service_record, num_owners,
    has_winter_tires, vehicle_options,
    is_strong_contender, is_favorite,
    status, user_notes, red_flags,
    listing_date, created_at, updated_at
  ) VALUES

  -- 1 ─ 2022 Honda Civic EX Sedan · AutoTrader · Toronto ON · Dealer
  (id_1, demo_user_id,
   'https://www.autotrader.ca/a/honda/civic/toronto/ontario/5_64021847_20230415093012541/',
   'autotrader', '64021847',
   2022, 'Honda', 'Civic', 'EX Sedan',
   'Sedan', 'Lunar Silver Metallic', 'Automatic', 'Gasoline', 'FWD',
   45230, 2299900,
   2050000, 2220000, 2480000,
   'Toronto', 'ON',
   'dealer', NULL, 'Scarborough Honda',
   'None reported', true, 1,
   false, '["Heated front seats","Apple CarPlay","Android Auto","Lane keep assist","Adaptive cruise control","Honda Sensing"]',
   true, true,
   'contacted',
   'Confirmed one owner, full service history at Honda dealer. Slightly above CBB average but justified by CPO warranty and low km. Dealer was easy to deal with — ask about $500 off for paying cash.',
   NULL,
   '2026-03-15', now() - interval '18 days', now() - interval '2 days'),

  -- 2 ─ 2023 Toyota Corolla SE Sedan · Kijiji · Montréal QC · Private
  (id_2, demo_user_id,
   'https://www.kijijiautos.ca/vdp/1923847561/',
   'kijiji', '1923847561',
   2023, 'Toyota', 'Corolla', 'SE Sedan',
   'Sedan', 'Blue Crush Metallic', 'Automatic', 'Gasoline', 'FWD',
   28500, 2485600,
   2200000, 2380000, 2600000,
   'Montréal', 'QC',
   'private', 'Marc Tremblay', NULL,
   'None reported', true, 1,
   false, '["Heated seats","Backup camera","Bluetooth","Lane departure warning"]',
   false, false,
   'saved',
   'Private sale, barely driven. Still under Toyota factory warranty. Seller relocating to Europe in May — motivated.',
   NULL,
   '2026-03-28', now() - interval '12 days', now() - interval '12 days'),

  -- 3 ─ 2023 Honda CR-V EX AWD · AutoTrader · Vancouver BC · Dealer
  (id_3, demo_user_id,
   'https://www.autotrader.ca/a/honda/cr-v/vancouver/british-columbia/5_64198423_20230801114523781/',
   'autotrader', '64198423',
   2023, 'Honda', 'CR-V', 'EX AWD',
   'SUV', 'Sonic Grey Pearl', 'Automatic', 'Gasoline', 'AWD',
   18700, 3195000,
   2950000, 3100000, 3380000,
   'Vancouver', 'BC',
   'dealer', NULL, 'OpenRoad Honda Boundary',
   'None reported', true, 1,
   false, '["Heated seats","Heated steering wheel","Apple CarPlay","Android Auto","Honda Sensing suite","Power liftgate","Remote start"]',
   true, false,
   'viewing_scheduled',
   'CPO certified — remaining warranty until 2027. Loaded trim. Viewing booked Saturday 10 AM. Will test AWD system in the rain. Already ran CARFAX — clean.',
   'Dealer added $800 "documentation fee" on the quote. Push back — that is negotiable.',
   '2026-04-01', now() - interval '9 days', now() - interval '1 day'),

  -- 4 ─ 2022 Mazda3 GX Hatchback (Manual) · Facebook · Calgary AB · Private
  (id_4, demo_user_id,
   'https://www.facebook.com/marketplace/item/1028374651920384/',
   'facebook', '1028374651920384',
   2022, 'Mazda', 'Mazda3', 'GX Hatchback',
   'Hatchback', 'Soul Red Crystal', 'Manual', 'Gasoline', 'FWD',
   52100, 1945000,
   1700000, 1880000, 2100000,
   'Calgary', 'AB',
   'private', 'Devon Park', NULL,
   'None reported', true, 1,
   true, '["Heated seats","Backup camera","Bluetooth","Mazda Connect infotainment"]',
   false, false,
   'saved',
   'Manual hatch below CBB average. Winter tires on separate rims included — that alone is worth ~$1,200. Seller works on rigs out of province and barely drove it.',
   NULL,
   '2026-04-02', now() - interval '8 days', now() - interval '8 days'),

  -- 5 ─ 2023 Ford F-150 XLT SuperCrew 4x4 · AutoTrader · Edmonton AB · Dealer
  (id_5, demo_user_id,
   'https://www.autotrader.ca/a/ford/f-150/edmonton/alberta/5_64312985_20230920083401234/',
   'autotrader', '64312985',
   2023, 'Ford', 'F-150', 'XLT SuperCrew 4x4',
   'Pickup Truck', 'Oxford White', 'Automatic', 'Gasoline', '4WD',
   31200, 4850000,
   4400000, 4680000, 5100000,
   'Edmonton', 'AB',
   'dealer', NULL, 'Crosstown Ford',
   'None reported', true, 1,
   false, '["Tow package","Backup camera","SYNC 4","Heated front seats","Remote start","FordPass Connect","Bed liner"]',
   false, false,
   'saved',
   'Tow package, remote start. Near top of CBB range so room to negotiate — target $47,000. Ask about fleet pricing programs.',
   NULL,
   '2026-04-03', now() - interval '7 days', now() - interval '7 days'),

  -- 6 ─ 2023 Hyundai Elantra Preferred · Kijiji · Toronto ON · Private
  (id_6, demo_user_id,
   'https://www.kijijiautos.ca/vdp/1931029847/',
   'kijiji', '1931029847',
   2023, 'Hyundai', 'Elantra', 'Preferred',
   'Sedan', 'Calypso Red', 'Automatic', 'Gasoline', 'FWD',
   22800, 2099900,
   1920000, 2050000, 2250000,
   'Toronto', 'ON',
   'private', 'Priya Sharma', NULL,
   'None reported', true, 1,
   false, '["Heated seats","Heated steering wheel","Apple CarPlay","Android Auto","Blind spot monitor","Safe exit warning"]',
   false, false,
   'saved',
   'Hyundai warranty still active. Seller buying a house and needs the cash quickly — priced to sell. Good value next to the Civic.',
   NULL,
   '2026-04-04', now() - interval '6 days', now() - interval '6 days'),

  -- 7 ─ 2022 Kia Forte EX Sedan · AutoTrader · Ottawa ON · Dealer
  (id_7, demo_user_id,
   'https://www.autotrader.ca/a/kia/forte/ottawa/ontario/5_63874521_20230210121502344/',
   'autotrader', '63874521',
   2022, 'Kia', 'Forte', 'EX Sedan',
   'Sedan', 'Cherry Black Pearl', 'Automatic', 'Gasoline', 'FWD',
   38900, 1989500,
   1750000, 1900000, 2100000,
   'Ottawa', 'ON',
   'dealer', NULL, 'Myers Kia Ottawa',
   'None reported', true, 1,
   false, '["Heated seats","Sunroof","Apple CarPlay","Android Auto","Backup camera","Forward collision warning"]',
   false, false,
   'saved',
   'Clean CARFAX. Above CBB average but has the sunroof which adds value. Compare to the Elantra — both good options in Ottawa.',
   NULL,
   '2026-03-20', now() - interval '20 days', now() - interval '20 days'),

  -- 8 ─ 2023 Toyota RAV4 LE AWD · Clutch · Vancouver BC · Dealer
  (id_8, demo_user_id,
   'https://www.clutch.ca/vehicles/2023-toyota-rav4-le-awd-vancouver-38291',
   'clutch', '38291',
   2023, 'Toyota', 'RAV4', 'LE AWD',
   'SUV', 'Blueprint', 'Automatic', 'Gasoline', 'AWD',
   24500, 3475000,
   3150000, 3350000, 3620000,
   'Vancouver', 'BC',
   'dealer', NULL, 'Clutch Canada',
   'None reported', true, 1,
   false, '["Toyota Safety Sense","Backup camera","Apple CarPlay","Android Auto","AWD","Heated seats"]',
   true, false,
   'inspected',
   'Clutch 210-point inspection came back clean. Paid $89 for third-party BCAA inspection — no issues. 10-day return policy is a safety net. Great AWD for BC mountains. Top pick for reliability.',
   NULL,
   '2026-03-25', now() - interval '15 days', now() - interval '3 days'),

  -- 9 ─ 2022 Subaru Impreza Premium AWD · Facebook · Calgary AB · Private
  (id_9, demo_user_id,
   'https://www.facebook.com/marketplace/item/9182736450192837/',
   'facebook', '9182736450192837',
   2022, 'Subaru', 'Impreza', 'Premium Sedan AWD',
   'Sedan', 'Ice Silver Metallic', 'Automatic', 'Gasoline', 'AWD',
   41200, 2345000,
   2050000, 2220000, 2450000,
   'Calgary', 'AB',
   'private', 'Kyle Andersen', NULL,
   'None reported', true, 1,
   true, '["Heated seats","Backup camera","Subaru EyeSight driver assist","Symmetrical AWD","Starlink multimedia"]',
   false, false,
   'saved',
   'New winter tires on dedicated rims. Subaru symmetrical AWD is fantastic for mountain roads out of Calgary. All service at Subaru dealer.',
   NULL,
   '2026-04-05', now() - interval '5 days', now() - interval '5 days'),

  -- 10 ─ 2023 Chevrolet Silverado 1500 RST Crew Cab · AutoTrader · Calgary AB · Dealer
  (id_10, demo_user_id,
   'https://www.autotrader.ca/a/chevrolet/silverado%201500/calgary/alberta/5_64501123_20231105092311000/',
   'autotrader', '64501123',
   2023, 'Chevrolet', 'Silverado 1500', 'RST Crew Cab 4x4',
   'Pickup Truck', 'Dark Ash Metallic', 'Automatic', 'Gasoline', '4WD',
   35600, 4799900,
   4300000, 4580000, 5000000,
   'Calgary', 'AB',
   'dealer', NULL, 'Eastside GM',
   'None reported', true, 1,
   false, '["RST appearance package","Trailering package","Remote start","Heated seats","MyLink infotainment","Integrated assist steps","Backup camera"]',
   false, false,
   'saved',
   'Crew cab, trailering package. Priced near CBB high — budget to negotiate $1,500–$2,000 off.',
   'Window sticker shows a $1,200 "market adjustment" charge. Call this out immediately.',
   '2026-04-06', now() - interval '4 days', now() - interval '4 days'),

  -- 11 ─ 2022 Mazda CX-5 GS AWD · Kijiji · Montréal QC · Private
  (id_11, demo_user_id,
   'https://www.kijijiautos.ca/vdp/1918736452/',
   'kijiji', '1918736452',
   2022, 'Mazda', 'CX-5', 'GS AWD',
   'SUV', 'Deep Crystal Blue', 'Automatic', 'Gasoline', 'AWD',
   48300, 2850000,
   2550000, 2740000, 3000000,
   'Montréal', 'QC',
   'private', 'Sophie Lavoie', NULL,
   'None reported', true, 1,
   false, '["Heated seats","Heated steering wheel","Bose audio","Sunroof","Apple CarPlay","Blind spot monitoring","Rear cross-traffic alert"]',
   false, false,
   'saved',
   'Just above CBB average but private sale means no dealer markup. Bose audio and sunroof add real value. No accidents on CARFAX.',
   NULL,
   '2026-04-01', now() - interval '9 days', now() - interval '9 days'),

  -- 12 ─ 2023 Volkswagen Golf GTI Autobahn · CarGurus · Toronto ON · Dealer
  (id_12, demo_user_id,
   'https://www.cargurus.ca/Cars/new/nl/Used-2023-Volkswagen-Golf-GTI-d2652#listing=404938271',
   'cargurus', '404938271',
   2023, 'Volkswagen', 'Golf', 'GTI Autobahn',
   'Hatchback', 'Deep Black Pearl Effect', 'Manual', 'Gasoline', 'FWD',
   16450, 3299500,
   3000000, 3200000, 3500000,
   'Toronto', 'ON',
   'dealer', NULL, 'Downtown VW',
   'None reported', true, 1,
   false, '["Leather seats","Panoramic sunroof","Harman Kardon audio","DCC adaptive dampers","Digital cockpit pro","Heated seats","Wireless charging","Park distance control"]',
   false, false,
   'saved',
   'Lowest mileage GTI I could find. Manual with DCC suspension is the enthusiast spec. GTIs hold value — this is at CBB average which is fair. Pfaff/Downtown VW has solid rep.',
   NULL,
   '2026-04-07', now() - interval '3 days', now() - interval '3 days'),

  -- 13 ─ 2022 Toyota Camry LE Sedan · Kijiji · Ottawa ON · Dealer
  (id_13, demo_user_id,
   'https://www.kijijiautos.ca/vdp/1908192847/',
   'kijiji', '1908192847',
   2022, 'Toyota', 'Camry', 'LE Sedan',
   'Sedan', 'Celestial Silver Metallic', 'Automatic', 'Gasoline', 'FWD',
   43500, 2675000,
   2400000, 2580000, 2820000,
   'Ottawa', 'ON',
   'dealer', NULL, 'Georgetown Toyota',
   'None reported', true, 1,
   false, '["Apple CarPlay","Android Auto","Backup camera","Toyota Safety Sense","Heated front seats","Remote start","Blind spot monitor"]',
   false, false,
   'saved',
   'Full Toyota dealer service history, one previous owner, always garaged. Priced at CBB average — no haggle but solid reliable choice. Great long-term ownership car.',
   NULL,
   '2026-03-22', now() - interval '17 days', now() - interval '17 days')

  ON CONFLICT (user_id, source_marketplace, source_listing_id) DO NOTHING;

  -- ============================================================
  -- PRICE HISTORY  (initial price when saved)
  -- Conflict target: no unique constraint on price_history, so
  -- we only insert if the listing was just created above.
  -- ============================================================
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_1,  2299900, now() - interval '18 days' WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_1  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_2,  2485600, now() - interval '12 days' WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_2  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_3,  3250000, now() - interval '9 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_3  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_3,  3195000, now() - interval '4 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_3  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_4,  1945000, now() - interval '8 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_4  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_5,  4850000, now() - interval '7 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_5  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_6,  2099900, now() - interval '6 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_6  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_7,  1989500, now() - interval '20 days' WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_7  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_8,  3550000, now() - interval '15 days' WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_8  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_8,  3475000, now() - interval '5 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_8  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_9,  2345000, now() - interval '5 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_9  AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_10, 4899900, now() - interval '4 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_10 AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_10, 4799900, now() - interval '1 day'   WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_10 AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_11, 2850000, now() - interval '9 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_11 AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_12, 3299500, now() - interval '3 days'  WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_12 AND created_at > now() - interval '1 minute');
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at)
  SELECT id_13, 2675000, now() - interval '17 days' WHERE EXISTS (SELECT 1 FROM public.listings WHERE id = id_13 AND created_at > now() - interval '1 minute');

  RAISE NOTICE 'Seed complete! 13 listings added for user %.', demo_user_id;

END;
$$;
