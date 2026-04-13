import type { MarketplaceSource } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";

/** Messages sent between popup, content script, and service worker. */

export type ExtensionMessage =
  // Content script communication
  | { type: "GET_LISTING_DATA" }
  | {
      type: "LISTING_DATA";
      payload: {
        marketplace: MarketplaceSource;
        data: ScrapedListing | null;
        error?: string;
      };
    }

  // Auth (popup -> service worker)
  | {
      type: "SIGN_IN";
      payload: { apiUrl: string; email: string; password: string };
    }
  | { type: "SIGN_OUT" }
  | { type: "GET_AUTH_STATUS" }
  | {
      type: "AUTH_STATUS";
      payload: { authenticated: boolean; email?: string; apiUrl?: string };
    }

  // Save (popup -> service worker)
  | { type: "SAVE_LISTING"; payload: ScrapedListing }
  | {
      type: "SAVE_RESULT";
      payload: { success: boolean; listingId?: string; error?: string };
    };
