import type { MarketplaceSource } from "./marketplace";

export type ListingStatus =
  | "saved"
  | "contacted"
  | "viewing_scheduled"
  | "inspected"
  | "offer_made"
  | "purchased"
  | "archived";

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  saved: "Saved",
  contacted: "Contacted",
  viewing_scheduled: "Viewing Scheduled",
  inspected: "Inspected",
  offer_made: "Offer Made",
  purchased: "Purchased",
  archived: "Archived",
};

export type SellerType = "private" | "dealer";

export type ConversationPlatform =
  | "facebook_messenger"
  | "email"
  | "phone"
  | "text"
  | "kijiji_chat"
  | "whatsapp"
  | "other";

export const CONVERSATION_PLATFORM_LABELS: Record<ConversationPlatform, string> = {
  facebook_messenger: "FB Messenger",
  email: "Email",
  phone: "Phone",
  text: "Text Message",
  kijiji_chat: "Kijiji Chat",
  whatsapp: "WhatsApp",
  other: "Other",
};

/**
 * Data scraped from a marketplace listing by the Chrome extension.
 * All fields optional except sourceUrl and sourceMarketplace since
 * different marketplaces expose different data.
 */
export interface ScrapedListing {
  // Source
  sourceUrl: string;
  sourceMarketplace: MarketplaceSource;
  sourceListingId?: string;

  // Vehicle identity
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;

  // Vehicle details
  bodyType?: string;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
  engine?: string;
  mileageKm?: number;
  vehicleOptions?: string[];
  hasWinterTires?: boolean;

  // Pricing
  listedPriceCad?: number; // In cents

  // Location
  city?: string;
  province?: string;
  postalCode?: string;

  // Seller
  sellerName?: string;
  sellerType?: SellerType;
  dealershipName?: string;
  dealershipWebsite?: string;
  contactPhone?: string;

  // Media
  images?: string[];
  thumbnailUrl?: string;

  // Dates
  listingDate?: string; // ISO date string

  // Raw payload for re-extraction
  rawData?: Record<string, unknown>;
}

/**
 * Full listing as stored in the database.
 * Extends scraped data with user-added research fields
 * (modeled after user's Airtable workflow).
 */
export interface Listing extends ScrapedListing {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  // Tracking
  status: ListingStatus;
  isAvailable: boolean;
  isStrongContender: boolean;
  isFavorite: boolean;

  // Pricing & negotiation
  negotiatedPriceCad?: number; // In cents
  cbbLow?: number; // Canadian Black Book - in cents
  cbbAverage?: number;
  cbbHigh?: number;
  cbbLink?: string;
  negotiatingPosition?: string;

  // Condition & history
  accidentHistory?: string;
  damageDescription?: string;
  goodServiceRecord?: boolean;
  numOwners?: number;
  reasonForSelling?: string;
  carfaxUrl?: string;
  addOns?: string;

  // Seller & communication
  contactName?: string;
  conversationPlatform?: ConversationPlatform;
  conversationLink?: string;

  // User research
  userNotes?: string;
  redFlags?: string;
  learnings?: string;
  userRating?: number; // 1-5
}

/**
 * Fields the user can update on a listing (PATCH).
 */
export type ListingUpdate = Partial<
  Omit<Listing, "id" | "userId" | "createdAt" | "updatedAt" | "sourceUrl" | "sourceMarketplace">
>;
