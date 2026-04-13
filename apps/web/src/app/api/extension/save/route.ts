import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { ScrapedListing } from "@carscout/shared";

/**
 * Creates a Supabase client from a Bearer token (for Chrome extension auth).
 */
function createClientFromToken(accessToken: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    }
  );
}

/**
 * POST /api/extension/save
 * Receives a scraped listing from the Chrome extension and saves it.
 * Supports both cookie-based auth (web app) and Bearer token auth (extension).
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  let supabase;
  if (authHeader?.startsWith("Bearer ")) {
    supabase = createClientFromToken(authHeader.slice(7));
  } else {
    supabase = await createClient();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ScrapedListing;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.sourceUrl || !body.sourceMarketplace) {
    return NextResponse.json(
      { error: "sourceUrl and sourceMarketplace are required" },
      { status: 400 }
    );
  }

  // Map camelCase to snake_case for the database
  const row = {
    user_id: user.id,
    source_url: body.sourceUrl,
    source_marketplace: body.sourceMarketplace,
    source_listing_id: body.sourceListingId ?? null,
    vin: body.vin ?? null,
    year: body.year ?? null,
    make: body.make ?? null,
    model: body.model ?? null,
    trim: body.trim ?? null,
    body_type: body.bodyType ?? null,
    exterior_color: body.exteriorColor ?? null,
    interior_color: body.interiorColor ?? null,
    transmission: body.transmission ?? null,
    fuel_type: body.fuelType ?? null,
    drivetrain: body.drivetrain ?? null,
    engine: body.engine ?? null,
    mileage_km: body.mileageKm ?? null,
    vehicle_options: body.vehicleOptions ?? [],
    has_winter_tires: body.hasWinterTires ?? null,
    listed_price_cad: body.listedPriceCad ?? null,
    city: body.city ?? null,
    province: body.province ?? null,
    postal_code: body.postalCode ?? null,
    seller_name: body.sellerName ?? null,
    seller_type: body.sellerType ?? null,
    dealership_name: body.dealershipName ?? null,
    dealership_website: body.dealershipWebsite ?? null,
    contact_phone: body.contactPhone ?? null,
    images: body.images ?? [],
    thumbnail_url: body.thumbnailUrl ?? (body.images?.[0] ?? null),
    listing_date: body.listingDate ?? null,
    raw_scraped_data: body.rawData ?? null,
    status: "saved",
    is_available: true,
    is_strong_contender: false,
    is_favorite: false,
  };

  const { data, error } = await supabase
    .from("listings")
    .upsert(row, {
      onConflict: "user_id,source_marketplace,source_listing_id",
    })
    .select()
    .single();

  if (error) {
    // Duplicate without source_listing_id
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This listing has already been saved" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Record initial price in history
  if (data && row.listed_price_cad) {
    await supabase.from("price_history").insert({
      listing_id: data.id,
      price_cad: row.listed_price_cad,
    });
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}
