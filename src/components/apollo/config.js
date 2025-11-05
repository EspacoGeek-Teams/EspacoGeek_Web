// Base URI da API GraphQL (porta 8080)
export const apiUri = (() => {
  try {
    const { protocol, hostname } = window.location;
    const apiPort = 8080;
    return `${protocol}//${hostname}:${apiPort}/api`;
  } catch {
    // Fallback para ambientes sem window
    return "http://localhost:8080/api";
  }
})();
