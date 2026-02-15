import client from "../components/apollo/Client";
import isLoggedQuery from "../components/apollo/schemas/queries/isLogged";
import logoutQuery from "../components/apollo/schemas/queries/logout";

// In-memory auth store and hooks for Apollo link to access token/state
// Cookies HttpOnly serão usados exclusivamente; nenhum token será mantido no cliente.
let unauthorizedHandler = null;

/*
  Modo somente Cookie HttpOnly:
  - O backend deve setar um cookie (ex: 'session') com flags: HttpOnly; Secure; SameSite adequado.
  - O frontend não lê nem persiste tokens (nada em localStorage/sessionStorage).
  - Todas as requisições devem enviar credentials: 'include'.
*/

export function getAccessToken() {
  // Não há token no cliente quando se usa somente cookie HttpOnly
  return null;
}

export function setAccessToken() {
  // No-op em modo HttpOnly
}

export function clearAccessToken() {
  // No-op em modo HttpOnly
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
  if (unauthorizedHandler) {
    try { unauthorizedHandler(); } catch { /* noop */ }
  }
}

// Nota de segurança: proteger contra CSRF (SameSite adequado, CSRF tokens, etc.). O backend precisa
// responder com Access-Control-Allow-Credentials: true e um Access-Control-Allow-Origin explícito (não "*").
