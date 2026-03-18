import { ApolloClient, InMemoryCache, HttpLink, from, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
  getAccessToken,
  triggerUnauthorized,
  refreshAccessToken,
} from "../../auth/authStore";
import { apiUri as uri } from "./config";

export { uri };

const httpLink = new HttpLink({
  uri: uri,
  credentials: 'include',
});

// Injeta o access token em memória como Authorization: Bearer em cada requisição
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Ao receber 401 / UNAUTHENTICATED, tenta renovar o access token via cookie HTTPOnly de refresh.
// Se a renovação for bem-sucedida, reenvia a operação original com o novo token.
// Se falhar, limpa o token e notifica o handler de não-autorizado.
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const unauth =
    (graphQLErrors && graphQLErrors.some((e) => e?.extensions?.code === "UNAUTHENTICATED" || e?.extensions?.classification === "UNAUTHORIZED")) ||
    (networkError && networkError.statusCode === 401);

  if (unauth) {
    return new Observable((observer) => {
      refreshAccessToken()
        .then((newToken) => {
          if (newToken) {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newToken}`,
              },
            });
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          } else {
            triggerUnauthorized();
            observer.complete();
          }
        })
        .catch(() => {
          triggerUnauthorized();
          observer.complete();
        });
    });
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
