"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

const PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listingId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    vin: "",
    listedPriceCad: "",
    mileageKm: "",
    bodyType: "",
    transmission: "",
    fuelType: "",
    drivetrain: "",
    engine: "",
    exteriorColor: "",
    interiorColor: "",
    city: "",
    province: "",
    sellerType: "",
    sellerName: "",
    contactPhone: "",
    dealershipName: "",
    sourceUrl: "",
    accidentHistory: "",
    numOwners: "",
    userNotes: "",
    redFlags: "",
  });

  useEffect(() => {
    async function fetchListing() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (fetchError || !data) {
        setError("Listing not found");
        setLoading(false);
        return;
      }

      setForm({
        year: data.year?.toString() ?? "",
        make: data.make ?? "",
        model: data.model ?? "",
        trim: data.trim ?? "",
        vin: data.vin ?? "",
        listedPriceCad: data.listed_price_cad ? (data.listed_price_cad / 100).toString() : "",
        mileageKm: data.mileage_km?.toString() ?? "",
        bodyType: data.body_type ?? "",
        transmission: data.transmission ?? "",
        fuelType: data.fuel_type ?? "",
        drivetrain: data.drivetrain ?? "",
        engine: data.engine ?? "",
        exteriorColor: data.exterior_color ?? "",
        interiorColor: data.interior_color ?? "",
        city: data.city ?? "",
        province: data.province ?? "",
        sellerType: data.seller_type ?? "",
        sellerName: data.seller_name ?? "",
        contactPhone: data.contact_phone ?? "",
        dealershipName: data.dealership_name ?? "",
        sourceUrl: data.source_url ?? "",
        accidentHistory: data.accident_history ?? "",
        numOwners: data.num_owners?.toString() ?? "",
        userNotes: data.user_notes ?? "",
        redFlags: data.red_flags ?? "",
      });
      setLoading(false);
    }
    fetchListing();
  }, [listingId]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: parseInt(form.year),
          make: form.make.trim(),
          model: form.model.trim(),
          trim: form.trim.trim() || null,
          vin: form.vin.trim() || null,
          listed_price_cad: form.listedPriceCad ? Math.round(parseFloat(form.listedPriceCad) * 100) : null,
          mileage_km: form.mileageKm ? parseInt(form.mileageKm) : null,
          body_type: form.bodyType || null,
          transmission: form.transmission || null,
          fuel_type: form.fuelType || null,
          drivetrain: form.drivetrain || null,
          engine: form.engine.trim() || null,
          exterior_color: form.exteriorColor.trim() || null,
          interior_color: form.interiorColor.trim() || null,
          city: form.city.trim() || null,
          province: form.province || null,
          seller_type: form.sellerType || null,
          seller_name: form.sellerName.trim() || null,
          contact_phone: form.contactPhone.trim() || null,
          dealership_name: form.dealershipName.trim() || null,
          source_url: form.sourceUrl.trim() || null,
          accident_history: form.accidentHistory.trim() || null,
          num_owners: form.numOwners ? parseInt(form.numOwners) : null,
          user_notes: form.userNotes.trim() || null,
          red_flags: form.redFlags.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update listing");
      }

      router.push(`/listings/${listingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link
          href={`/listings/${listingId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listing
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-1">Edit Listing</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {form.year} {form.make} {form.model} {form.trim}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Vehicle Identity */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Vehicle</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Year *</label>
              <select value={form.year} onChange={(e) => update("year", e.target.value)} required className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Make *</label>
              <input type="text" value={form.make} onChange={(e) => update("make", e.target.value)} required className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Model *</label>
              <input type="text" value={form.model} onChange={(e) => update("model", e.target.value)} required className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Trim</label>
              <input type="text" value={form.trim} onChange={(e) => update("trim", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-muted-foreground">VIN</label>
              <input type="text" value={form.vin} onChange={(e) => update("vin", e.target.value.toUpperCase())} maxLength={17} className="px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </fieldset>

        {/* Pricing & Mileage */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Price & Mileage</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Listed Price (CAD)</label>
              <input type="number" value={form.listedPriceCad} onChange={(e) => update("listedPriceCad", e.target.value)} min={0} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Mileage (km)</label>
              <input type="number" value={form.mileageKm} onChange={(e) => update("mileageKm", e.target.value)} min={0} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </fieldset>

        {/* Vehicle Details */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Details</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Body Type</label>
              <select value={form.bodyType} onChange={(e) => update("bodyType", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                {["Sedan", "Hatchback", "SUV", "Crossover", "Pickup Truck", "Van", "Minivan", "Coupe", "Convertible", "Wagon"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Transmission</label>
              <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Fuel Type</label>
              <select value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
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
              <select value={form.drivetrain} onChange={(e) => update("drivetrain", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Engine</label>
              <input type="text" value={form.engine} onChange={(e) => update("engine", e.target.value)} placeholder="e.g. 2.0L 4-Cylinder" className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Exterior Colour</label>
              <input type="text" value={form.exteriorColor} onChange={(e) => update("exteriorColor", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-muted-foreground">Interior Colour</label>
              <input type="text" value={form.interiorColor} onChange={(e) => update("interiorColor", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </fieldset>

        {/* Location & Seller */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Location & Seller</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">City</label>
              <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Province</label>
              <select value={form.province} onChange={(e) => update("province", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Seller Type</label>
              <select value={form.sellerType} onChange={(e) => update("sellerType", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="private">Private</option>
                <option value="dealer">Dealer</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Seller Name</label>
              <input type="text" value={form.sellerName} onChange={(e) => update("sellerName", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Phone</label>
              <input type="tel" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Dealership</label>
              <input type="text" value={form.dealershipName} onChange={(e) => update("dealershipName", e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-muted-foreground">Source URL</label>
              <input type="url" value={form.sourceUrl} onChange={(e) => update("sourceUrl", e.target.value)} placeholder="https://..." className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </fieldset>

        {/* Condition & Notes */}
        <fieldset className="bg-background border border-border rounded-xl p-5 space-y-4">
          <legend className="text-sm font-semibold px-1">Condition & Notes</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Accident History</label>
              <input type="text" value={form.accidentHistory} onChange={(e) => update("accidentHistory", e.target.value)} placeholder="e.g. None, 1 minor" className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground"># of Owners</label>
              <input type="number" value={form.numOwners} onChange={(e) => update("numOwners", e.target.value)} min={1} className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Your Notes</label>
            <textarea value={form.userNotes} onChange={(e) => update("userNotes", e.target.value)} rows={3} placeholder="Your research notes, impressions, questions..." className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Red Flags</label>
            <textarea value={form.redFlags} onChange={(e) => update("redFlags", e.target.value)} rows={2} placeholder="Any concerns or issues noted..." className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
          </div>
        </fieldset>

        <div className="flex gap-3">
          <Link
            href={`/listings/${listingId}`}
            className="flex-1 text-center px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
