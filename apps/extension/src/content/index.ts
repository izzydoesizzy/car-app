import { detectMarketplace } from "../shared/marketplace-detector";
import { getParser } from "../parsers/registry";
import type { ExtensionMessage } from "../types/messages";

const marketplace = detectMarketplace(window.location.href);

if (marketplace) {
  const parser = getParser(marketplace);

  chrome.runtime.onMessage.addListener(
    (message: ExtensionMessage, _sender, sendResponse) => {
      if (message.type === "GET_LISTING_DATA") {
        if (!parser) {
          sendResponse({
            type: "LISTING_DATA",
            payload: { marketplace, data: null, error: "No parser for this marketplace" },
          });
          return true;
        }

        try {
          const data = parser.parse(document, window.location.href);
          sendResponse({
            type: "LISTING_DATA",
            payload: { marketplace, data },
          });
        } catch (err) {
          sendResponse({
            type: "LISTING_DATA",
            payload: {
              marketplace,
              data: null,
              error: err instanceof Error ? err.message : "Parse failed",
            },
          });
        }
        return true;
      }
    }
  );
}
