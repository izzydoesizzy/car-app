"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle, Loader2, ExternalLink } from "lucide-react";

interface RecallItem {
  recallNumber: string;
  date: string;
  systemType: string;
  summary: string;
}

export function RecallsSection({
  make,
  model,
  year,
}: {
  make?: string | null;
  model?: string | null;
  year?: number | null;
}) {
  const [recalls, setRecalls] = useState<RecallItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  if (!make || !model || !year) return null;

  async function handleCheck() {
    setLoading(true);
    setError(null);
    setHint(null);
    setRecalls(null);

    try {
      const res = await fetch(
        `/api/recalls?make=${encodeURIComponent(make!)}&model=${encodeURIComponent(model!)}&year=${year}`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        if (data.hint) setHint(data.hint);
      } else {
        setRecalls(data.recalls ?? []);
      }
    } catch {
      setError("Failed to check recalls");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Safety Recalls
        </h2>
        <button
          onClick={handleCheck}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Checking...
            </>
          ) : recalls !== null ? (
            "Re-check"
          ) : (
            "Check Recalls"
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Check Transport Canada&apos;s recall database for {year} {make} {model}.
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
          <p>{error}</p>
          {hint && <p className="text-xs mt-1 opacity-80">{hint}</p>}
        </div>
      )}

      {recalls !== null && recalls.length === 0 && (
        <div className="flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          No recalls found for this vehicle.
        </div>
      )}

      {recalls !== null && recalls.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-yellow-700">
            {recalls.length} recall{recalls.length !== 1 ? "s" : ""} found
          </p>
          {recalls.map((recall) => (
            <div
              key={recall.recallNumber}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-yellow-800">
                  {recall.recallNumber}
                </span>
                <span className="text-xs text-yellow-600 whitespace-nowrap">
                  {recall.date}
                </span>
              </div>
              {recall.systemType && (
                <p className="text-xs text-yellow-700 mt-1">
                  System: {recall.systemType}
                </p>
              )}
              {recall.summary && (
                <p className="text-xs text-yellow-800 mt-1">{recall.summary}</p>
              )}
            </div>
          ))}
          <a
            href="https://tc.canada.ca/en/recalls-safety-alerts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View on Transport Canada <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </section>
  );
}
