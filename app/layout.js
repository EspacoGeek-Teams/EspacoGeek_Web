'use client';

import { ApolloProvider } from "@apollo/client";
import ClientAPI from "../src/components/apollo/Client";
import { ErrorProvider } from "../src/contexts/ErrorContext";
import { ErrorNotification, SuccessNotification } from "../src/components/toast/Notification";
import { SuccessProvider } from "../src/contexts/SuccessContext";
import { GlobalLoadingProvider } from "../src/contexts/GlobalLoadingContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import "../src/modern-normalize.css";
import "../src/index.css";
import "../src/i18n/config";

const primeReactConfig = {
    ripple: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>EspacoGeek</title>
      </head>
      <body>
        <ErrorProvider>
          <SuccessProvider>
            <GlobalLoadingProvider>
              <ApolloProvider client={ClientAPI}>
                <AuthProvider>
                  <PrimeReactProvider value={primeReactConfig}>
                    <main id="rootElement" data-bs-theme="dark" className="h-screen w-screen">
                      {children}
                      <ErrorNotification />
                      <SuccessNotification />
                    </main>
                  </PrimeReactProvider>
                </AuthProvider>
              </ApolloProvider>
            </GlobalLoadingProvider>
          </SuccessProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
