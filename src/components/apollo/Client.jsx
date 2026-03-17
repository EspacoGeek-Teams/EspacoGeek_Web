import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { triggerUnauthorized } from "../../auth/authStore";
import { apiUri as uri } from "./config";

export { uri };

const httpLink = new HttpLink({
  uri: uri,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
    fetchOptions: { credentials: "include" },
  };
});

const getXsrfToken = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  if (match) return match[2];
  return null;
};

const csrfLink = setContext((_, { headers }) => {
  const xsrfToken = getXsrfToken();
  return {
    headers: {
      ...headers,
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const unauth =
    (graphQLErrors && graphQLErrors.some((e) => e?.extensions?.code === "UNAUTHENTICATED" || e?.extensions?.classification === "UNAUTHORIZED")) ||
    (networkError && networkError.statusCode === 401);
  if (unauth) {
    triggerUnauthorized();
  }
});

const clientAPI = new ApolloClient({
  link: from([errorLink, csrfLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-first" },
    query: { fetchPolicy: "cache-first" },
    mutate: { fetchPolicy: "no-cache" },
  },
});

export default clientAPI;

// Observação: para CORS com cookies, o backend deve responder com
// Access-Control-Allow-Credentials: true e um Access-Control-Allow-Origin
// explícito (não usar "*").
