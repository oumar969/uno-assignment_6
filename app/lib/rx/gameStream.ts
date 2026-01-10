// lib/rx/gameStream.ts
"use client";

import { BehaviorSubject, map, filter, distinctUntilChanged } from "rxjs";
import type { ApolloClient } from "@apollo/client";
import { GAME_UPDATED } from "../apollo/operations";

// Den "globale" RxJS state (kan også ligge per gameId hvis du vil)
export const game$ = new BehaviorSubject<any | null>(null);

/**
 * Start a reactive pipeline:
 * GraphQL subscription -> RxJS operators -> BehaviorSubject
 */
export function startGameStream(
  client: ApolloClient,
  gameId: string
) {
  const apolloSub = client
    .subscribe({
      query: GAME_UPDATED,
      variables: { id: gameId },
      fetchPolicy: "no-cache",
    })
    .pipe(
      map((res: any) => res?.data?.gameUpdated),
      filter(Boolean), // drop null/undefined
      // undgå spam re-renders hvis samme state kommer igen
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    )
    .subscribe((game) => {
      game$.next(game);
    });

  return () => apolloSub.unsubscribe();
}
