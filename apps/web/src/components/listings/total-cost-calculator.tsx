"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { PROVINCES, getTaxRate, formatPrice } from "@carscout/shared";

export function TotalCostCalculator({
  price,
  province,
}: {
  price?: number | null;
  province?: string | null;
}) {
  const [inputPrice, setInputPrice] = useState(
    price ? (price / 100).toString() : ""
  );
  const [selectedProvince, setSelectedProvince] = useState(province ?? "");

  const priceDollars = parseFloat(inputPrice) || 0;
  const priceCents = Math.round(priceDollars * 100);
  const provinceInfo = PROVINCES[selectedProvince];

  // Tax calculations
  let gstAmount = 0;
  let pstAmount = 0;
  let hstAmount = 0;
  let taxLabel = "";

  if (provinceInfo && priceCents > 0) {
    if (provinceInfo.hstRate > 0) {
      hstAmount = Math.round(priceCents * provinceInfo.hstRate);
      taxLabel = "HST";
    } else {
      if (provinceInfo.gstRate > 0) {
        gstAmount = Math.round(priceCents * provinceInfo.gstRate);
      }
      if (provinceInfo.pstRate > 0) {
        pstAmount = Math.round(priceCents * provinceInfo.pstRate);
        taxLabel =
          selectedProvince === "QC"
            ? "QST"
            : selectedProvince === "MB"
              ? "RST"
              : "PST";
      }
    }
  }

  const totalTax = hstAmount || gstAmount + pstAmount;
  const safetyInspection = provinceInfo?.safetyInspectionRequired
    ? (provinceInfo.safetyInspectionCost ?? 0) * 100
    : 0;
  const lienSearch = (provinceInfo?.lienSearchCost ?? 0) * 100;
  const uvipFee = selectedProvince === "ON" ? 2000 : 0; // $20 UVIP for Ontario
  const totalCents =
    priceCents + totalTax + safetyInspection + lienSearch + uvipFee;

  const taxRate = provinceInfo ? getTaxRate(selectedProvince) : 0;

  return (
    <section className="bg-background border border-border rounded-xl p-5">
      <h2 className="font-semibold flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5" /> Total Cost Estimate
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Purchase Price ($)
          </label>
          <input
            type="number"
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
            placeholder="e.g. 24500"
            min={0}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Province
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select province</option>
            {Object.values(PROVINCES).map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {priceCents > 0 && provinceInfo && (
          <div className="pt-3 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purchase Price</span>
              <span>{formatPrice(priceCents)}</span>
            </div>

            {hstAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  HST ({(provinceInfo.hstRate * 100).toFixed(0)}%)
                </span>
                <span>{formatPrice(hstAmount)}</span>
              </div>
            )}

            {gstAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  GST ({(provinceInfo.gstRate * 100).toFixed(0)}%)
                </span>
                <span>{formatPrice(gstAmount)}</span>
              </div>
            )}

            {pstAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {taxLabel} (
                  {selectedProvince === "QC"
                    ? "9.975"
                    : (provinceInfo.pstRate * 100).toFixed(0)}
                  %)
                </span>
                <span>{formatPrice(pstAmount)}</span>
              </div>
            )}

            {safetyInspection > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Safety Inspection
                </span>
                <span>{formatPrice(safetyInspection)}</span>
              </div>
            )}

            {lienSearch > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lien Search</span>
                <span>{formatPrice(lienSearch)}</span>
              </div>
            )}

            {uvipFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">UVIP Fee</span>
                <span>{formatPrice(uvipFee)}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-border font-bold">
              <span>Estimated Total</span>
              <span className="text-primary">{formatPrice(totalCents)}</span>
            </div>

            <p className="text-[11px] text-muted-foreground pt-1">
              Tax rate: {(taxRate * 100).toFixed(2)}%. Excludes insurance,
              financing, and optional add-ons.
            </p>

            {provinceInfo.notes && (
              <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-2">
                {provinceInfo.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
