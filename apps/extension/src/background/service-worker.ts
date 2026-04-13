import { getAuth, setAuth, clearAuth } from "../shared/auth";
import { apiRequest } from "../shared/api-client";
import type { ExtensionMessage } from "../types/messages";
import type { ScrapedListing } from "@carscout/shared";

/**
 * Service worker: handles auth operations and API calls.
 * Content scripts and popup communicate with this via chrome.runtime messages.
 */

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    handleMessage(message).then(sendResponse);
    return true; // keep message channel open for async response
  }
);

async function handleMessage(
  message: ExtensionMessage
): Promise<ExtensionMessage> {
  switch (message.type) {
    case "SIGN_IN":
      return handleSignIn(message.payload);
    case "SIGN_OUT":
      return handleSignOut();
    case "GET_AUTH_STATUS":
      return handleGetAuthStatus();
    case "SAVE_LISTING":
      return handleSaveListing(message.payload);
    default:
      return { type: "AUTH_STATUS", payload: { authenticated: false } };
  }
}

async function handleSignIn(payload: {
  apiUrl: string;
  email: string;
  password: string;
}): Promise<ExtensionMessage> {
  try {
    // Normalize API URL: strip trailing slash
    const apiUrl = payload.apiUrl.replace(/\/+$/, "");

    const response = await fetch(`${apiUrl}/api/extension/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        type: "AUTH_STATUS",
        payload: {
          authenticated: false,
        },
      };
    }

    const data = await response.json();
    await setAuth({
      apiUrl,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
      email: data.user.email,
    });

    // Set badge to indicate connected
    chrome.action.setBadgeText({ text: "" });
    chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });

    return {
      type: "AUTH_STATUS",
      payload: { authenticated: true, email: data.user.email, apiUrl },
    };
  } catch (err) {
    return {
      type: "AUTH_STATUS",
      payload: { authenticated: false },
    };
  }
}

async function handleSignOut(): Promise<ExtensionMessage> {
  await clearAuth();
  chrome.action.setBadgeText({ text: "" });
  return { type: "AUTH_STATUS", payload: { authenticated: false } };
}

async function handleGetAuthStatus(): Promise<ExtensionMessage> {
  const auth = await getAuth();
  if (!auth) {
    return { type: "AUTH_STATUS", payload: { authenticated: false } };
  }
  return {
    type: "AUTH_STATUS",
    payload: {
      authenticated: true,
      email: auth.email,
      apiUrl: auth.apiUrl,
    },
  };
}

async function handleSaveListing(
  listing: ScrapedListing
): Promise<ExtensionMessage> {
  try {
    const response = await apiRequest("/api/extension/save", {
      method: "POST",
      body: JSON.stringify(listing),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        type: "SAVE_RESULT",
        payload: {
          success: false,
          error: data.error || `Save failed (${response.status})`,
        },
      };
    }

    return {
      type: "SAVE_RESULT",
      payload: { success: true, listingId: data.listing?.id },
    };
  } catch (err) {
    return {
      type: "SAVE_RESULT",
      payload: {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
    };
  }
}
