"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { LISTING_STATUS_LABELS } from "@carscout/shared";
import { MARKETPLACE_CONFIGS } from "@carscout/shared";
import { MarketplaceSource } from "@carscout/shared";

export function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
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

      {/* Quick filters */}
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
    </div>
  );
}
