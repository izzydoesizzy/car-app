/** Token and credential storage using chrome.storage.local */

interface StoredAuth {
  apiUrl: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix seconds
  email: string;
}

const STORAGE_KEY = "carscout_auth";

export async function getAuth(): Promise<StoredAuth | null> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] ?? null;
}

export async function setAuth(auth: StoredAuth): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: auth });
}

export async function clearAuth(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
}

export function isTokenExpired(auth: StoredAuth): boolean {
  // Consider expired 60 seconds early to avoid edge cases
  return Date.now() / 1000 > auth.expiresAt - 60;
}
