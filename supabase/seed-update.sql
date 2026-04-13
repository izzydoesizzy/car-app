-- CarScout Seed Update — Images, Tags, Price History
-- ============================================================
-- Run this AFTER the original seed.sql
-- Adds: car photos, sample tags, extra price history points, VINs
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

  SELECT id INTO demo_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Create an account first.';
  END IF;

  -- ============================================================
  -- 1. UPDATE LISTINGS WITH IMAGES AND VINs
  -- ============================================================

  -- Honda Civic — silver sedan
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1606611013004-1a3e0e2c382a?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1606611013004-1a3e0e2c382a?w=400&h=300&fit=crop',
    vin = '2HGFE2F59NH523456'
  WHERE id = id_1;

  -- Toyota Corolla — blue sedan
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
    vin = 'JTDS4RCE7NJ112345'
  WHERE id = id_2;

  -- Honda CR-V — grey SUV
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1568844293986-8c1a5f8e7e3e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1568844293986-8c1a5f8e7e3e?w=400&h=300&fit=crop',
    vin = '7FARS4H35PE012345'
  WHERE id = id_3;

  -- Mazda3 — red hatchback
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop',
    vin = '3MZBP1L78NM234567'
  WHERE id = id_4;

  -- Ford F-150 — white truck
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop',
    vin = '1FTFW1E57NFA12345'
  WHERE id = id_5;

  -- Hyundai Elantra — red sedan
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
    vin = 'KMHLL4AG5NU345678'
  WHERE id = id_6;

  -- Kia Forte — black sedan
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=300&fit=crop',
    vin = '3KPF24AD1NE456789'
  WHERE id = id_7;

  -- Toyota RAV4 — blue SUV
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
    vin = '2T3P1RFV8NW567890'
  WHERE id = id_8;

  -- Subaru Impreza — silver sedan
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop',
    vin = 'JF1GU7L63NH678901'
  WHERE id = id_9;

  -- Chevrolet Silverado — dark grey truck
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
    vin = '1GCUYEED7NZ789012'
  WHERE id = id_10;

  -- Mazda CX-5 — blue SUV
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1551501819-1bfab158b3f4?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1551501819-1bfab158b3f4?w=400&h=300&fit=crop',
    vin = 'JM3KFBCM1N0890123'
  WHERE id = id_11;

  -- VW Golf GTI — black hatchback
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop',
    vin = '3VW6T7AU6NM901234'
  WHERE id = id_12;

  -- Toyota Camry — silver sedan
  UPDATE public.listings SET
    images = '["https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop"]',
    thumbnail_url = 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=400&h=300&fit=crop',
    vin = '4T1G11AK8NU012345'
  WHERE id = id_13;

  -- ============================================================
  -- 2. CREATE TAGS
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
  -- 3. ASSIGN TAGS TO LISTINGS
  -- ============================================================
  INSERT INTO public.listing_tags (listing_id, tag_id) VALUES
    -- Honda Civic: Shortlist + Negotiating
    (id_1, tag_shortlist),
    (id_1, tag_negotiating),
    -- Toyota Corolla: Great Value + Low KM
    (id_2, tag_great_value),
    (id_2, tag_low_km),
    -- Honda CR-V: Shortlist + Test Drive
    (id_3, tag_shortlist),
    (id_3, tag_test_drive),
    -- Mazda3: Great Value
    (id_4, tag_great_value),
    -- F-150: Needs Inspection
    (id_5, tag_needs_inspection),
    -- Elantra: Great Value
    (id_6, tag_great_value),
    -- RAV4: Shortlist + Low KM
    (id_8, tag_shortlist),
    (id_8, tag_low_km),
    -- Golf GTI: Shortlist + Low KM
    (id_12, tag_shortlist),
    (id_12, tag_low_km)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- 4. ADD MORE PRICE HISTORY (for price chart)
  -- Multiple data points per listing to show trends
  -- ============================================================

  -- Honda Civic — steady then small drop
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_1, 2399900, now() - interval '18 days'),
    (id_1, 2399900, now() - interval '14 days'),
    (id_1, 2349900, now() - interval '10 days'),
    (id_1, 2299900, now() - interval '5 days'),
    (id_1, 2299900, now() - interval '1 day');

  -- Honda CR-V — dropping from 33k
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_3, 3350000, now() - interval '20 days'),
    (id_3, 3350000, now() - interval '15 days'),
    (id_3, 3250000, now() - interval '9 days'),
    (id_3, 3195000, now() - interval '4 days');

  -- Ford F-150 — two price drops
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_5, 5100000, now() - interval '21 days'),
    (id_5, 4999900, now() - interval '14 days'),
    (id_5, 4899900, now() - interval '7 days'),
    (id_5, 4850000, now() - interval '3 days');

  -- RAV4 — seller dropped price twice
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_8, 3650000, now() - interval '25 days'),
    (id_8, 3550000, now() - interval '15 days'),
    (id_8, 3475000, now() - interval '5 days');

  -- Silverado — aggressive drops
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_10, 5199900, now() - interval '18 days'),
    (id_10, 4999900, now() - interval '12 days'),
    (id_10, 4899900, now() - interval '7 days'),
    (id_10, 4799900, now() - interval '1 day');

  -- Golf GTI — stable (no drops)
  INSERT INTO public.price_history (listing_id, price_cad, recorded_at) VALUES
    (id_12, 3299500, now() - interval '14 days'),
    (id_12, 3299500, now() - interval '7 days'),
    (id_12, 3299500, now() - interval '1 day');

  RAISE NOTICE 'Update complete! Added images, tags, and price history for user %.', demo_user_id;

END;
$$;
