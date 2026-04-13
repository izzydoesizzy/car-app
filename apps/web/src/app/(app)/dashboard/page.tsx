import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listings/listing-card";
import { DashboardFilters } from "@/components/listings/dashboard-filters";
import { Plus, Car, Search } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@carscout/shared";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Build query with filters
  let query = supabase
    .from("listings")
    .select("*")
    .eq("user_id", user!.id);

  const status = params.status as string | undefined;
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const source = params.source as string | undefined;
  if (source && source !== "all") {
    query = query.eq("source_marketplace", source);
  }

  const contender = params.contender;
  if (contender === "true") {
    query = query.eq("is_strong_contender", true);
  }

  const favorite = params.favorite;
  if (favorite === "true") {
    query = query.eq("is_favorite", true);
  }

  const search = params.q as string | undefined;
  if (search) {
    query = query.or(
      `make.ilike.%${search}%,model.ilike.%${search}%,trim.ilike.%${search}%`
    );
  }

  const bodyType = params.bodyType as string | undefined;
  if (bodyType && bodyType !== "all") {
    query = query.eq("body_type", bodyType);
  }

  const drivetrain = params.drivetrain as string | undefined;
  if (drivetrain && drivetrain !== "all") {
    query = query.eq("drivetrain", drivetrain);
  }

  const province = params.province as string | undefined;
  if (province && province !== "all") {
    query = query.eq("province", province);
  }

  const sellerType = params.sellerType as string | undefined;
  if (sellerType && sellerType !== "all") {
    query = query.eq("seller_type", sellerType);
  }

  const priceMin = params.priceMin as string | undefined;
  if (priceMin) {
    query = query.gte("listed_price_cad", Math.round(parseFloat(priceMin) * 100));
  }

  const priceMax = params.priceMax as string | undefined;
  if (priceMax) {
    query = query.lte("listed_price_cad", Math.round(parseFloat(priceMax) * 100));
  }

  const yearMin = params.yearMin as string | undefined;
  if (yearMin) {
    query = query.gte("year", parseInt(yearMin));
  }

  const yearMax = params.yearMax as string | undefined;
  if (yearMax) {
    query = query.lte("year", parseInt(yearMax));
  }

  const maxMileage = params.maxMileage as string | undefined;
  if (maxMileage) {
    query = query.lte("mileage_km", parseInt(maxMileage));
  }

  const winterTires = params.winterTires;
  if (winterTires === "true") {
    query = query.eq("has_winter_tires", true);
  }

  // Sort — ascending for price/year/mileage, descending for date (newest first)
  const sort = (params.sort as string) || "created_at";
  const sortAscending = sort === "listed_price_cad" || sort === "year" || sort === "mileage_km";
  query = query.order(sort, { ascending: sortAscending });

  const { data: listings, error } = await query;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-destructive">
          Error loading listings: {error.message}
        </p>
      </div>
    );
  }

  const typedListings = (listings ?? []) as unknown as Listing[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Cars</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {typedListings.length} listing
            {typedListings.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Manually
        </Link>
      </div>

      <DashboardFilters />

      {typedListings.length === 0 ? (
        <EmptyState hasFilters={!!status || !!source || !!search || !!bodyType || !!drivetrain || !!province || !!sellerType || !!priceMin || !!priceMax || !!yearMin || !!yearMax || !!maxMileage || !!winterTires} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mt-6">
          {typedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No matching listings</h3>
        <p className="text-muted-foreground text-sm">
          Try adjusting your filters or search terms.
        </p>
        <Link
          href="/dashboard"
          className="text-primary text-sm hover:underline mt-2 inline-block"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-background border border-border rounded-xl mt-6">
      <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No cars saved yet</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
        Install the CarScout Chrome extension to save car listings from
        AutoTrader, Kijiji, Facebook Marketplace, and more with one click.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/listings/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add a Car Manually
        </Link>
      </div>
    </div>
  );
}
