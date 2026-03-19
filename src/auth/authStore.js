import client from "../components/apollo/Client";
import isLoggedQuery from "../components/apollo/schemas/queries/isLogged";
import logoutQuery from "../components/apollo/schemas/queries/logout";
import { apiUri } from "../components/apollo/config";

// In-memory Token + HTTPOnly Cookie Refresh Token pattern:
// - Access token (short-lived JWT) is held in this module-level variable only.
// - Refresh token is stored exclusively in an HTTPOnly cookie managed by the backend.
// - Nothing is persisted to localStorage or sessionStorage.
let _accessToken = null;
let unauthorizedHandler = null;

export function getAccessToken() {
  return _accessToken;
}

export function setAccessToken(token) {
  _accessToken = typeof token === 'string' && token.length > 0 ? token : null;
}

export function clearAccessToken() {
  _accessToken = null;
}

// Requests a new access token from the backend using the HTTPOnly refresh token cookie.
// Uses fetch directly (not Apollo) to avoid circular-dependency and retry-loop issues.
// Returns { accessToken, user } on success, or null on failure.
export async function refreshAccessToken() {
  try {
    const response = await fetch(apiUri, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation RefreshToken {
            refreshToken {
              accessToken
              user {
                id
                email
                username
                roles
              }
            }
          }
        `,
      }),
    });
    const json = await response.json();
    const token = json?.data?.refreshToken?.accessToken;
    if (typeof token === 'string' && token.length > 0) {
      setAccessToken(token);
      return { accessToken: token, user: json?.data?.refreshToken?.user ?? null };
    }
    return null;
  } catch {
    return null;
  }
}

// Verifica sessão via GraphQL: query IsLogged { isLogged }
export async function fetchAuthMe() {
  try {
    const { data } = await client.query({
      query: isLoggedQuery,
      fetchPolicy: 'no-cache',
    });
    return !!data?.isLogged;
  } catch (e) {
    return false;
  }
}

// Realiza logout via GraphQL: query Logout { logout }
export async function logout() {
  try {
    await client.query({
      query: logoutQuery,
      fetchPolicy: 'no-cache',
    });
  } catch (e) {
    // ignore
  } finally {
    clearAccessToken();
    if (unauthorizedHandler) {
      try { unauthorizedHandler(); } catch { /* noop */ }
    }
  }
}

export function setOnUnauthorized(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

export function triggerUnauthorized() {
  clearAccessToken();
  if (unauthorizedHandler) {
    try { unauthorizedHandler(); } catch { /* noop */ }
  }
}

// Nota de segurança: o backend deve responder com
// Access-Control-Allow-Credentials: true e um Access-Control-Allow-Origin explícito (não "*").
// O cookie de refresh deve ter as flags: HttpOnly; Secure; SameSite=Strict (ou Lax).
