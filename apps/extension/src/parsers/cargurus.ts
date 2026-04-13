import { MarketplaceSource, parsePriceToCents } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { extractListingId } from "../shared/marketplace-detector";

export class CarGurusParser implements MarketplaceParser {
  parse(doc: Document, url: string): ScrapedListing {
    const jsonLd = this.parseJsonLd(doc);
    const listing: ScrapedListing = {
      sourceUrl: url,
      sourceMarketplace: MarketplaceSource.CARGURUS,
      sourceListingId: extractListingId(url, MarketplaceSource.CARGURUS),
      rawData: { jsonLd, url },
    };

    // JSON-LD
    if (jsonLd) {
      listing.make = jsonLd.brand?.name;
      listing.model = jsonLd.model;
      listing.year = jsonLd.vehicleModelDate ? parseInt(jsonLd.vehicleModelDate) : undefined;
      listing.vin = jsonLd.vehicleIdentificationNumber;
      listing.exteriorColor = jsonLd.color;
      listing.fuelType = jsonLd.fuelType;
      listing.transmission = jsonLd.vehicleTransmission;

      if (jsonLd.offers?.price) {
        listing.listedPriceCad = parsePriceToCents(String(jsonLd.offers.price));
      }

      if (jsonLd.image) {
        listing.images = Array.isArray(jsonLd.image) ? jsonLd.image : [jsonLd.image];
        listing.thumbnailUrl = listing.images[0];
      }
    }

    // DOM augmentation
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
    // Title fallback
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

    // Mileage
    if (!listing.mileageKm) {
      try {
        const text = doc.body.textContent || "";
        const match = text.match(/([\d,]+)\s*km/i);
        if (match) {
          const num = parseInt(match[1].replace(/,/g, ""));
          if (!isNaN(num) && num > 100) listing.mileageKm = num;
        }
      } catch { /* graceful degradation */ }
    }

    // Location
    try {
      const locationEl = doc.querySelector('[class*="dealer-location"], [class*="location"]');
      if (locationEl?.textContent) {
        const parts = locationEl.textContent.trim().split(",").map((s) => s.trim());
        if (parts.length >= 2) {
          listing.city = listing.city || parts[0];
          listing.province = listing.province || parts[1];
        }
      }
    } catch { /* graceful degradation */ }

    // Dealer info
    try {
      const dealerEl = doc.querySelector('[class*="dealer-name"]');
      if (dealerEl?.textContent) {
        listing.dealershipName = dealerEl.textContent.trim();
        listing.sellerType = "dealer";
      }
    } catch { /* graceful degradation */ }

    // Images fallback
    if (!listing.images?.length) {
      try {
        const imgs = doc.querySelectorAll('[class*="gallery"] img, [class*="media"] img');
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
