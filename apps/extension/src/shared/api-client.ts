import { getAuth, setAuth, isTokenExpired } from "./auth";

/**
 * Makes an authenticated request to the CarScout API.
 * Handles token refresh on expiry or 401.
 */
export async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const auth = await getAuth();
  if (!auth) {
    throw new Error("Not authenticated");
  }

  // Refresh token if expired
  if (isTokenExpired(auth)) {
    await refreshToken(auth.apiUrl, auth.refreshToken);
  }

  const currentAuth = await getAuth();
  if (!currentAuth) {
    throw new Error("Not authenticated");
  }

  const url = `${currentAuth.apiUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentAuth.accessToken}`,
      ...options.headers,
    },
  });

  // Retry once on 401 (token may have been invalidated server-side)
  if (response.status === 401) {
    const refreshed = await refreshToken(currentAuth.apiUrl, currentAuth.refreshToken);
    if (!refreshed) {
      throw new Error("Session expired. Please sign in again.");
    }
    const retryAuth = await getAuth();
    if (!retryAuth) {
      throw new Error("Not authenticated");
    }
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retryAuth.accessToken}`,
        ...options.headers,
      },
    });
  }

  return response;
}

async function refreshToken(apiUrl: string, refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/extension/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    const auth = await getAuth();
    if (auth) {
      await setAuth({
        ...auth,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
      });
    }
    return true;
  } catch {
    return false;
  }
}
