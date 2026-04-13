"use client";

import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@carscout/shared";

interface PricePoint {
  price_cad: number;
  recorded_at: string;
}

export function PriceHistoryChart({ listingId }: { listingId: string }) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const supabase = createClient();
      const { data } = await supabase
        .from("price_history")
        .select("price_cad, recorded_at")
        .eq("listing_id", listingId)
        .order("recorded_at", { ascending: true });

      setHistory(data ?? []);
      setLoading(false);
    }
    fetchHistory();
  }, [listingId]);

  if (loading) return null;
  if (history.length < 2) return null;

  const prices = history.map((p) => p.price_cad);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const priceDiff = lastPrice - firstPrice;
  const pctChange = ((priceDiff / firstPrice) * 100).toFixed(1);

  const TrendIcon = priceDiff < 0 ? TrendingDown : priceDiff > 0 ? TrendingUp : Minus;
  const trendColor = priceDiff < 0 ? "text-green-600" : priceDiff > 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Price History</h2>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span>{priceDiff < 0 ? "" : "+"}{formatPrice(priceDiff)}</span>
          <span className="text-xs text-muted-foreground">({priceDiff <= 0 ? "" : "+"}{pctChange}%)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-32 flex items-end gap-px">
        {history.map((point, i) => {
          const height = ((point.price_cad - minPrice) / range) * 100;
          const barHeight = Math.max(height, 4); // minimum 4% height for visibility
          return (
            <div
              key={i}
              className="flex-1 group relative"
              style={{ height: "100%" }}
            >
              <div
                className="absolute bottom-0 w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors"
                style={{ height: `${barHeight}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap">
                  <p className="font-medium">{formatPrice(point.price_cad)}</p>
                  <p className="text-[10px] opacity-75">
                    {new Date(point.recorded_at).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Date labels */}
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>
          {new Date(history[0].recorded_at).toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>
          {new Date(history[history.length - 1].recorded_at).toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border text-center text-xs">
        <div>
          <p className="text-muted-foreground">First Listed</p>
          <p className="font-medium">{formatPrice(firstPrice)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Lowest</p>
          <p className="font-medium text-green-600">{formatPrice(minPrice)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Current</p>
          <p className="font-medium">{formatPrice(lastPrice)}</p>
        </div>
      </div>
    </section>
  );
}
