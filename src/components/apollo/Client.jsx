import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getAccessToken, triggerUnauthorized } from "../../auth/authStore";

const uri = window.location.href
  .split(":")[0]
  .concat(":")
  .concat(window.location.href.split(":")[1].concat(":8080"))
  .concat("/api");

const httpLink = new HttpLink({ uri, credentials: "include" });

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const unauth =
    (graphQLErrors && graphQLErrors.some((e) => e?.extensions?.code === "UNAUTHENTICATED")) ||
    (networkError && networkError.statusCode === 401);
  if (unauth) {
    triggerUnauthorized();
  }
});

const clientAPI = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default clientAPI;
