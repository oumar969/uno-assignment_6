"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { store } from "../lib/redux/store";
import { useApolloClientInstance } from "../lib/apollo/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = useApolloClientInstance();

  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ReduxProvider>
  );
}
