// Base URI da API GraphQL (porta 8080)
export const isProduction = import.meta.env.MODE === 'production';

export const apiUri = (() => {
  if (isProduction) {
    return "https://api.espacogeek.com";
  } else {
    return "http://localhost:8080";
  }
})();
