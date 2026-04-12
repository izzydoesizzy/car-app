export enum MarketplaceSource {
  AUTOTRADER = "autotrader",
  FACEBOOK = "facebook",
  KIJIJI = "kijiji",
  CLUTCH = "clutch",
  CARGURUS = "cargurus",
  CARPAGES = "carpages",
  AUTO123 = "auto123",
  MANUAL = "manual", // User manually added
}

export const MARKETPLACE_LABELS: Record<MarketplaceSource, string> = {
  [MarketplaceSource.AUTOTRADER]: "AutoTrader.ca",
  [MarketplaceSource.FACEBOOK]: "Facebook Marketplace",
  [MarketplaceSource.KIJIJI]: "Kijiji Autos",
  [MarketplaceSource.CLUTCH]: "Clutch",
  [MarketplaceSource.CARGURUS]: "CarGurus",
  [MarketplaceSource.CARPAGES]: "Carpages",
  [MarketplaceSource.AUTO123]: "Auto123",
  [MarketplaceSource.MANUAL]: "Manual Entry",
};

export const MARKETPLACE_URLS: Record<MarketplaceSource, string> = {
  [MarketplaceSource.AUTOTRADER]: "https://www.autotrader.ca",
  [MarketplaceSource.FACEBOOK]: "https://www.facebook.com/marketplace",
  [MarketplaceSource.KIJIJI]: "https://www.kijijiautos.ca",
  [MarketplaceSource.CLUTCH]: "https://www.clutch.ca",
  [MarketplaceSource.CARGURUS]: "https://www.cargurus.ca",
  [MarketplaceSource.CARPAGES]: "https://www.carpages.ca",
  [MarketplaceSource.AUTO123]: "https://www.auto123.com",
  [MarketplaceSource.MANUAL]: "",
};
