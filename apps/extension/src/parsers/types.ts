import type { ScrapedListing } from "@carscout/shared";

export interface MarketplaceParser {
  /** Extract listing data from the current page DOM. */
  parse(doc: Document, url: string): ScrapedListing;
}
