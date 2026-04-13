"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { LISTING_STATUS_LABELS } from "@carscout/shared";
import { MARKETPLACE_CONFIGS } from "@carscout/shared";
import { MarketplaceSource } from "@carscout/shared";

const BODY_TYPES = [
  "Sedan", "Hatchback", "SUV", "Crossover", "Pickup Truck",
  "Van", "Minivan", "Coupe", "Convertible", "Wagon",
];

const DRIVETRAINS = ["FWD", "RWD", "AWD", "4WD"];

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK",
];

export function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMore, setShowMore] = useState(false);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  // Count active filters (excluding sort and search)
  const activeFilterCount = [
    "status", "source", "contender", "favorite", "bodyType",
    "drivetrain", "province", "sellerType", "priceMin", "priceMax",
    "yearMin", "yearMax", "maxMileage", "winterTires",
  ].filter((key) => searchParams.has(key)).length;

  return (
    <div className="space-y-2">
      {/* Primary row: search + key filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search — full width on mobile */}
        <div className="relative w-full sm:flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search make, model, trim..."
            defaultValue={searchParams.get("q") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("q", e.currentTarget.value);
              }
            }}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Core filters row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status filter */}
          <select
            value={searchParams.get("status") ?? "all"}
            onChange={(e) => updateParam("status", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            {Object.entries(LISTING_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Marketplace filter */}
          <select
            value={searchParams.get("source") ?? "all"}
            onChange={(e) => updateParam("source", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Sources</option>
            {Object.values(MarketplaceSource).map((source) => (
              <option key={source} value={source}>
                {MARKETPLACE_CONFIGS[source].label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={searchParams.get("sort") ?? "created_at"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="created_at">Newest First</option>
            <option value="listed_price_cad">Price: Low to High</option>
            <option value="year">Year: Oldest First</option>
            <option value="mileage_km">Mileage: Low to High</option>
          </select>

          {/* More Filters toggle */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showMore || activeFilterCount > 0
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">More Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded filters panel */}
      {showMore && (
        <div className="bg-muted/30 border border-border rounded-xl p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Body Type */}
            <select
              value={searchParams.get("bodyType") ?? "all"}
              onChange={(e) => updateParam("bodyType", e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Body Types</option>
              {BODY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Drivetrain */}
            <select
              value={searchParams.get("drivetrain") ?? "all"}
              onChange={(e) => updateParam("drivetrain", e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Drivetrains</option>
              {DRIVETRAINS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Province */}
            <select
              value={searchParams.get("province") ?? "all"}
              onChange={(e) => updateParam("province", e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Provinces</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Seller Type */}
            <select
              value={searchParams.get("sellerType") ?? "all"}
              onChange={(e) => updateParam("sellerType", e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Sellers</option>
              <option value="private">Private</option>
              <option value="dealer">Dealer</option>
            </select>

            {/* Price Min */}
            <input
              type="number"
              placeholder="Min price ($)"
              defaultValue={searchParams.get("priceMin") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("priceMin", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateParam("priceMin", e.currentTarget.value)}
              min={0}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Price Max */}
            <input
              type="number"
              placeholder="Max price ($)"
              defaultValue={searchParams.get("priceMax") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("priceMax", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateParam("priceMax", e.currentTarget.value)}
              min={0}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Year Min */}
            <input
              type="number"
              placeholder="Year from"
              defaultValue={searchParams.get("yearMin") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("yearMin", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateParam("yearMin", e.currentTarget.value)}
              min={1990}
              max={new Date().getFullYear() + 1}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Year Max */}
            <input
              type="number"
              placeholder="Year to"
              defaultValue={searchParams.get("yearMax") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("yearMax", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateParam("yearMax", e.currentTarget.value)}
              min={1990}
              max={new Date().getFullYear() + 1}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Max Mileage */}
            <input
              type="number"
              placeholder="Max mileage (km)"
              defaultValue={searchParams.get("maxMileage") ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("maxMileage", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateParam("maxMileage", e.currentTarget.value)}
              min={0}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Quick toggles row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("contender") === "true"}
                onChange={(e) =>
                  updateParam("contender", e.target.checked ? "true" : "")
                }
                className="rounded border-border"
              />
              Strong Contenders
            </label>

            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("favorite") === "true"}
                onChange={(e) =>
                  updateParam("favorite", e.target.checked ? "true" : "")
                }
                className="rounded border-border"
              />
              Favorites
            </label>

            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get("winterTires") === "true"}
                onChange={(e) =>
                  updateParam("winterTires", e.target.checked ? "true" : "")
                }
                className="rounded border-border"
              />
              Winter Tires
            </label>

            {/* Clear all filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-sm text-destructive hover:underline ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
