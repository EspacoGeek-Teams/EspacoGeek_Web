import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { triggerUnauthorized } from "../../auth/authStore";
import { apiUri as uri } from "./config";

export { uri };

// Importante: credentials: 'include' para enviar cookies HttpOnly
const httpLink = new HttpLink({ uri, credentials: "include" });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
    fetchOptions: { credentials: "include" },
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
  link: from([errorLink, authLink, httpLink]),
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
