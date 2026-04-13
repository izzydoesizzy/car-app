import { MarketplaceSource } from "@carscout/shared";
import type { MarketplaceParser } from "./types";
import { AutoTraderParser } from "./autotrader";
import { KijijiParser } from "./kijiji";
import { FacebookParser } from "./facebook";
import { ClutchParser } from "./clutch";
import { CarGurusParser } from "./cargurus";
import { CarpagesParser } from "./carpages";
import { Auto123Parser } from "./auto123";

const parsers: Partial<Record<MarketplaceSource, MarketplaceParser>> = {
  [MarketplaceSource.AUTOTRADER]: new AutoTraderParser(),
  [MarketplaceSource.KIJIJI]: new KijijiParser(),
  [MarketplaceSource.FACEBOOK]: new FacebookParser(),
  [MarketplaceSource.CLUTCH]: new ClutchParser(),
  [MarketplaceSource.CARGURUS]: new CarGurusParser(),
  [MarketplaceSource.CARPAGES]: new CarpagesParser(),
  [MarketplaceSource.AUTO123]: new Auto123Parser(),
};

export function getParser(marketplace: MarketplaceSource): MarketplaceParser | null {
  return parsers[marketplace] ?? null;
}
