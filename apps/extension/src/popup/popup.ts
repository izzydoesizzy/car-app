import type { ExtensionMessage } from "../types/messages";
import { MARKETPLACE_LABELS, type MarketplaceSource } from "@carscout/shared";
import { MARKETPLACE_CONFIGS } from "@carscout/shared";
import type { ScrapedListing } from "@carscout/shared";

// DOM elements
const viewSignin = document.getElementById("view-signin")!;
const viewNoListing = document.getElementById("view-no-listing")!;
const viewListing = document.getElementById("view-listing")!;

const signinForm = document.getElementById("signin-form") as HTMLFormElement;
const signinBtn = document.getElementById("signin-btn") as HTMLButtonElement;
const signinError = document.getElementById("signin-error")!;
const apiUrlInput = document.getElementById("api-url") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
const saveStatus = document.getElementById("save-status")!;

const previewImage = document.getElementById("preview-image") as HTMLImageElement;
const previewMarketplace = document.getElementById("preview-marketplace")!;
const previewTitle = document.getElementById("preview-title")!;
const previewPrice = document.getElementById("preview-price")!;
const previewMileage = document.getElementById("preview-mileage")!;
const previewLocation = document.getElementById("preview-location")!;

const signoutBtns = document.querySelectorAll(
  "#signout-btn-idle, #signout-btn-listing"
);

let currentListing: ScrapedListing | null = null;

// ── Views ───────────────────────────────────────────────────

function showView(view: "signin" | "no-listing" | "listing") {
  viewSignin.style.display = view === "signin" ? "block" : "none";
  viewNoListing.style.display = view === "no-listing" ? "block" : "none";
  viewListing.style.display = view === "listing" ? "block" : "none";
}

// ── Init ────────────────────────────────────────────────────

async function init() {
  // Check auth status
  const authStatus = await sendMessage({ type: "GET_AUTH_STATUS" });

  if (!authStatus.payload?.authenticated) {
    // Pre-fill API URL if previously stored
    const stored = await chrome.storage.local.get("carscout_last_api_url");
    if (stored.carscout_last_api_url) {
      apiUrlInput.value = stored.carscout_last_api_url;
    }
    showView("signin");
    return;
  }

  // Authenticated — try to get listing data from active tab
  await tryGetListingData();
}

async function tryGetListingData() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) {
      showView("no-listing");
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GET_LISTING_DATA",
    });

    if (response?.type === "LISTING_DATA" && response.payload?.data) {
      currentListing = response.payload.data;
      renderPreview(response.payload.marketplace, currentListing);
      showView("listing");
    } else {
      showView("no-listing");
    }
  } catch {
    // Content script not injected on this page
    showView("no-listing");
  }
}

function renderPreview(marketplace: MarketplaceSource, listing: ScrapedListing) {
  // Marketplace badge
  const config = MARKETPLACE_CONFIGS[marketplace];
  if (config) {
    previewMarketplace.textContent = config.label;
    previewMarketplace.style.backgroundColor = config.color;
    previewMarketplace.style.display = "inline-block";
  }

  // Title
  const parts = [listing.year, listing.make, listing.model, listing.trim].filter(Boolean);
  previewTitle.textContent = parts.length > 0 ? parts.join(" ") : "Car Listing";

  // Price
  if (listing.listedPriceCad) {
    const dollars = listing.listedPriceCad / 100;
    previewPrice.textContent = `$${dollars.toLocaleString("en-CA")}`;
  } else {
    previewPrice.textContent = "";
  }

  // Mileage
  if (listing.mileageKm) {
    previewMileage.textContent = `${listing.mileageKm.toLocaleString()} km`;
  } else {
    previewMileage.textContent = "";
  }

  // Location
  const loc = [listing.city, listing.province].filter(Boolean).join(", ");
  previewLocation.textContent = loc;

  // Image
  const imgUrl = listing.thumbnailUrl || listing.images?.[0];
  if (imgUrl) {
    previewImage.src = imgUrl;
    previewImage.style.display = "block";
  } else {
    previewImage.style.display = "none";
  }

  // Reset save state
  saveBtn.disabled = false;
  saveBtn.textContent = "Save to CarScout";
  saveStatus.style.display = "none";
}

// ── Events ──────────────────────────────────────────────────

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signinBtn.disabled = true;
  signinBtn.textContent = "Signing in...";
  signinError.style.display = "none";

  const apiUrl = apiUrlInput.value.trim().replace(/\/+$/, "");
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Remember API URL for next time
  await chrome.storage.local.set({ carscout_last_api_url: apiUrl });

  const response = await sendMessage({
    type: "SIGN_IN",
    payload: { apiUrl, email, password },
  });

  if (response?.payload?.authenticated) {
    await tryGetListingData();
  } else {
    signinError.textContent = "Sign in failed. Check your credentials and URL.";
    signinError.style.display = "block";
    signinBtn.disabled = false;
    signinBtn.textContent = "Sign In";
  }
});

saveBtn.addEventListener("click", async () => {
  if (!currentListing) return;

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";
  saveStatus.style.display = "none";

  const response = await sendMessage({
    type: "SAVE_LISTING",
    payload: currentListing,
  });

  if (response?.payload?.success) {
    saveBtn.textContent = "Saved!";
    saveStatus.textContent = "Listing saved to your CarScout dashboard.";
    saveStatus.className = "success";
    saveStatus.style.display = "block";
  } else {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save to CarScout";
    saveStatus.textContent = response?.payload?.error || "Failed to save listing.";
    saveStatus.className = "error";
    saveStatus.style.display = "block";
  }
});

signoutBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    await sendMessage({ type: "SIGN_OUT" });
    showView("signin");
  });
});

// ── Helpers ─────────────────────────────────────────────────

function sendMessage(message: ExtensionMessage): Promise<ExtensionMessage> {
  return chrome.runtime.sendMessage(message);
}

// Start
init();
