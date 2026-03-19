import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import loginMutation from "../components/apollo/schemas/queries/login";
import { setOnUnauthorized, refreshAccessToken, logout as serverLogout, setAccessToken, clearAccessToken } from "../auth/authStore";
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

  // Checagem automática de sessão no carregamento da app usando refreshToken,
  // que retorna tanto o accessToken quanto os dados do usuário em uma única chamada.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await refreshAccessToken();
        if (!cancelled) {
          if (result) {
            setIsAuthenticated(true);
            setUser(result.user ?? null);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    let loginData = null;
    try {
      const result = await apollo.mutate({
        mutation: loginMutation,
        variables: { email, password },
      });
      loginData = result?.data?.login ?? null;
    } catch (_e) {
      return false;
    }

    const accessToken = loginData?.accessToken ?? null;

    // Armazena o access token em memória se o backend o retornou
    if (typeof accessToken === 'string' && accessToken.length > 0) {
      setAccessToken(accessToken);
      // Use user data returned directly by the login mutation
      setIsAuthenticated(true);
      setUser(loginData?.user ?? null);
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
