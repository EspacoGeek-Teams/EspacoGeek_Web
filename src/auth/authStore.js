// In-memory auth store and hooks for Apollo link to access token/state
let accessToken = null;
let unauthorizedHandler = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

export function setOnUnauthorized(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

export function triggerUnauthorized() {
  if (unauthorizedHandler) {
    try { unauthorizedHandler(); } catch { /* noop */ }
  }
}
