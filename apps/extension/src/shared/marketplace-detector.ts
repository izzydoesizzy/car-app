import { MarketplaceSource, MARKETPLACE_CONFIGS } from "@carscout/shared";

/**
 * Detect which marketplace a URL belongs to by matching against
 * the configured listing URL patterns.
 */
export function detectMarketplace(url: string): MarketplaceSource | null {
  for (const config of Object.values(MARKETPLACE_CONFIGS)) {
    if (config.source === MarketplaceSource.MANUAL) continue;
    for (const pattern of config.listingUrlPatterns) {
      if (matchPattern(url, pattern)) {
        return config.source;
      }
    }
  }
  return null;
}

/**
 * Simple glob-style URL pattern matching.
 * Supports * as a wildcard that matches any characters.
 */
function matchPattern(url: string, pattern: string): boolean {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}`).test(url);
}

/**
 * Extract the listing ID from a marketplace URL.
 */
export function extractListingId(
  url: string,
  marketplace: MarketplaceSource
): string | undefined {
  try {
    const u = new URL(url);
    const path = u.pathname;

    switch (marketplace) {
      case MarketplaceSource.AUTOTRADER: {
        // https://www.autotrader.ca/a/honda/civic/toronto/ontario/19_12345678_/
        const match = path.match(/\/a\/.*?\/(\d+_\d+_)\/?/);
        return match?.[1];
      }
      case MarketplaceSource.FACEBOOK: {
        // https://www.facebook.com/marketplace/item/1234567890/
        const match = path.match(/\/marketplace\/item\/(\d+)/);
        return match?.[1];
      }
      case MarketplaceSource.KIJIJI: {
        // https://www.kijijiautos.ca/vdp/12345678/
        const match = path.match(/\/vdp\/([^/]+)/);
        return match?.[1];
      }
      case MarketplaceSource.CLUTCH: {
        // https://www.clutch.ca/vehicles/12345/
        const match = path.match(/\/vehicles\/([^/]+)/);
        return match?.[1];
      }
      case MarketplaceSource.CARGURUS: {
        // https://www.cargurus.ca/Cars/inventorylisting/...#listing=12345
        return u.hash?.match(/listing=(\d+)/)?.[1] ?? path.split("/").pop();
      }
      case MarketplaceSource.CARPAGES: {
        // https://www.carpages.ca/used/12345
        const match = path.match(/\/used\/.*?(\d+)/);
        return match?.[1];
      }
      case MarketplaceSource.AUTO123: {
        // https://www.auto123.com/en/used-cars/12345
        const match = path.match(/\/used-cars\/.*?(\d+)/);
        return match?.[1];
      }
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}
