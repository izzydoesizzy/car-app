import Link from "next/link";
import { Star, MapPin, Gauge, Calendar, AlertTriangle } from "lucide-react";
import type { Listing, ListingStatus } from "@carscout/shared";
import { formatPrice, formatMileage } from "@carscout/shared";
import { MARKETPLACE_CONFIGS } from "@carscout/shared";
import type { MarketplaceSource } from "@carscout/shared";

const STATUS_COLORS: Record<ListingStatus, string> = {
  saved: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  viewing_scheduled: "bg-purple-100 text-purple-800",
  inspected: "bg-indigo-100 text-indigo-800",
  offer_made: "bg-orange-100 text-orange-800",
  purchased: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<ListingStatus, string> = {
  saved: "Saved",
  contacted: "Contacted",
  viewing_scheduled: "Viewing",
  inspected: "Inspected",
  offer_made: "Offer Made",
  purchased: "Purchased",
  archived: "Archived",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const marketplace =
    MARKETPLACE_CONFIGS[listing.sourceMarketplace as MarketplaceSource];
  const hasRedFlags = listing.redFlags && listing.redFlags.trim().length > 0;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block bg-background border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] bg-muted relative">
        {listing.thumbnailUrl || (listing.images && listing.images.length > 0) ? (
          <img
            src={(listing.thumbnailUrl || listing.images?.[0]) as string}
            alt={`${listing.year} ${listing.make} ${listing.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[listing.status]}`}
        >
          {STATUS_LABELS[listing.status]}
        </span>

        {/* Strong contender / favorite */}
        <div className="absolute top-2 right-2 flex gap-1">
          {listing.isStrongContender && (
            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              Contender
            </span>
          )}
          {listing.isFavorite && (
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          )}
        </div>

        {/* Marketplace badge */}
        {marketplace && (
          <span
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ backgroundColor: marketplace.color }}
          >
            {marketplace.label}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm">
              {listing.year} {listing.make} {listing.model}
              {listing.trim && (
                <span className="text-muted-foreground font-normal">
                  {" "}
                  {listing.trim}
                </span>
              )}
            </h3>
          </div>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            {formatPrice(listing.listedPriceCad)}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
          {listing.mileageKm != null && (
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {formatMileage(listing.mileageKm)}
            </span>
          )}
          {(listing.city || listing.province) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {[listing.city, listing.province].filter(Boolean).join(", ")}
            </span>
          )}
          {listing.listingDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(listing.listingDate).toLocaleDateString("en-CA")}
            </span>
          )}
        </div>

        {/* Price comparison bar (if CBB data available) */}
        {listing.cbbLow != null && listing.cbbHigh != null && listing.listedPriceCad != null && (
          <div className="mt-3">
            <PriceRangeBar
              low={listing.cbbLow}
              high={listing.cbbHigh}
              average={listing.cbbAverage}
              current={listing.listedPriceCad}
            />
          </div>
        )}

        {/* Red flags indicator */}
        {hasRedFlags && (
          <div className="flex items-center gap-1 mt-2 text-xs text-warning">
            <AlertTriangle className="w-3.5 h-3.5" />
            Red flags noted
          </div>
        )}

        {/* Winter tires */}
        {listing.hasWinterTires && (
          <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
            Winter tires included
          </span>
        )}
      </div>
    </Link>
  );
}

function PriceRangeBar({
  low,
  high,
  average,
  current,
}: {
  low: number;
  high: number;
  average?: number | null;
  current: number;
}) {
  const range = high - low;
  if (range <= 0) return null;
  const position = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  const isGoodDeal = current <= (average ?? (low + high) / 2);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>CBB Low {formatPrice(low)}</span>
        <span>CBB High {formatPrice(high)}</span>
      </div>
      <div className="relative h-1.5 bg-muted rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-red-400 rounded-full"
          style={{ width: "100%" }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow ${
            isGoodDeal ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ left: `${position}%`, marginLeft: "-6px" }}
        />
      </div>
    </div>
  );
}
