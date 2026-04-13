-- CarScout Complete Seed — Listings + Images + Tags + Price History
-- ============================================================
-- 1. Sign up at /auth/signup first
-- 2. Paste this into Supabase SQL Editor and Run
-- 3. Reload the dashboard — 13 listings with photos will appear
-- Safe to run multiple times.
-- ============================================================

DO $$
DECLARE
  demo_user_id UUID;

  tag_shortlist UUID := 'b0000000-0000-0000-0000-000000000001';
  tag_great_value UUID := 'b0000000-0000-0000-0000-000000000002';
  tag_test_drive UUID := 'b0000000-0000-0000-0000-000000000003';
  tag_needs_inspection UUID := 'b0000000-0000-0000-0000-000000000004';
  tag_negotiating UUID := 'b0000000-0000-0000-0000-000000000005';
  tag_low_km UUID := 'b0000000-0000-0000-0000-000000000006';

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

  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'ipiyale@gmail.com' LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'User ipiyale@gmail.com not found. Sign up with that email first, then re-run this seed.';
  END IF;

  RAISE NOTICE 'Seeding listings for user: %', demo_user_id;

  -- ============================================================
  -- DELETE EXISTING LISTINGS (by source ID) so we can re-insert
  -- with fixed UUIDs. Cascades to listing_tags + price_history.
  -- ============================================================
  DELETE FROM public.listings
  WHERE user_id = demo_user_id
    AND source_listing_id IN (
      '64021847','1923847561','64198423','1028374651920384',
      '64312985','1931029847','63874521','38291',
      '9182736450192837','64501123','1918736452','404938271','1908192847'
    );

  -- ============================================================
  -- LISTINGS (prices in CENTS)
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
    vin, images, thumbnail_url,
    listing_date, created_at, updated_at
  ) VALUES

  -- 1: 2022 Honda Civic EX Sedan · AutoTrader · Toronto ON
  (id_1, demo_user_id,
   'https://www.autotrader.ca/a/honda/civic/toronto/ontario/5_64021847/',
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
   'Confirmed one owner, full service history at Honda dealer. Slightly above CBB average but justified by CPO warranty and low km.',
   NULL,
   '2HGFE2F59NH523456',
   '["https://images.unsplash.com/photo-1606611013004-1a3e0e2c382a?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1606611013004-1a3e0e2c382a?w=400&h=300&fit=crop',
   '2026-03-15', now() - interval '18 days', now() - interval '2 days'),

  -- 2: 2023 Toyota Corolla SE · Kijiji · Montreal QC
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
   'Private sale, barely driven. Still under Toyota factory warranty. Seller relocating to Europe — motivated.',
   NULL,
   'JTDS4RCE7NJ112345',
   '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
   '2026-03-28', now() - interval '12 days', now() - interval '12 days'),

  -- 3: 2023 Honda CR-V EX AWD · AutoTrader · Vancouver BC
  (id_3, demo_user_id,
   'https://www.autotrader.ca/a/honda/cr-v/vancouver/british-columbia/5_64198423/',
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
   'CPO certified — remaining warranty until 2027. Viewing booked Saturday. Will test AWD in rain. CARFAX clean.',
   'Dealer added $800 documentation fee — push back.',
   '7FARS4H35PE012345',
   '["https://images.unsplash.com/photo-1568844293986-8c1a5f8e7e3e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1568844293986-8c1a5f8e7e3e?w=400&h=300&fit=crop',
   '2026-04-01', now() - interval '9 days', now() - interval '1 day'),

  -- 4: 2022 Mazda3 GX Hatchback (Manual) · Facebook · Calgary AB
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
   'Manual hatch below CBB average. Winter tires on separate rims included (~$1,200 value). Seller works rigs, barely drove it.',
   NULL,
   '3MZBP1L78NM234567',
   '["https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop',
   '2026-04-02', now() - interval '8 days', now() - interval '8 days'),

  -- 5: 2023 Ford F-150 XLT SuperCrew 4x4 · AutoTrader · Edmonton AB
  (id_5, demo_user_id,
   'https://www.autotrader.ca/a/ford/f-150/edmonton/alberta/5_64312985/',
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
   'Tow package, remote start. Near top of CBB range — target $47,000.',
   NULL,
   '1FTFW1E57NFA12345',
   '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop',
   '2026-04-03', now() - interval '7 days', now() - interval '7 days'),

  -- 6: 2023 Hyundai Elantra Preferred · Kijiji · Toronto ON
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
   'Hyundai warranty still active. Seller buying a house and needs cash — priced to sell.',
   NULL,
   'KMHLL4AG5NU345678',
   '["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
   '2026-04-04', now() - interval '6 days', now() - interval '6 days'),

  -- 7: 2022 Kia Forte EX · AutoTrader · Ottawa ON
  (id_7, demo_user_id,
   'https://www.autotrader.ca/a/kia/forte/ottawa/ontario/5_63874521/',
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
   'Clean CARFAX. Above CBB average but has sunroof which adds value. Compare to the Elantra.',
   NULL,
   '3KPF24AD1NE456789',
   '["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=300&fit=crop',
   '2026-03-20', now() - interval '20 days', now() - interval '20 days'),

  -- 8: 2023 Toyota RAV4 LE AWD · Clutch · Vancouver BC
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
   'Clutch 210-point inspection clean. BCAA inspection — no issues. 10-day return policy. Top pick for reliability.',
   NULL,
   '2T3P1RFV8NW567890',
   '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
   '2026-03-25', now() - interval '15 days', now() - interval '3 days'),

  -- 9: 2022 Subaru Impreza Premium AWD · Facebook · Calgary AB
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
   'Winter tires on dedicated rims. Subaru symmetrical AWD fantastic for mountain roads. All service at Subaru dealer.',
   NULL,
   'JF1GU7L63NH678901',
   '["https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop',
   '2026-04-05', now() - interval '5 days', now() - interval '5 days'),

  -- 10: 2023 Chevrolet Silverado 1500 RST · AutoTrader · Calgary AB
  (id_10, demo_user_id,
   'https://www.autotrader.ca/a/chevrolet/silverado%201500/calgary/alberta/5_64501123/',
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
   'Crew cab, trailering package. Priced near CBB high — negotiate $1,500-$2,000 off.',
   'Window sticker shows $1,200 market adjustment. Call this out immediately.',
   '1GCUYEED7NZ789012',
   '["https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
   '2026-04-06', now() - interval '4 days', now() - interval '4 days'),

  -- 11: 2022 Mazda CX-5 GS AWD · Kijiji · Montreal QC
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
   'Just above CBB average but private sale means no dealer markup. Bose audio and sunroof add real value.',
   NULL,
   'JM3KFBCM1N0890123',
   '["https://images.unsplash.com/photo-1551501819-1bfab158b3f4?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1551501819-1bfab158b3f4?w=400&h=300&fit=crop',
   '2026-04-01', now() - interval '9 days', now() - interval '9 days'),

  -- 12: 2023 VW Golf GTI Autobahn · CarGurus · Toronto ON
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
   'Lowest mileage GTI available. Manual with DCC suspension = enthusiast spec. At CBB average which is fair.',
   NULL,
   '3VW6T7AU6NM901234',
   '["https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop',
   '2026-04-07', now() - interval '3 days', now() - interval '3 days'),

  -- 13: 2022 Toyota Camry LE · Kijiji · Ottawa ON
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
   'Full Toyota dealer service history, one owner, always garaged. At CBB average — solid reliable choice.',
   NULL,
   '4T1G11AK8NU012345',
   '["https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop"]',
   'https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=400&h=300&fit=crop',
   '2026-03-22', now() - interval '17 days', now() - interval '17 days')

  ON CONFLICT (id) DO NOTHING;

  -- ============================================================
  -- TAGS
  -- ============================================================
  INSERT INTO public.tags (id, user_id, name, color) VALUES
    (tag_shortlist,        demo_user_id, 'Shortlist',        '#3b82f6'),
    (tag_great_value,      demo_user_id, 'Great Value',      '#22c55e'),
    (tag_test_drive,       demo_user_id, 'Test Drive',       '#f59e0b'),
    (tag_needs_inspection, demo_user_id, 'Needs Inspection', '#ef4444'),
    (tag_negotiating,      demo_user_id, 'Negotiating',      '#8b5cf6'),
    (tag_low_km,           demo_user_id, 'Low KM',           '#06b6d4')
  ON CONFLICT (user_id, name) DO NOTHING;

  -- ============================================================
  -- TAG ASSIGNMENTS
  -- ============================================================
  INSERT INTO public.listing_tags (listing_id, tag_id) VALUES
    (id_1, tag_shortlist), (id_1, tag_negotiating),
    (id_2, tag_great_value), (id_2, tag_low_km),
    (id_3, tag_shortlist), (id_3, tag_test_drive),
    (id_4, tag_great_value),
    (id_5, tag_needs_inspection),
    (id_6, tag_great_value),
    (id_8, tag_shortlist), (id_8, tag_low_km),
    (id_12, tag_shortlist), (id_12, tag_low_km)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- PRICE HISTORY (multiple points for chart)
  -- ============================================================
  -- Clear old price history for these listings to avoid duplicates
  DELETE FROM public.price_history WHERE listing_id IN (id_1, id_3, id_5, id_8, id_10, id_12);

  -- Honda Civic — steady then dropped $1,000
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_1, 2399900, now() - interval '18 days'),
    (id_1, 2399900, now() - interval '14 days'),
    (id_1, 2349900, now() - interval '10 days'),
    (id_1, 2299900, now() - interval '5 days'),
    (id_1, 2299900, now() - interval '1 day');

  -- Honda CR-V — dropped from $33,500
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_3, 3350000, now() - interval '20 days'),
    (id_3, 3350000, now() - interval '15 days'),
    (id_3, 3250000, now() - interval '9 days'),
    (id_3, 3195000, now() - interval '4 days');

  -- Ford F-150 — two price drops from $51K
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_5, 5100000, now() - interval '21 days'),
    (id_5, 4999900, now() - interval '14 days'),
    (id_5, 4899900, now() - interval '7 days'),
    (id_5, 4850000, now() - interval '3 days');

  -- RAV4 — seller dropped price twice from $36,500
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_8, 3650000, now() - interval '25 days'),
    (id_8, 3550000, now() - interval '15 days'),
    (id_8, 3475000, now() - interval '5 days');

  -- Silverado — aggressive drops from $52K
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_10, 5199900, now() - interval '18 days'),
    (id_10, 4999900, now() - interval '12 days'),
    (id_10, 4899900, now() - interval '7 days'),
    (id_10, 4799900, now() - interval '1 day');

  -- Golf GTI — stable, no drops
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_12, 3299500, now() - interval '14 days'),
    (id_12, 3299500, now() - interval '7 days'),
    (id_12, 3299500, now() - interval '1 day');

  RAISE NOTICE 'Seed complete! 13 listings with images, 6 tags, and price history added.';

END;
$$;
