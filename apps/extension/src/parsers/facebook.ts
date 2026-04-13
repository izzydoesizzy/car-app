import { MarketplaceSource, parsePriceToCents } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { extractListingId } from "../shared/marketplace-detector";

/**
 * Facebook Marketplace parser.
 * FB uses obfuscated CSS class names and React-rendered DOM, making this the
 * most brittle parser. We rely on ARIA labels, structural patterns, and text
 * matching. rawData captures a generous text snapshot for future AI extraction.
 */
export class FacebookParser implements MarketplaceParser {
  parse(doc: Document, url: string): ScrapedListing {
    // Capture raw text for AI re-extraction
    const mainContent = doc.querySelector('[role="main"]')?.textContent || "";

    const listing: ScrapedListing = {
      sourceUrl: url,
      sourceMarketplace: MarketplaceSource.FACEBOOK,
      sourceListingId: extractListingId(url, MarketplaceSource.FACEBOOK),
      rawData: {
        url,
        mainContentText: mainContent.slice(0, 5000), // First 5k chars
      },
    };

    this.parseTitle(doc, listing);
    this.parsePrice(doc, listing);
    this.parseLocation(doc, listing);
    this.parseImages(doc, listing);
    this.parseSeller(doc, listing);
    this.parseDetails(doc, mainContent, listing);

    return listing;
  }

  private parseTitle(doc: Document, listing: ScrapedListing): void {
    try {
      // FB listing titles are typically the first h1 or prominent span in the main area
      const main = doc.querySelector('[role="main"]');
      if (!main) return;

      // Try h1 first
      const h1 = main.querySelector("h1");
      const title = h1?.textContent?.trim();
      if (title) {
        // Parse "2019 Honda Civic EX" pattern from the title
        const match = title.match(/(\d{4})\s+(\w+)\s+(.+)/);
        if (match) {
          listing.year = parseInt(match[1]);
          listing.make = match[2];
          // Model might include trim: "Civic EX" -> model="Civic", trim="EX"
          const modelParts = match[3].trim().split(/\s+/);
          listing.model = modelParts[0];
          if (modelParts.length > 1) {
            listing.trim = modelParts.slice(1).join(" ");
          }
        }
      }
    } catch { /* graceful degradation */ }
  }

  private parsePrice(doc: Document, listing: ScrapedListing): void {
    try {
      const main = doc.querySelector('[role="main"]');
      if (!main) return;

      // Price is typically in a prominent span near the top
      // Look for dollar sign patterns in text nodes
      const spans = main.querySelectorAll("span");
      for (const span of spans) {
        const text = span.textContent?.trim();
        if (text && /^\$[\d,]+$/.test(text)) {
          listing.listedPriceCad = parsePriceToCents(text);
          break;
        }
      }

      // Fallback: look for "CA$" prefix
      if (!listing.listedPriceCad) {
        for (const span of spans) {
          const text = span.textContent?.trim();
          if (text && /^CA\$[\d,]+$/.test(text)) {
            listing.listedPriceCad = parsePriceToCents(text);
            break;
          }
        }
      }
    } catch { /* graceful degradation */ }
  }

  private parseLocation(doc: Document, listing: ScrapedListing): void {
    try {
      const main = doc.querySelector('[role="main"]');
      if (!main) return;

      // Location usually appears as "City, Province" near the listing title
      const spans = main.querySelectorAll("span");
      for (const span of spans) {
        const text = span.textContent?.trim();
        if (!text) continue;
        // Match "City, ON" or "City, Ontario" patterns
        const locationMatch = text.match(
          /^([A-Z][a-zA-Z\s]+),\s*(ON|BC|AB|QC|MB|SK|NS|NB|PE|NL|Ontario|British Columbia|Alberta|Quebec|Manitoba|Saskatchewan|Nova Scotia|New Brunswick|Prince Edward Island|Newfoundland)/
        );
        if (locationMatch) {
          listing.city = locationMatch[1].trim();
          listing.province = locationMatch[2];
          break;
        }
      }
    } catch { /* graceful degradation */ }
  }

  private parseImages(doc: Document, listing: ScrapedListing): void {
    try {
      const main = doc.querySelector('[role="main"]');
      if (!main) return;

      const images: string[] = [];
      const imgs = main.querySelectorAll("img");
      for (const img of imgs) {
        const src = img.src || img.getAttribute("data-src");
        if (
          src &&
          !src.includes("emoji") &&
          !src.includes("avatar") &&
          !src.includes("profile") &&
          (src.includes("scontent") || src.includes("fbcdn"))
        ) {
          images.push(src);
        }
      }

      if (images.length) {
        listing.images = images;
        listing.thumbnailUrl = images[0];
      }
    } catch { /* graceful degradation */ }
  }

  private parseSeller(doc: Document, listing: ScrapedListing): void {
    try {
      // Seller name often near a profile link
      const profileLinks = document.querySelectorAll('a[href*="/marketplace/profile/"], a[href*="facebook.com/"][role="link"]');
      for (const link of profileLinks) {
        const name = link.textContent?.trim();
        if (name && name.length > 1 && name.length < 50) {
          listing.sellerName = name;
          listing.sellerType = "private"; // FB Marketplace is typically private sellers
          break;
        }
      }
    } catch { /* graceful degradation */ }
  }

  private parseDetails(doc: Document, mainText: string, listing: ScrapedListing): void {
    try {
      // Extract mileage from text content
      const mileageMatch = mainText.match(/(\d[\d,]*)\s*km/i);
      if (mileageMatch) {
        const num = parseInt(mileageMatch[1].replace(/,/g, ""));
        if (!isNaN(num) && num > 100 && num < 1000000) {
          listing.mileageKm = num;
        }
      }

      // Transmission
      if (/\bautomatic\b/i.test(mainText)) {
        listing.transmission = "Automatic";
      } else if (/\bmanual\b/i.test(mainText)) {
        listing.transmission = "Manual";
      }

      // Drivetrain
      if (/\bAWD\b|\ball[\s-]wheel/i.test(mainText)) {
        listing.drivetrain = "AWD";
      } else if (/\b4WD\b|\bfour[\s-]wheel/i.test(mainText)) {
        listing.drivetrain = "4WD";
      } else if (/\bFWD\b|\bfront[\s-]wheel/i.test(mainText)) {
        listing.drivetrain = "FWD";
      } else if (/\bRWD\b|\brear[\s-]wheel/i.test(mainText)) {
        listing.drivetrain = "RWD";
      }

      // Fuel type
      if (/\belectric\b/i.test(mainText) && !/\bwindow|seat|mirror\b/i.test(mainText.slice(mainText.search(/electric/i) - 20, mainText.search(/electric/i) + 30))) {
        listing.fuelType = "Electric";
      } else if (/\bhybrid\b/i.test(mainText)) {
        listing.fuelType = "Hybrid";
      } else if (/\bdiesel\b/i.test(mainText)) {
        listing.fuelType = "Diesel";
      }
    } catch { /* graceful degradation */ }
  }
}
