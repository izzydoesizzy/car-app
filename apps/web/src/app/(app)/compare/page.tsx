import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatPrice, formatMileage } from "@carscout/shared";
import type { Listing } from "@carscout/shared";
import { BarChart3 } from "lucide-react";

export const metadata = {
  title: "Compare Listings",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get IDs from query params (?ids=uuid1,uuid2,uuid3)
  const idsParam = params.ids as string | undefined;
  const ids = idsParam ? idsParam.split(",") : [];

  let listings: Listing[] = [];

  if (ids.length > 0) {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", user!.id)
      .in("id", ids);
    listings = (data ?? []) as unknown as Listing[];
  }

  // Also fetch all user listings for the selector
  const { data: allListings } = await supabase
    .from("listings")
    .select("id, year, make, model, trim, listed_price_cad")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (listings.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Compare Listings</h1>
        <p className="text-muted-foreground mb-6">
          Select listings from your dashboard to compare them side by side.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const compareFields: {
    label: string;
    getValue: (l: Listing) => string | undefined | null;
  }[] = [
    { label: "Price", getValue: (l) => formatPrice(l.listedPriceCad) },
    { label: "Negotiated", getValue: (l) => formatPrice(l.negotiatedPriceCad) },
    { label: "Mileage", getValue: (l) => formatMileage(l.mileageKm) },
    { label: "Year", getValue: (l) => l.year?.toString() },
    { label: "Transmission", getValue: (l) => l.transmission },
    { label: "Drivetrain", getValue: (l) => l.drivetrain },
    { label: "Fuel Type", getValue: (l) => l.fuelType },
    { label: "Engine", getValue: (l) => l.engine },
    { label: "Color", getValue: (l) => l.exteriorColor },
    {
      label: "Location",
      getValue: (l) =>
        [l.city, l.province].filter(Boolean).join(", ") || null,
    },
    {
      label: "Seller Type",
      getValue: (l) =>
        l.sellerType === "dealer" ? "Dealer" : l.sellerType === "private" ? "Private" : null,
    },
    {
      label: "Accident History",
      getValue: (l) => l.accidentHistory || "Unknown",
    },
    {
      label: "Service Record",
      getValue: (l) =>
        l.goodServiceRecord === true
          ? "Good"
          : l.goodServiceRecord === false
            ? "Poor"
            : "Unknown",
    },
    {
      label: "Winter Tires",
      getValue: (l) => (l.hasWinterTires ? "Yes" : "No"),
    },
    { label: "CBB Low", getValue: (l) => formatPrice(l.cbbLow) },
    { label: "CBB Average", getValue: (l) => formatPrice(l.cbbAverage) },
    { label: "CBB High", getValue: (l) => formatPrice(l.cbbHigh) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Compare Listings</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 bg-muted text-sm font-medium text-muted-foreground w-40">
                Field
              </th>
              {listings.map((listing) => (
                <th key={listing.id} className="p-3 bg-muted text-left min-w-[200px]">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {listing.year} {listing.make} {listing.model}
                  </Link>
                  {listing.isStrongContender && (
                    <span className="ml-2 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs">
                      Contender
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareFields.map((field) => (
              <tr key={field.label} className="border-b border-border">
                <td className="p-3 text-sm text-muted-foreground font-medium">
                  {field.label}
                </td>
                {listings.map((listing) => (
                  <td key={listing.id} className="p-3 text-sm">
                    {field.getValue(listing) || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
