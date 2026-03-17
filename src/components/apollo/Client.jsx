import { ApolloClient, InMemoryCache, HttpLink, from, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
  getAccessToken,
  triggerUnauthorized,
  refreshAccessToken,
} from "../../auth/authStore";
import { triggerErrorNotification } from "../toast/notificationStore";
import { apiUri as uri } from "./config";

export { uri };

const ERROR_MESSAGES = {
  1001: 'E-mail ou senha incorretos.',
  1002: 'Sua sessão expirou, faça login novamente.',
  2001: 'Este e-mail já está em uso.',
  2003: 'Esta mídia já está na sua biblioteca!',
  2004: 'Verifique os dados preenchidos e tente novamente.',
};

const GENERIC_SERVER_ERROR = 'Ops, algo deu errado em nossos servidores. Tente novamente mais tarde.';

function resolveErrorMessage(customNumber) {
  if (customNumber !== undefined && customNumber !== null) {
    if (ERROR_MESSAGES[customNumber]) {
      return ERROR_MESSAGES[customNumber];
    }
    if (Math.floor(customNumber / 1000) === 5) {
      return GENERIC_SERVER_ERROR;
    }
    return null;
  }
  return GENERIC_SERVER_ERROR;
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
// Para outros erros GraphQL, traduz extensions.customNumber em notificações amigáveis.
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
      const customNumber = err?.extensions?.customNumber;
      const message = resolveErrorMessage(customNumber);
      if (message) {
        triggerErrorNotification(message);
      }
    });
  }

  if (networkError) {
    triggerErrorNotification(GENERIC_SERVER_ERROR);
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
