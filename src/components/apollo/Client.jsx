import { ApolloClient, InMemoryCache, HttpLink, from, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
  getAccessToken,
  triggerUnauthorized,
  refreshAccessToken,
} from "../../auth/authStore";
import { triggerErrorNotification } from "../toast/notificationStore";
import i18n from "../../i18n/config";
import { apiUri as uri } from "./config";

export { uri };

function resolveErrorMessage(errorCode) {
  if (errorCode !== undefined && errorCode !== null) {
    const key = `errors.${errorCode}`;
    if (i18n.exists(key)) {
      return i18n.t(key);
    }
    if (Math.floor(errorCode / 1000) === 5) {
      return i18n.t('errors.generic');
    }
    return null;
  }
  return i18n.t('errors.generic');
}

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
// Para outros erros GraphQL, traduz extensions.errorCode em notificações amigáveis via i18n.
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

  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      if (err?.extensions?.code === "UNAUTHENTICATED" || err?.extensions?.classification === "UNAUTHORIZED") return;
      const errorCode = err?.extensions?.errorCode;
      const message = resolveErrorMessage(errorCode);
      if (message) {
        triggerErrorNotification(message);
      }
    });
  }

  if (networkError) {
    triggerErrorNotification(i18n.t('errors.generic'));
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
