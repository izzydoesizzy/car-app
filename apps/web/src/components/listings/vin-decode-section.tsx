"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import type { Listing } from "@carscout/shared";
import type { DecodedVehicle } from "@carscout/shared";
import { isOdometerSuspicious } from "@carscout/shared";

interface ComparisonRow {
  field: string;
  dbColumn: string;
  listed: string | null;
  decoded: string | null;
  match: boolean;
}

export function VinDecodeSection({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [decoded, setDecoded] = useState<DecodedVehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filling, setFilling] = useState(false);

  async function handleDecode() {
    setLoading(true);
    setError(null);
    setDecoded(null);

    try {
      const res = await fetch(`/api/vin/decode?vin=${listing.vin}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.decoded) {
        setDecoded(data.decoded);
      }
    } catch {
      setError("Failed to decode VIN");
    } finally {
      setLoading(false);
    }
  }

  async function handleFillMissing() {
    if (!decoded) return;
    setFilling(true);

    const updates: Record<string, unknown> = {};
    if (decoded.make && !listing.make) updates.make = decoded.make;
    if (decoded.model && !listing.model) updates.model = decoded.model;
    if (decoded.year && !listing.year) updates.year = decoded.year;
    if (decoded.trim && !listing.trim) updates.trim = decoded.trim;
    if (decoded.bodyType && !listing.bodyType) updates.body_type = decoded.bodyType;
    if (decoded.drivetrain && !listing.drivetrain) updates.drivetrain = decoded.drivetrain;
    if (decoded.fuelType && !listing.fuelType) updates.fuel_type = decoded.fuelType;
    if (decoded.transmission && !listing.transmission) updates.transmission = decoded.transmission;
    if (decoded.engine && !listing.engine) updates.engine = decoded.engine;

    if (Object.keys(updates).length === 0) {
      setFilling(false);
      return;
    }

    updates.updated_at = new Date().toISOString();
    const supabase = createClient();
    await supabase.from("listings").update(updates).eq("id", listing.id);
    setFilling(false);
    router.refresh();
  }

  const odometerCheck = isOdometerSuspicious(listing.year, listing.mileageKm);

  const comparisons: ComparisonRow[] = decoded
    ? [
        { field: "Year", dbColumn: "year", listed: listing.year?.toString() ?? null, decoded: decoded.year?.toString() ?? null, match: !decoded.year || listing.year === decoded.year },
        { field: "Make", dbColumn: "make", listed: listing.make ?? null, decoded: decoded.make, match: !decoded.make || listing.make?.toLowerCase() === decoded.make?.toLowerCase() },
        { field: "Model", dbColumn: "model", listed: listing.model ?? null, decoded: decoded.model, match: !decoded.model || listing.model?.toLowerCase() === decoded.model?.toLowerCase() },
        { field: "Trim", dbColumn: "trim", listed: listing.trim ?? null, decoded: decoded.trim, match: true },
        { field: "Body Type", dbColumn: "body_type", listed: listing.bodyType ?? null, decoded: decoded.bodyType, match: true },
        { field: "Drivetrain", dbColumn: "drivetrain", listed: listing.drivetrain ?? null, decoded: decoded.drivetrain, match: true },
        { field: "Fuel Type", dbColumn: "fuel_type", listed: listing.fuelType ?? null, decoded: decoded.fuelType, match: true },
        { field: "Transmission", dbColumn: "transmission", listed: listing.transmission ?? null, decoded: decoded.transmission, match: true },
        { field: "Engine", dbColumn: "engine", listed: listing.engine ?? null, decoded: decoded.engine, match: true },
      ]
    : [];

  const mismatches = comparisons.filter((c) => !c.match);
  const hasMissingFields = comparisons.some((c) => !c.listed && c.decoded);

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Search className="w-5 h-5" /> VIN Decode
        </h2>
        <button
          onClick={handleDecode}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Decoding...
            </>
          ) : decoded ? (
            "Re-decode"
          ) : (
            "Decode VIN"
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-3 font-mono">
        VIN: {listing.vin}
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Odometer check — always show if suspicious, regardless of decode */}
      {odometerCheck.suspicious && (
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-3 py-2 rounded-lg mb-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{odometerCheck.message}</span>
        </div>
      )}

      {decoded && (
        <>
          {/* Mismatch warning */}
          {mismatches.length > 0 && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2 rounded-lg mb-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Mismatch detected!</strong> The VIN decode doesn&apos;t
                match the seller&apos;s listing for:{" "}
                {mismatches.map((m) => m.field).join(", ")}
              </span>
            </div>
          )}

          {mismatches.length === 0 && (
            <div className="flex items-center gap-2 text-green-700 text-sm mb-3">
              <CheckCircle className="w-4 h-4" />
              VIN matches listed specs
            </div>
          )}

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 pr-3">Field</th>
                  <th className="text-left py-2 pr-3">Listed</th>
                  <th className="text-left py-2">Decoded</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr
                    key={row.field}
                    className={`border-b border-border/50 ${!row.match ? "bg-red-50" : ""}`}
                  >
                    <td className="py-1.5 pr-3 text-muted-foreground">
                      {row.field}
                    </td>
                    <td className="py-1.5 pr-3">
                      {row.listed || (
                        <span className="text-muted-foreground italic">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 font-medium">
                      {row.decoded || (
                        <span className="text-muted-foreground italic">
                          —
                        </span>
                      )}
                      {!row.match && (
                        <AlertTriangle className="inline w-3.5 h-3.5 text-red-500 ml-1" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {decoded.plantCountry && (
            <p className="text-xs text-muted-foreground mt-2">
              Manufactured in: {decoded.plantCountry}
            </p>
          )}

          {/* Fill missing fields */}
          {hasMissingFields && (
            <button
              onClick={handleFillMissing}
              disabled={filling}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {filling ? "Filling..." : "Fill Missing Fields from VIN"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
