"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Star, Shield, Trash2 } from "lucide-react";
import type { Listing, ListingStatus } from "@carscout/shared";
import { LISTING_STATUS_LABELS } from "@carscout/shared";

export function ListingActions({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function updateField(field: string, value: unknown) {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("listings")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", listing.id);
    setSaving(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", listing.id);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status */}
      <select
        value={listing.status}
        onChange={(e) => updateField("status", e.target.value)}
        disabled={saving}
        className="px-3 py-1.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {Object.entries(LISTING_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Strong contender */}
      <button
        onClick={() =>
          updateField("is_strong_contender", !listing.isStrongContender)
        }
        disabled={saving}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          listing.isStrongContender
            ? "bg-green-50 border-green-300 text-green-700"
            : "border-border text-muted-foreground hover:bg-muted"
        }`}
      >
        <Shield className="w-4 h-4" />
        Contender
      </button>

      {/* Favorite */}
      <button
        onClick={() => updateField("is_favorite", !listing.isFavorite)}
        disabled={saving}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          listing.isFavorite
            ? "bg-yellow-50 border-yellow-300 text-yellow-700"
            : "border-border text-muted-foreground hover:bg-muted"
        }`}
      >
        <Star
          className={`w-4 h-4 ${listing.isFavorite ? "fill-current" : ""}`}
        />
        Favorite
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={saving}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
