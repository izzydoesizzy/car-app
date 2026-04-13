import { MarketplaceSource, parsePriceToCents } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { extractListingId } from "../shared/marketplace-detector";

export class AutoTraderParser implements MarketplaceParser {
  parse(doc: Document, url: string): ScrapedListing {
    const jsonLd = this.parseJsonLd(doc);
    const listing: ScrapedListing = {
      sourceUrl: url,
      sourceMarketplace: MarketplaceSource.AUTOTRADER,
      sourceListingId: extractListingId(url, MarketplaceSource.AUTOTRADER),
      rawData: { jsonLd, url },
    };

    // JSON-LD is the most reliable source on AutoTrader
    if (jsonLd) {
      listing.make = jsonLd.brand?.name || jsonLd.manufacturer?.name;
      listing.model = jsonLd.model;
      listing.year = jsonLd.vehicleModelDate ? parseInt(jsonLd.vehicleModelDate) : undefined;
      listing.mileageKm = this.parseMileage(jsonLd.mileageFromOdometer);
      listing.bodyType = jsonLd.bodyType;
      listing.fuelType = jsonLd.fuelType;
      listing.transmission = jsonLd.vehicleTransmission;
      listing.drivetrain = jsonLd.driveWheelConfiguration;
      listing.engine = jsonLd.vehicleEngine?.engineType;
      listing.exteriorColor = jsonLd.color;
      listing.interiorColor = jsonLd.vehicleInteriorColor;
      listing.vin = jsonLd.vehicleIdentificationNumber;

      if (jsonLd.offers?.price) {
        listing.listedPriceCad = parsePriceToCents(String(jsonLd.offers.price));
      }

      if (jsonLd.image) {
        listing.images = Array.isArray(jsonLd.image) ? jsonLd.image : [jsonLd.image];
        listing.thumbnailUrl = listing.images[0];
      }
    }

    // DOM fallback/augmentation
    this.augmentFromDom(doc, listing);

    return listing;
  }

  private parseJsonLd(doc: Document): Record<string, any> | null {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent || "");
        // Look for Vehicle/Car type
        if (data["@type"] === "Car" || data["@type"] === "Vehicle" || data["@type"] === "Product") {
          return data;
        }
        // May be in an array
        if (Array.isArray(data)) {
          const vehicle = data.find(
            (d: any) => d["@type"] === "Car" || d["@type"] === "Vehicle"
          );
          if (vehicle) return vehicle;
        }
      } catch {
        // Invalid JSON-LD, skip
      }
    }
    return null;
  }

  private parseMileage(odometer: any): number | undefined {
    if (!odometer) return undefined;
    if (typeof odometer === "number") return odometer;
    if (typeof odometer === "string") {
      const num = parseInt(odometer.replace(/[^0-9]/g, ""));
      return isNaN(num) ? undefined : num;
    }
    // QuantitativeValue format
    if (odometer.value) {
      const num = parseInt(String(odometer.value).replace(/[^0-9]/g, ""));
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  }

  private augmentFromDom(doc: Document, listing: ScrapedListing): void {
    // Title parsing if JSON-LD didn't provide year/make/model
    if (!listing.year || !listing.make) {
      try {
        const title = doc.querySelector("h1")?.textContent?.trim();
        if (title) {
          const match = title.match(/(\d{4})\s+(\w+)\s+(.+)/);
          if (match) {
            listing.year = listing.year || parseInt(match[1]);
            listing.make = listing.make || match[2];
            listing.model = listing.model || match[3].split(/\s{2,}/)[0].trim();
          }
        }
      } catch { /* graceful degradation */ }
    }

    // Price fallback from DOM
    if (!listing.listedPriceCad) {
      try {
        const priceEl = doc.querySelector('[class*="price"]');
        if (priceEl?.textContent) {
          listing.listedPriceCad = parsePriceToCents(priceEl.textContent);
        }
      } catch { /* graceful degradation */ }
    }

    // Location from DOM
    try {
      const locationEl = doc.querySelector('[class*="location"], [data-testid*="location"]');
      if (locationEl?.textContent) {
        const parts = locationEl.textContent.trim().split(",").map((s) => s.trim());
        if (parts.length >= 2) {
          listing.city = listing.city || parts[0];
          listing.province = listing.province || parts[1];
        }
      }
    } catch { /* graceful degradation */ }

    // Dealer/seller info
    try {
      const dealerEl = doc.querySelector('[class*="dealer-name"], [data-testid*="dealer"]');
      if (dealerEl?.textContent) {
        listing.dealershipName = dealerEl.textContent.trim();
        listing.sellerType = "dealer";
      } else {
        const sellerEl = doc.querySelector('[class*="seller"], [class*="private"]');
        if (sellerEl?.textContent?.toLowerCase().includes("private")) {
          listing.sellerType = "private";
        }
      }
    } catch { /* graceful degradation */ }

    // Trim from title or specs
    if (!listing.trim) {
      try {
        const specItems = doc.querySelectorAll('[class*="spec"], [class*="detail"] li');
        for (const item of specItems) {
          const text = item.textContent?.trim().toLowerCase();
          if (text && (text.includes("trim") || text.includes("package"))) {
            listing.trim = item.textContent?.trim().split(":").pop()?.trim();
            break;
          }
        }
      } catch { /* graceful degradation */ }
    }

    // Images fallback
    if (!listing.images?.length) {
      try {
        const imgs = doc.querySelectorAll('[class*="gallery"] img, [class*="carousel"] img, [class*="photo"] img');
        const urls: string[] = [];
        imgs.forEach((img) => {
          const src = (img as HTMLImageElement).src || img.getAttribute("data-src");
          if (src && !src.includes("placeholder")) urls.push(src);
        });
        if (urls.length) {
          listing.images = urls;
          listing.thumbnailUrl = urls[0];
        }
      } catch { /* graceful degradation */ }
    }
  }
}
