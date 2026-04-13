import { MarketplaceSource, parsePriceToCents } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { extractListingId } from "../shared/marketplace-detector";

export class Auto123Parser implements MarketplaceParser {
  parse(doc: Document, url: string): ScrapedListing {
    const listing: ScrapedListing = {
      sourceUrl: url,
      sourceMarketplace: MarketplaceSource.AUTO123,
      sourceListingId: extractListingId(url, MarketplaceSource.AUTO123),
      rawData: { url },
    };

    // Title
    try {
      const title = doc.querySelector("h1")?.textContent?.trim();
      if (title) {
        const match = title.match(/(\d{4})\s+(\w+)\s+(.+)/);
        if (match) {
          listing.year = parseInt(match[1]);
          listing.make = match[2];
          listing.model = match[3].trim();
        }
      }
    } catch { /* graceful degradation */ }

    // Price
    try {
      const priceEl = doc.querySelector('[class*="price"], [itemprop="price"]');
      if (priceEl?.textContent) {
        listing.listedPriceCad = parsePriceToCents(priceEl.textContent);
      }
    } catch { /* graceful degradation */ }

    // Specs
    try {
      const rows = doc.querySelectorAll('table tr, dl dt, [class*="spec"] li, [class*="detail"] li');
      for (const row of rows) {
        let label: string | undefined;
        let value: string | undefined;

        if (row.tagName === "TR") {
          label = row.querySelector("td:first-child, th")?.textContent?.trim().toLowerCase();
          value = row.querySelector("td:last-child")?.textContent?.trim();
        } else if (row.tagName === "DT") {
          label = row.textContent?.trim().toLowerCase();
          value = row.nextElementSibling?.textContent?.trim();
        } else {
          const parts = row.textContent?.split(":").map((s) => s.trim());
          if (parts && parts.length === 2) {
            label = parts[0].toLowerCase();
            value = parts[1];
          }
        }

        if (!label || !value) continue;

        if (label.includes("kilomet") || label.includes("mileage")) {
          const num = parseInt(value.replace(/[^0-9]/g, ""));
          if (!isNaN(num)) listing.mileageKm = num;
        }
        if (label.includes("transmission")) listing.transmission = value;
        if (label.includes("drivetrain")) listing.drivetrain = value;
        if (label.includes("fuel")) listing.fuelType = value;
        if (label.includes("body")) listing.bodyType = value;
        if (label.includes("colour") || label.includes("color")) listing.exteriorColor = value;
        if (label.includes("engine")) listing.engine = value;
        if (label.includes("trim")) listing.trim = value;
        if (label.includes("vin")) listing.vin = value;
      }
    } catch { /* graceful degradation */ }

    // Location
    try {
      const locationEl = doc.querySelector('[class*="location"], [class*="dealer-address"]');
      if (locationEl?.textContent) {
        const parts = locationEl.textContent.trim().split(",").map((s) => s.trim());
        if (parts.length >= 2) {
          listing.city = parts[0];
          listing.province = parts[1];
        }
      }
    } catch { /* graceful degradation */ }

    // Dealer
    try {
      const dealerEl = doc.querySelector('[class*="dealer-name"], [class*="seller"]');
      if (dealerEl?.textContent) {
        listing.dealershipName = dealerEl.textContent.trim();
        listing.sellerType = "dealer";
      }
    } catch { /* graceful degradation */ }

    // Images
    try {
      const imgs = doc.querySelectorAll('[class*="gallery"] img, [class*="carousel"] img, [class*="slider"] img');
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
