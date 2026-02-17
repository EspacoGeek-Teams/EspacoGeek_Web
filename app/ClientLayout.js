'use client';

import { ApolloProvider } from "@apollo/client";
import ClientAPI from "../src/components/apollo/Client";
import { ErrorProvider } from "../src/contexts/ErrorContext";
import { ErrorNotification, SuccessNotification } from "../src/components/toast/Notification";
import { SuccessProvider } from "../src/contexts/SuccessContext";
import { GlobalLoadingProvider } from "../src/contexts/GlobalLoadingContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import { useEffect, useState } from "react";

const primeReactConfig = {
    ripple: true,
};

export default function ClientLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  
  // Initialize i18n and mark as client-side
  useEffect(() => {
    setIsClient(true);
    import("../src/i18n/config");
  }, []);

  // Return null during SSR to avoid document access issues
  if (!isClient) {
    return null;
  }

  return (
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
  );
}
