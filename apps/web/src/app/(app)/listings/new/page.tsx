"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { DecodedVehicle } from "@carscout/shared";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

export default function NewListingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vinInput, setVinInput] = useState("");
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);

  const [form, setForm] = useState({
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    listedPriceCad: "",
    mileageKm: "",
    bodyType: "",
    transmission: "",
    fuelType: "",
    drivetrain: "",
    exteriorColor: "",
    city: "",
    province: "",
    sellerType: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleVinDecode() {
    const vin = vinInput.trim().toUpperCase();
    if (vin.length !== 17) {
      setVinError("VIN must be exactly 17 characters");
      return;
    }
    setVinLoading(true);
    setVinError(null);
    try {
      const res = await fetch(`/api/vin/decode?vin=${vin}`);
      const data = await res.json();
      if (data.error) {
        setVinError(data.error);
      } else if (data.decoded) {
        const d: DecodedVehicle = data.decoded;
        setForm((prev) => ({
          ...prev,
          vin,
          year: d.year?.toString() ?? prev.year,
          make: d.make ?? prev.make,
          model: d.model ?? prev.model,
          trim: d.trim ?? prev.trim,
          bodyType: d.bodyType ?? prev.bodyType,
          transmission: d.transmission ?? prev.transmission,
          fuelType: d.fuelType ?? prev.fuelType,
          drivetrain: d.drivetrain ?? prev.drivetrain,
        }));
      }
    } catch {
      setVinError("Failed to decode VIN");
    } finally {
      setVinLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.year || !form.make || !form.model) {
      setError("Year, make, and model are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vin: form.vin || undefined,
          year: parseInt(form.year),
          make: form.make.trim(),
          model: form.model.trim(),
          trim: form.trim.trim() || undefined,
          listedPriceCad: form.listedPriceCad ? parseFloat(form.listedPriceCad) : undefined,
          mileageKm: form.mileageKm ? parseInt(form.mileageKm) : undefined,
          bodyType: form.bodyType || undefined,
          transmission: form.transmission || undefined,
          fuelType: form.fuelType || undefined,
          drivetrain: form.drivetrain || undefined,
          exteriorColor: form.exteriorColor.trim() || undefined,
          city: form.city.trim() || undefined,
          province: form.province || undefined,
          sellerType: form.sellerType || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save listing");
      }

      const { listing } = await res.json();
      router.push(`/listings/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-1">Add a Car Manually</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the details for a listing you found outside of a supported marketplace.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* VIN Decode */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-3">
          <legend className="text-sm font-semibold px-1">VIN Lookup (optional)</legend>
          <p className="text-xs text-muted-foreground">
            Enter a VIN to auto-fill vehicle details from the NHTSA database.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={vinInput}
              onChange={(e) => setVinInput(e.target.value.toUpperCase())}
              placeholder="e.g. 2HGFE2F59NH123456"
              maxLength={17}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleVinDecode}
              disabled={vinLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {vinLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Decoding...
                </>
              ) : (
                "Decode"
              )}
            </button>
          </div>
          {vinError && (
            <p className="text-destructive text-xs">{vinError}</p>
          )}
          {form.vin && (
            <p className="text-green-600 text-xs">VIN decoded and fields auto-filled below.</p>
          )}
        </fieldset>

        {/* Vehicle Identity */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Vehicle</legend>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Year *</label>
              <select
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                required
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Make *</label>
              <input
                type="text"
                value={form.make}
                onChange={(e) => update("make", e.target.value)}
                placeholder="e.g. Honda"
                required
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Model *</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="e.g. Civic"
                required
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2 sm:col-span-3">
              <label className="text-xs text-muted-foreground">Trim</label>
              <input
                type="text"
                value={form.trim}
                onChange={(e) => update("trim", e.target.value)}
                placeholder="e.g. EX, Sport, LX"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </fieldset>

        {/* Pricing & Mileage */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Price & Mileage</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Listed Price (CAD)</label>
              <input
                type="number"
                value={form.listedPriceCad}
                onChange={(e) => update("listedPriceCad", e.target.value)}
                placeholder="e.g. 24500"
                min={0}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Mileage (km)</label>
              <input
                type="number"
                value={form.mileageKm}
                onChange={(e) => update("mileageKm", e.target.value)}
                placeholder="e.g. 45000"
                min={0}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </fieldset>

        {/* Vehicle Details */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Details</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Body Type</label>
              <select
                value={form.bodyType}
                onChange={(e) => update("bodyType", e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                {["Sedan", "Hatchback", "SUV", "Crossover", "Truck", "Van", "Minivan", "Coupe", "Convertible", "Wagon"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => update("transmission", e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => update("fuelType", e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Drivetrain</label>
              <select
                value={form.drivetrain}
                onChange={(e) => update("drivetrain", e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-muted-foreground">Exterior Colour</label>
              <input
                type="text"
                value={form.exteriorColor}
                onChange={(e) => update("exteriorColor", e.target.value)}
                placeholder="e.g. Lunar Silver Metallic"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </fieldset>

        {/* Location & Seller */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Location & Seller</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Toronto"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Province</label>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-muted-foreground">Seller Type</label>
              <select
                value={form.sellerType}
                onChange={(e) => update("sellerType", e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="private">Private</option>
                <option value="dealer">Dealer</option>
                <option value="certified">Certified Pre-Owned</option>
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
