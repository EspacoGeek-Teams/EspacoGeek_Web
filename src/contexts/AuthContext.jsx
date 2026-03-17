import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import loginMutation from "../components/apollo/schemas/queries/login";
import { setOnUnauthorized, fetchAuthMe, logout as serverLogout, setAccessToken, clearAccessToken } from "../auth/authStore";
import { useApolloClient } from "@apollo/client";

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
      clearAccessToken();
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

  const login = useCallback(async (email, password) => {
    let accessToken = null;
    let userFromServer = null;
    try {
      const result = await apollo.mutate({
        mutation: loginMutation,
        variables: { email, password },
      });
      accessToken = result?.data?.login?.accessToken ?? null;
      userFromServer = result?.data?.login?.user ?? null;
    } catch (_e) {
      return false;
    }

    // Armazena o access token em memória se o backend o retornou
    if (typeof accessToken === 'string' && accessToken.length > 0) {
      setAccessToken(accessToken);
    }

    // Confirma sessão via fetchAuthMe (baseado no cookie e/ou token em memória)
    const logged = await fetchAuthMe();
    if (logged) {
      setIsAuthenticated(true);
      setUser(userFromServer);
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
