import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import loginMutation from "../components/apollo/schemas/queries/login";
import { setOnUnauthorized, fetchAuthMe, logout as serverLogout } from "../auth/authStore";
import { useApolloClient, gql } from "@apollo/client";

export const AuthContext = createContext({
  // accessToken removido em modo HttpOnly puro
  isAuthenticated: false,
  user: null,
  initializing: true,
  login: async () => false,
  logout: () => {},
  openLogin: () => {},
  closeLogin: () => {},
  loginVisible: false,
});

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loginVisible, setLoginVisible] = useState(false);
  const apollo = useApolloClient();

  useEffect(() => {
    setOnUnauthorized(() => {
      // Apenas ajusta estado; não força modal nem mostra erro
      setIsAuthenticated(false);
      setUser(null);
    });
  }, []);

  // Checagem automática de sessão no carregamento da app
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const logged = await fetchAuthMe();
        if (!cancelled) {
          setIsAuthenticated(!!logged);
          setUser(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Documento para fallback quando o backend expõe login como Query
  const loginQueryDoc = gql`
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;

  const login = useCallback(async (email, password) => {
    // Tenta mutation primeiro (padrão recomendado); se falhar, tenta query
    try {
      await apollo.mutate({
        mutation: loginMutation,
        variables: { email, password },
      });
    } catch (_e) {
      try {
        await apollo.query({
          query: loginQueryDoc,
          variables: { email, password },
          fetchPolicy: "no-cache",
        });
      } catch (_e2) {
        return false;
      }
    }

    // Confirma sessão via /auth/me (baseado no cookie)
    const logged = await fetchAuthMe();
    if (logged) {
      setIsAuthenticated(true);
      setUser(null);
      setLoginVisible(false);
      return true;
    }
    return false;
  }, [apollo]);

  const logout = useCallback(async () => {
    await serverLogout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const openLogin = useCallback(() => setLoginVisible(true), []);
  const closeLogin = useCallback(() => setLoginVisible(false), []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    initializing,
    login,
    logout,
    openLogin,
    closeLogin,
    loginVisible,
  }), [isAuthenticated, user, initializing, login, logout, openLogin, closeLogin, loginVisible]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
