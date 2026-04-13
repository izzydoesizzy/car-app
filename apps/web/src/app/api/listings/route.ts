import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/listings - Fetch all listings for the authenticated user
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data });
}

/**
 * POST /api/listings - Create a new manual listing
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    vin,
    year,
    make,
    model,
    trim,
    listedPriceCad,
    mileageKm,
    bodyType,
    transmission,
    fuelType,
    drivetrain,
    exteriorColor,
    city,
    province,
    sellerType,
  } = body;

  if (!year || !make || !model) {
    return NextResponse.json(
      { error: "year, make, and model are required" },
      { status: 400 }
    );
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      user_id: user.id,
      source_marketplace: "manual",
      source_url: `manual://${user.id}/${Date.now()}`,
      vin: vin ?? null,
      year,
      make,
      model,
      trim: trim ?? null,
      listed_price_cad: listedPriceCad ? Math.round(listedPriceCad * 100) : null,
      mileage_km: mileageKm ?? null,
      body_type: bodyType ?? null,
      transmission: transmission ?? null,
      fuel_type: fuelType ?? null,
      drivetrain: drivetrain ?? null,
      exterior_color: exteriorColor ?? null,
      city: city ?? null,
      province: province ?? null,
      seller_type: sellerType ?? null,
      status: "saved",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Record initial price history
  if (listedPriceCad) {
    await supabase.from("price_history").insert({
      listing_id: listing.id,
      price_cad: Math.round(listedPriceCad * 100),
    });
  }

  return NextResponse.json({ listing }, { status: 201 });
}
