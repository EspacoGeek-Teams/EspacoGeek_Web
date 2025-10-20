import React, { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import loginQuery from "../components/apollo/schemas/queries/login";
import { clearAccessToken, setAccessToken, setOnUnauthorized } from "../auth/authStore";
import { useApolloClient } from "@apollo/client";
import { ErrorContext } from "./ErrorContext";

export const AuthContext = createContext({
  accessToken: null,
  login: async () => false,
  logout: () => {},
  openLogin: () => {},
  closeLogin: () => {},
  loginVisible: false,
});

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const apollo = useApolloClient();
  const { showError } = useContext(ErrorContext);

  useEffect(() => {
    setOnUnauthorized(() => {
      setLoginVisible(true);
      showError("Faça login para continuar.");
    });
  }, [showError]);

  const applyToken = useCallback((t) => {
    setToken(t);
    if (t) setAccessToken(t); else clearAccessToken();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await apollo.query({
        query: loginQuery,
        variables: { email, password },
        fetchPolicy: "no-cache",
      });
      const t = data?.login || null;
      applyToken(t);
      setLoginVisible(false);
      return !!t;
    } catch (e) {
      showError("Falha no login.");
      return false;
    }
  }, [apollo, applyToken, showError]);

  const logout = useCallback(() => {
    applyToken(null);
  }, [applyToken]);

  const openLogin = useCallback(() => setLoginVisible(true), []);
  const closeLogin = useCallback(() => setLoginVisible(false), []);

  const value = useMemo(() => ({
    accessToken: token,
    login,
    logout,
    openLogin,
    closeLogin,
    loginVisible,
  }), [token, login, logout, openLogin, closeLogin, loginVisible]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
