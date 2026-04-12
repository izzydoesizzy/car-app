import { MarketplaceSource } from "../types/marketplace";

export interface MarketplaceConfig {
  source: MarketplaceSource;
  label: string;
  baseUrl: string;
  /** URL patterns that indicate a single listing page (for extension content scripts) */
  listingUrlPatterns: string[];
  /** Color for UI badges */
  color: string;
}

export const MARKETPLACE_CONFIGS: Record<MarketplaceSource, MarketplaceConfig> = {
  [MarketplaceSource.AUTOTRADER]: {
    source: MarketplaceSource.AUTOTRADER,
    label: "AutoTrader.ca",
    baseUrl: "https://www.autotrader.ca",
    listingUrlPatterns: ["https://www.autotrader.ca/a/*"],
    color: "#e21836",
  },
  [MarketplaceSource.FACEBOOK]: {
    source: MarketplaceSource.FACEBOOK,
    label: "Facebook Marketplace",
    baseUrl: "https://www.facebook.com/marketplace",
    listingUrlPatterns: ["https://www.facebook.com/marketplace/item/*"],
    color: "#1877f2",
  },
  [MarketplaceSource.KIJIJI]: {
    source: MarketplaceSource.KIJIJI,
    label: "Kijiji Autos",
    baseUrl: "https://www.kijijiautos.ca",
    listingUrlPatterns: ["https://www.kijijiautos.ca/vdp/*"],
    color: "#373373",
  },
  [MarketplaceSource.CLUTCH]: {
    source: MarketplaceSource.CLUTCH,
    label: "Clutch",
    baseUrl: "https://www.clutch.ca",
    listingUrlPatterns: ["https://www.clutch.ca/vehicles/*"],
    color: "#ff6b35",
  },
  [MarketplaceSource.CARGURUS]: {
    source: MarketplaceSource.CARGURUS,
    label: "CarGurus",
    baseUrl: "https://www.cargurus.ca",
    listingUrlPatterns: ["https://www.cargurus.ca/Cars/*"],
    color: "#6c3baa",
  },
  [MarketplaceSource.CARPAGES]: {
    source: MarketplaceSource.CARPAGES,
    label: "Carpages",
    baseUrl: "https://www.carpages.ca",
    listingUrlPatterns: ["https://www.carpages.ca/used/*"],
    color: "#0066cc",
  },
  [MarketplaceSource.AUTO123]: {
    source: MarketplaceSource.AUTO123,
    label: "Auto123",
    baseUrl: "https://www.auto123.com",
    listingUrlPatterns: ["https://www.auto123.com/en/used-cars/*"],
    color: "#cc0000",
  },
  [MarketplaceSource.MANUAL]: {
    source: MarketplaceSource.MANUAL,
    label: "Manual Entry",
    baseUrl: "",
    listingUrlPatterns: [],
    color: "#6b7280",
  },
};
