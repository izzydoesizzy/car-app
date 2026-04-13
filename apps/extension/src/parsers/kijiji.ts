import { MarketplaceSource, parsePriceToCents } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { extractListingId } from "../shared/marketplace-detector";

export class KijijiParser implements MarketplaceParser {
  parse(doc: Document, url: string): ScrapedListing {
    const jsonLd = this.parseJsonLd(doc);
    const listing: ScrapedListing = {
      sourceUrl: url,
      sourceMarketplace: MarketplaceSource.KIJIJI,
      sourceListingId: extractListingId(url, MarketplaceSource.KIJIJI),
      rawData: { jsonLd, url },
    };

    // JSON-LD extraction
    if (jsonLd) {
      listing.make = jsonLd.brand?.name || jsonLd.manufacturer?.name;
      listing.model = jsonLd.model;
      listing.year = jsonLd.vehicleModelDate ? parseInt(jsonLd.vehicleModelDate) : undefined;
      listing.vin = jsonLd.vehicleIdentificationNumber;
      listing.bodyType = jsonLd.bodyType;
      listing.fuelType = jsonLd.fuelType;
      listing.transmission = jsonLd.vehicleTransmission;
      listing.drivetrain = jsonLd.driveWheelConfiguration;
      listing.exteriorColor = jsonLd.color;

      if (jsonLd.mileageFromOdometer) {
        const val = jsonLd.mileageFromOdometer.value ?? jsonLd.mileageFromOdometer;
        const num = parseInt(String(val).replace(/[^0-9]/g, ""));
        if (!isNaN(num)) listing.mileageKm = num;
      }

      if (jsonLd.offers?.price) {
        listing.listedPriceCad = parsePriceToCents(String(jsonLd.offers.price));
      }

      if (jsonLd.image) {
        listing.images = Array.isArray(jsonLd.image) ? jsonLd.image : [jsonLd.image];
        listing.thumbnailUrl = listing.images[0];
      }
    }

    // DOM fallback
    this.augmentFromDom(doc, listing);

    return listing;
  }

  private parseJsonLd(doc: Document): Record<string, any> | null {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent || "");
        if (data["@type"] === "Car" || data["@type"] === "Vehicle" || data["@type"] === "Product") {
          return data;
        }
        if (Array.isArray(data)) {
          const vehicle = data.find((d: any) => d["@type"] === "Car" || d["@type"] === "Vehicle");
          if (vehicle) return vehicle;
        }
      } catch { /* skip */ }
    }
    return null;
  }

  private augmentFromDom(doc: Document, listing: ScrapedListing): void {
    // Title parsing
    if (!listing.year || !listing.make) {
      try {
        const title = doc.querySelector("h1")?.textContent?.trim();
        if (title) {
          const match = title.match(/(\d{4})\s+(\w+)\s+(.+)/);
          if (match) {
            listing.year = listing.year || parseInt(match[1]);
            listing.make = listing.make || match[2];
            listing.model = listing.model || match[3].trim();
          }
        }
      } catch { /* graceful degradation */ }
    }

    // Price fallback
    if (!listing.listedPriceCad) {
      try {
        const priceEl = doc.querySelector('[class*="price"], [data-testid*="price"]');
        if (priceEl?.textContent) {
          listing.listedPriceCad = parsePriceToCents(priceEl.textContent);
        }
      } catch { /* graceful degradation */ }
    }

    // Mileage from specs table
    if (!listing.mileageKm) {
      try {
        const specLabels = doc.querySelectorAll('dt, [class*="label"], th');
        for (const label of specLabels) {
          if (label.textContent?.toLowerCase().includes("kilomet")) {
            const value = label.nextElementSibling?.textContent;
            if (value) {
              const num = parseInt(value.replace(/[^0-9]/g, ""));
              if (!isNaN(num)) listing.mileageKm = num;
            }
            break;
          }
        }
      } catch { /* graceful degradation */ }
    }

    // Location
    try {
      const locationEl = doc.querySelector('[class*="location"], [data-testid*="location"]');
      if (locationEl?.textContent) {
        const parts = locationEl.textContent.trim().split(",").map((s) => s.trim());
        if (parts.length >= 2) {
          listing.city = listing.city || parts[0];
          listing.province = listing.province || parts[1];
        } else if (parts.length === 1) {
          listing.city = listing.city || parts[0];
        }
      }
    } catch { /* graceful degradation */ }

    // Seller info
    try {
      const sellerEl = doc.querySelector('[class*="seller"], [data-testid*="seller"]');
      if (sellerEl?.textContent) {
        listing.sellerName = sellerEl.textContent.trim();
        if (sellerEl.textContent.toLowerCase().includes("dealer")) {
          listing.sellerType = "dealer";
          listing.dealershipName = listing.sellerName;
        } else {
          listing.sellerType = "private";
        }
      }
    } catch { /* graceful degradation */ }

    // Images fallback
    if (!listing.images?.length) {
      try {
        const imgs = doc.querySelectorAll('[class*="gallery"] img, [class*="carousel"] img, [class*="media"] img');
        const urls: string[] = [];
        imgs.forEach((img) => {
          const src = (img as HTMLImageElement).src || img.getAttribute("data-src");
          if (src && !src.includes("placeholder") && !src.includes("avatar")) urls.push(src);
        });
        if (urls.length) {
          listing.images = urls;
          listing.thumbnailUrl = urls[0];
        }
      } catch { /* graceful degradation */ }
    }

    // Vehicle specs from key-value pairs
    try {
      const specPairs = doc.querySelectorAll('[class*="spec"] dt, [class*="attribute"] dt, [class*="detail"] dt');
      for (const dt of specPairs) {
        const label = dt.textContent?.trim().toLowerCase();
        const value = dt.nextElementSibling?.textContent?.trim();
        if (!label || !value) continue;

        if (label.includes("transmission") && !listing.transmission) listing.transmission = value;
        if (label.includes("drivetrain") && !listing.drivetrain) listing.drivetrain = value;
        if (label.includes("fuel") && !listing.fuelType) listing.fuelType = value;
        if (label.includes("body") && !listing.bodyType) listing.bodyType = value;
        if ((label.includes("exterior") || label.includes("colour")) && !listing.exteriorColor) listing.exteriorColor = value;
        if (label.includes("engine") && !listing.engine) listing.engine = value;
        if (label.includes("trim") && !listing.trim) listing.trim = value;
      }
    } catch { /* graceful degradation */ }
  }
}
