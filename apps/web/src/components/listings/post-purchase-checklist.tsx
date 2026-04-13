"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckSquare } from "lucide-react";
import { PROVINCES, formatPrice } from "@carscout/shared";
import type { Listing } from "@carscout/shared";

interface ChecklistItem {
  key: string;
  label: string;
  detail?: string;
}

function getChecklistItems(listing: Listing): ChecklistItem[] {
  const province = listing.province ? PROVINCES[listing.province] : null;
  const items: ChecklistItem[] = [];

  // Registration
  const deadline = province?.registrationDeadlineDays;
  items.push({
    key: "register",
    label: "Transfer ownership & register vehicle",
    detail: deadline
      ? `Register within ${deadline} days of purchase in ${province!.name}`
      : undefined,
  });

  // Safety inspection
  if (province?.safetyInspectionRequired) {
    items.push({
      key: "safety",
      label: "Get safety inspection",
      detail: province.safetyInspectionCost
        ? `Required in ${province.name} — typically ${formatPrice(province.safetyInspectionCost * 100)}`
        : `Required in ${province.name}`,
    });
  }

  // Insurance
  items.push({
    key: "insurance",
    label: "Get auto insurance",
    detail: "Must be insured before driving. Shop rates at Rates.ca or LowestRates.ca",
  });

  // Lien search
  items.push({
    key: "lien",
    label: "Complete lien search (if not done pre-purchase)",
    detail: province?.lienSearchCost
      ? `${province.lienSearchRegistry} — ${formatPrice(province.lienSearchCost * 100)}`
      : undefined,
  });

  // UVIP for Ontario
  if (listing.province === "ON") {
    items.push({
      key: "uvip",
      label: "Obtain Used Vehicle Information Package (UVIP)",
      detail: "Required for private sales in Ontario — $20",
    });
  }

  // Documents
  items.push({
    key: "documents",
    label: "Save all purchase documents",
    detail: "Bill of sale, ownership transfer, safety certificate, inspection reports",
  });

  // First maintenance
  items.push({
    key: "maintenance",
    label: "Schedule first maintenance check",
    detail: "Oil change, fluid levels, tire pressure, brake check",
  });

  return items;
}

export function PostPurchaseChecklist({ listing }: { listing: Listing }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const items = getChecklistItems(listing);

  // Load saved progress
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("checklist_progress")
        .select("items")
        .eq("listing_id", listing.id)
        .eq("checklist_type", "post_purchase")
        .single();

      if (data?.items) {
        setChecked(data.items as Record<string, boolean>);
      }
      setLoaded(true);
    }
    load();
  }, [listing.id]);

  async function toggle(key: string) {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);

    const supabase = createClient();
    await supabase.from("checklist_progress").upsert(
      {
        user_id: listing.userId,
        listing_id: listing.id,
        checklist_type: "post_purchase",
        items: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,listing_id,checklist_type" }
    );
  }

  if (!loaded) return null;

  const doneCount = items.filter((i) => checked[i.key]).length;

  return (
    <section className="bg-green-50 border border-green-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2 text-green-800">
          <CheckSquare className="w-5 h-5" /> Post-Purchase Checklist
        </h2>
        <span className="text-xs text-green-600 font-medium">
          {doneCount}/{items.length} complete
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.key}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={!!checked[item.key]}
              onChange={() => toggle(item.key)}
              className="mt-0.5 rounded border-green-300"
            />
            <div className="flex-1">
              <span
                className={`text-sm ${
                  checked[item.key]
                    ? "line-through text-green-600"
                    : "text-green-900"
                }`}
              >
                {item.label}
              </span>
              {item.detail && (
                <p className="text-xs text-green-700/70 mt-0.5">
                  {item.detail}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {doneCount === items.length && (
        <p className="mt-4 text-sm text-green-700 font-medium text-center">
          All done! Enjoy your new ride.
        </p>
      )}
    </section>
  );
}
