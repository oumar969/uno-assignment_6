"use client";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useMemo } from "react";// React hook for memoization

export function createApolloClient() {
  // safe access to localStorage
  const playerId = typeof window !== "undefined" ? localStorage.getItem("myPlayerId") || "" : "";

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
      "x-player-id": playerId,
    },
  });

  const wsLink = typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:4001/graphql",
          connectionParams: () => ({
            "x-player-id": localStorage.getItem("myPlayerId") || "",
          }),
        })
      )
    : null;

  const splitLink = typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" && def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

  return new ApolloClient({
    link: splitLink as any,
    cache: new InMemoryCache(),
  });
}

export function useApolloClientInstance() {
  const client = useMemo(() => createApolloClient(), []);
  return client;
}
