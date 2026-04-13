import { MarketplaceSource, parsePriceToCents } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { extractListingId } from "../shared/marketplace-detector";

export class ClutchParser implements MarketplaceParser {
  parse(doc: Document, url: string): ScrapedListing {
    const listing: ScrapedListing = {
      sourceUrl: url,
      sourceMarketplace: MarketplaceSource.CLUTCH,
      sourceListingId: extractListingId(url, MarketplaceSource.CLUTCH),
      sellerType: "dealer",
      dealershipName: "Clutch",
      rawData: { url },
    };

    // Title: typically "Year Make Model Trim"
    try {
      const title = doc.querySelector("h1")?.textContent?.trim();
      if (title) {
        const match = title.match(/(\d{4})\s+(\w+)\s+(\w+)\s*(.*)?/);
        if (match) {
          listing.year = parseInt(match[1]);
          listing.make = match[2];
          listing.model = match[3];
          listing.trim = match[4]?.trim() || undefined;
        }
      }
    } catch { /* graceful degradation */ }

    // Price
    try {
      const priceEl = doc.querySelector('[class*="price"], [data-testid*="price"]');
      if (priceEl?.textContent) {
        listing.listedPriceCad = parsePriceToCents(priceEl.textContent);
      }
    } catch { /* graceful degradation */ }

    // Specs from key-value pairs
    try {
      const specItems = doc.querySelectorAll('[class*="spec"] li, [class*="detail"] li, [class*="feature"] li, dl dt');
      for (const item of specItems) {
        const label = (item.tagName === "DT" ? item : item.querySelector('[class*="label"]'))?.textContent?.trim().toLowerCase();
        const value = (item.tagName === "DT" ? item.nextElementSibling : item.querySelector('[class*="value"]'))?.textContent?.trim();
        if (!label || !value) continue;

        if (label.includes("kilomet") || label.includes("mileage")) {
          const num = parseInt(value.replace(/[^0-9]/g, ""));
          if (!isNaN(num)) listing.mileageKm = num;
        }
        if (label.includes("transmission")) listing.transmission = value;
        if (label.includes("drivetrain") || label.includes("drive")) listing.drivetrain = value;
        if (label.includes("fuel") || label.includes("engine type")) listing.fuelType = value;
        if (label.includes("body")) listing.bodyType = value;
        if (label.includes("exterior") || label.includes("colour")) listing.exteriorColor = value;
        if (label.includes("interior")) listing.interiorColor = value;
        if (label.includes("engine") && !label.includes("type")) listing.engine = value;
      }
    } catch { /* graceful degradation */ }

    // Images
    try {
      const imgs = doc.querySelectorAll('[class*="gallery"] img, [class*="carousel"] img, [class*="photo"] img');
      const urls: string[] = [];
      imgs.forEach((img) => {
        const src = (img as HTMLImageElement).src || img.getAttribute("data-src");
        if (src && !src.includes("placeholder") && !src.includes("logo")) urls.push(src);
      });
      if (urls.length) {
        listing.images = urls;
        listing.thumbnailUrl = urls[0];
      }
    } catch { /* graceful degradation */ }

    return listing;
  }
}
