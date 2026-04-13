import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const AFFILIATE_URLS: Record<string, string> = {
  "carfax-canada": "https://www.carfax.ca",
  bluedriver: "https://www.amazon.ca/s?k=bluedriver+obd2",
  "caa-inspection": "https://www.caa.ca",
  "ppsa-ontario": "https://www.ontario.ca/page/search-personal-property-security-registration",
  "ppsa-bc": "https://www.bcregistry.gov.bc.ca/ppr",
  ineedappi: "https://ineedappi.ca",
  "kbb-canada": "https://www.kbb.ca/en-ca",
};

/**
 * GET /api/affiliate/redirect?service=carfax-canada&listing=uuid
 * Logs the click and redirects to the affiliate URL.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");
  const listingId = searchParams.get("listing");

  if (!service || !AFFILIATE_URLS[service]) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  // Log the click (best effort, don't block redirect)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("affiliate_clicks").insert({
      user_id: user.id,
      service_name: service,
      listing_id: listingId || null,
    });
  }

  return NextResponse.redirect(AFFILIATE_URLS[service], 302);
}
