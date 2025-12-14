"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import { useApolloClientInstance } from "../lib/apollo/client";


export default function Providers({ children }: { children: React.ReactNode }) {
  const client = useApolloClientInstance();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
