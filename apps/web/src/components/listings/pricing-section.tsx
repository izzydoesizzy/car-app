"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DollarSign, ExternalLink, Save } from "lucide-react";
import { formatPrice } from "@carscout/shared";
import type { Listing } from "@carscout/shared";

export function PricingSection({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [negotiatedPrice, setNegotiatedPrice] = useState(
    listing.negotiatedPriceCad ? (listing.negotiatedPriceCad / 100).toString() : ""
  );
  const [cbbLow, setCbbLow] = useState(
    listing.cbbLow ? (listing.cbbLow / 100).toString() : ""
  );
  const [cbbAverage, setCbbAverage] = useState(
    listing.cbbAverage ? (listing.cbbAverage / 100).toString() : ""
  );
  const [cbbHigh, setCbbHigh] = useState(
    listing.cbbHigh ? (listing.cbbHigh / 100).toString() : ""
  );
  const [cbbLink, setCbbLink] = useState(listing.cbbLink ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("listings")
      .update({
        negotiated_price_cad: negotiatedPrice ? Math.round(parseFloat(negotiatedPrice) * 100) : null,
        cbb_low: cbbLow ? Math.round(parseFloat(cbbLow) * 100) : null,
        cbb_average: cbbAverage ? Math.round(parseFloat(cbbAverage) * 100) : null,
        cbb_high: cbbHigh ? Math.round(parseFloat(cbbHigh) * 100) : null,
        cbb_link: cbbLink || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listing.id);
    setSaving(false);
    router.refresh();
  }

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" /> Pricing & Negotiation
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Listed price highlight */}
      <div className="bg-muted rounded-lg p-4 mb-4">
        <p className="text-sm text-muted-foreground">Listed Price</p>
        <p className="text-3xl font-bold text-primary">
          {formatPrice(listing.listedPriceCad)}
        </p>
      </div>

      {/* CBB Range Visual */}
      {listing.cbbLow != null && listing.cbbHigh != null && listing.listedPriceCad != null && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">
            Canadian Black Book Range
          </p>
          <PriceBar
            low={listing.cbbLow}
            average={listing.cbbAverage ?? undefined}
            high={listing.cbbHigh}
            current={listing.listedPriceCad}
          />
        </div>
      )}

      {/* Editable fields */}
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Negotiated Price ($)
          </label>
          <input
            type="number"
            value={negotiatedPrice}
            onChange={(e) => setNegotiatedPrice(e.target.value)}
            placeholder="e.g. 22000"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            CBB Link
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={cbbLink}
              onChange={(e) => setCbbLink(e.target.value)}
              placeholder="https://www.canadianblackbook.com/..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {cbbLink && (
              <a
                href={cbbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-2 border border-border rounded-lg hover:bg-muted"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            CBB Low ($)
          </label>
          <input
            type="number"
            value={cbbLow}
            onChange={(e) => setCbbLow(e.target.value)}
            placeholder="e.g. 18000"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            CBB Average ($)
          </label>
          <input
            type="number"
            value={cbbAverage}
            onChange={(e) => setCbbAverage(e.target.value)}
            placeholder="e.g. 21000"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            CBB High ($)
          </label>
          <input
            type="number"
            value={cbbHigh}
            onChange={(e) => setCbbHigh(e.target.value)}
            placeholder="e.g. 24000"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </section>
  );
}

function PriceBar({
  low,
  average,
  high,
  current,
}: {
  low: number;
  average?: number;
  high: number;
  current: number;
}) {
  const range = high - low;
  if (range <= 0) return null;
  const currentPos = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  const avgPos = average
    ? Math.max(0, Math.min(100, ((average - low) / range) * 100))
    : null;
  const isGoodDeal = current <= (average ?? (low + high) / 2);

  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{formatPrice(low)}</span>
        {average != null && (
          <span className="text-foreground font-medium">
            Avg: {formatPrice(average)}
          </span>
        )}
        <span>{formatPrice(high)}</span>
      </div>
      <div className="relative h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full">
        {avgPos != null && (
          <div
            className="absolute top-0 h-full w-0.5 bg-foreground/40"
            style={{ left: `${avgPos}%` }}
          />
        )}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md ${
            isGoodDeal ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ left: `${currentPos}%`, marginLeft: "-8px" }}
        />
      </div>
      <p className="text-xs mt-1 font-medium text-center">
        Listed at {formatPrice(current)} —{" "}
        <span className={isGoodDeal ? "text-green-600" : "text-red-600"}>
          {isGoodDeal ? "Below average" : "Above average"}
        </span>
      </p>
    </div>
  );
}
