// Base URI da API GraphQL (porta 8080)
export const isProduction = process.env.NODE_ENV === 'production';

export const apiUri = (() => {
  if (isProduction) {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URI || "https://api.espacogeek.com";
  } else {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080";
  }
})();
