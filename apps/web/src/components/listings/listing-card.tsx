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
      <div className="flex flex-row sm:flex-col">
        {/* Thumbnail */}
        <div className="w-[100px] h-[75px] flex-shrink-0 sm:w-full sm:h-auto sm:aspect-[16/10] bg-muted relative">
          {listing.thumbnailUrl || (listing.images && listing.images.length > 0) ? (
            <img
              src={(listing.thumbnailUrl || listing.images?.[0]) as string}
              alt={`${listing.year} ${listing.make} ${listing.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] sm:text-sm">
              No Image
            </div>
          )}

          {/* Status badge */}
          <span
            className={`absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-medium ${STATUS_COLORS[listing.status]}`}
          >
            {STATUS_LABELS[listing.status]}
          </span>

          {/* Strong contender / favorite — desktop only */}
          <div className="hidden sm:flex absolute top-2 right-2 gap-1">
            {listing.isStrongContender && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Contender
              </span>
            )}
            {listing.isFavorite && (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            )}
          </div>

          {/* Favorite — mobile only (small icon) */}
          {listing.isFavorite && (
            <Star className="sm:hidden absolute top-1 right-1 w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          )}

          {/* Marketplace badge — desktop only */}
          {marketplace && (
            <span
              className="hidden sm:inline absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: marketplace.color }}
            >
              {marketplace.label}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-2 sm:p-4 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <h3 className="font-semibold text-xs sm:text-sm truncate sm:truncate-none">
              {listing.year} {listing.make} {listing.model}
              {listing.trim && (
                <span className="hidden sm:inline text-muted-foreground font-normal">
                  {" "}
                  {listing.trim}
                </span>
              )}
            </h3>
            <span className="text-sm sm:text-lg font-bold text-primary whitespace-nowrap">
              {formatPrice(listing.listedPriceCad)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 sm:mt-2 text-[11px] sm:text-xs text-muted-foreground">
            {listing.mileageKm != null && (
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {formatMileage(listing.mileageKm)}
              </span>
            )}
            {(listing.city || listing.province) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {[listing.city, listing.province].filter(Boolean).join(", ")}
              </span>
            )}
            {listing.listingDate && (
              <span className="hidden sm:flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(listing.listingDate).toLocaleDateString("en-CA")}
              </span>
            )}
          </div>

          {/* Mobile: marketplace + red flag inline */}
          <div className="flex sm:hidden items-center gap-2 mt-1">
            {marketplace && (
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                style={{ backgroundColor: marketplace.color }}
              >
                {marketplace.label}
              </span>
            )}
            {hasRedFlags && (
              <AlertTriangle className="w-3 h-3 text-warning" />
            )}
          </div>

          {/* Desktop: Price comparison bar (if CBB data available) */}
          {listing.cbbLow != null && listing.cbbHigh != null && listing.listedPriceCad != null && (
            <div className="hidden sm:block mt-3">
              <PriceRangeBar
                low={listing.cbbLow}
                high={listing.cbbHigh}
                average={listing.cbbAverage}
                current={listing.listedPriceCad}
              />
            </div>
          )}

          {/* Desktop: Red flags indicator */}
          {hasRedFlags && (
            <div className="hidden sm:flex items-center gap-1 mt-2 text-xs text-warning">
              <AlertTriangle className="w-3.5 h-3.5" />
              Red flags noted
            </div>
          )}

          {/* Desktop: Winter tires */}
          {listing.hasWinterTires && (
            <span className="hidden sm:inline-block mt-2 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
              Winter tires included
            </span>
          )}
        </div>
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
