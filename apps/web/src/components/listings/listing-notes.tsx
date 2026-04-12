"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Save, BookOpen, Star } from "lucide-react";
import type { Listing } from "@carscout/shared";

export function ListingNotes({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [notes, setNotes] = useState(listing.userNotes ?? "");
  const [redFlags, setRedFlags] = useState(listing.redFlags ?? "");
  const [learnings, setLearnings] = useState(listing.learnings ?? "");
  const [negotiatingPosition, setNegotiatingPosition] = useState(
    listing.negotiatingPosition ?? ""
  );
  const [rating, setRating] = useState(listing.userRating ?? 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("listings")
      .update({
        user_notes: notes || null,
        red_flags: redFlags || null,
        learnings: learnings || null,
        negotiating_position: negotiatingPosition || null,
        user_rating: rating || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listing.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Your Research</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : saving ? "Saving..." : "Save Notes"}
        </button>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star === rating ? 0 : star)}
              className="p-0.5"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium mb-1">
            <BookOpen className="w-4 h-4" /> Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="General notes about this car..."
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium mb-1 text-warning">
            <AlertTriangle className="w-4 h-4" /> Red Flags
          </label>
          <textarea
            value={redFlags}
            onChange={(e) => setRedFlags(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-warning/30 rounded-lg bg-warning/5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-warning"
            placeholder="Any concerns or warning signs..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Negotiating Position
          </label>
          <textarea
            value={negotiatingPosition}
            onChange={(e) => setNegotiatingPosition(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Priced $2k over CBB, minor accident history gives leverage..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Learnings & Value Details
          </label>
          <textarea
            value={learnings}
            onChange={(e) => setLearnings(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What did you learn about this vehicle or model?"
          />
        </div>
      </div>
    </section>
  );
}
