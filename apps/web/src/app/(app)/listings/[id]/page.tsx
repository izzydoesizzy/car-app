import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Gauge,
  Calendar,
  Car,
  Fuel,
  Settings,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, formatMileage } from "@carscout/shared";
import { MARKETPLACE_CONFIGS } from "@carscout/shared";
import type { Listing, MarketplaceSource } from "@carscout/shared";
import { ListingActions } from "@/components/listings/listing-actions";
import { ListingNotes } from "@/components/listings/listing-notes";
import { PricingSection } from "@/components/listings/pricing-section";
import { AffiliateCards } from "@/components/listings/affiliate-cards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("year, make, model, trim")
    .eq("id", id)
    .single();

  if (!data) return { title: "Listing Not Found" };
  return {
    title: `${data.year} ${data.make} ${data.model} ${data.trim ?? ""}`.trim(),
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const listing = data as unknown as Listing;
  const marketplace =
    MARKETPLACE_CONFIGS[listing.sourceMarketplace as MarketplaceSource];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {listing.year} {listing.make} {listing.model}
            {listing.trim && (
              <span className="text-muted-foreground font-normal">
                {" "}
                {listing.trim}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {marketplace && (
              <span
                className="px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: marketplace.color }}
              >
                {marketplace.label}
              </span>
            )}
            {listing.sourceUrl && (
              <a
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View Original <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {listing.vin && (
              <span className="font-mono text-xs">VIN: {listing.vin}</span>
            )}
          </div>
        </div>
        <ListingActions listing={listing} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          {listing.images && (listing.images as string[]).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden">
              {(listing.images as string[]).slice(0, 6).map((url, i) => (
                <div
                  key={i}
                  className={`aspect-[4/3] bg-muted ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                >
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Vehicle Details */}
          <section className="bg-background border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <Detail icon={<Gauge />} label="Mileage" value={formatMileage(listing.mileageKm)} />
              <Detail icon={<Calendar />} label="Year" value={listing.year?.toString()} />
              <Detail icon={<Car />} label="Body Type" value={listing.bodyType} />
              <Detail icon={<Settings />} label="Transmission" value={listing.transmission} />
              <Detail icon={<Fuel />} label="Fuel Type" value={listing.fuelType} />
              <Detail icon={<Car />} label="Drivetrain" value={listing.drivetrain} />
              <Detail icon={<Settings />} label="Engine" value={listing.engine} />
              <Detail icon={<Palette />} label="Exterior" value={listing.exteriorColor} />
              <Detail icon={<Palette />} label="Interior" value={listing.interiorColor} />
            </div>

            {/* Options */}
            {listing.vehicleOptions && (listing.vehicleOptions as string[]).length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-2">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {(listing.vehicleOptions as string[]).map((opt) => (
                    <span
                      key={opt}
                      className="bg-muted px-2 py-1 rounded text-xs"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Winter tires & add-ons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {listing.hasWinterTires && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  Winter tires included
                </span>
              )}
              {listing.addOns && (
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                  Add-ons: {listing.addOns}
                </span>
              )}
            </div>
          </section>

          {/* Pricing & Negotiation */}
          <PricingSection listing={listing} />

          {/* Condition & History */}
          <section className="bg-background border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Condition & History</h2>
            <div className="space-y-3 text-sm">
              <InfoRow label="Accident History" value={listing.accidentHistory || "Unknown"} />
              <InfoRow label="Damage" value={listing.damageDescription || "None reported"} />
              <InfoRow
                label="Service Record"
                value={
                  listing.goodServiceRecord === true
                    ? "Good"
                    : listing.goodServiceRecord === false
                      ? "Poor / None"
                      : "Unknown"
                }
              />
              <InfoRow label="# of Owners" value={listing.numOwners?.toString()} />
              <InfoRow label="Reason for Selling" value={listing.reasonForSelling} />
              {listing.carfaxUrl && (
                <div className="pt-2">
                  <a
                    href={listing.carfaxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View CARFAX Report <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Seller & Communication */}
          <section className="bg-background border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Seller & Communication</h2>
            <div className="space-y-3 text-sm">
              <InfoRow
                label="Seller Type"
                value={listing.sellerType === "dealer" ? "Dealer" : "Private"}
              />
              <InfoRow label="Seller / Contact Name" value={listing.contactName || listing.sellerName} />
              <InfoRow label="Dealership" value={listing.dealershipName} />
              {listing.dealershipWebsite && (
                <InfoRow
                  label="Website"
                  value={
                    <a
                      href={listing.dealershipWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {listing.dealershipWebsite}
                    </a>
                  }
                />
              )}
              <InfoRow label="Phone" value={listing.contactPhone} />
              <InfoRow label="Conversation On" value={listing.conversationPlatform} />
              {listing.conversationLink && (
                <InfoRow
                  label="Conversation"
                  value={
                    <a
                      href={listing.conversationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Open Thread <ExternalLink className="w-3 h-3" />
                    </a>
                  }
                />
              )}
            </div>
          </section>

          {/* User Notes & Research */}
          <ListingNotes listing={listing} />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Location */}
          <section className="bg-background border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Location</h2>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>
                {[listing.city, listing.province, listing.postalCode]
                  .filter(Boolean)
                  .join(", ") || "Not specified"}
              </span>
            </div>
          </section>

          {/* Affiliate Cards */}
          <AffiliateCards listing={listing} />
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 [&>svg]:w-4 [&>svg]:h-4">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
