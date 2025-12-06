import { Observable } from "rxjs";
import { createApolloClient } from "../lib/apollo/client";
import { gql } from "@apollo/client";
import { store } from "../lib/redux/store";
import { applyServerEvent } from "../lib/redux/gameSlice";

const GAME_UPDATED_SUB = gql`
  subscription OnGameUpdated($id: ID!) {
    gameUpdated(id: $id) {
      id
      winner
      activeColor
      direction
      currentPlayer { id name }
      topCard { color type value }
      players {
        id
        name
        handCount
        hand { color type value back }
      }
    }
  }
`;

export function startGameStream(gameId: string) {
  const apolloClient = createApolloClient();

  const observable = new Observable((subscriber: { next: (arg0: any) => void; error: (arg0: any) => any; }) => {
    const sub = apolloClient
      .subscribe({
        query: GAME_UPDATED_SUB,
        variables: { id: gameId },
      })
      .subscribe({
        next: (result: any) => {
          subscriber.next(result.data.gameUpdated);
        },
        error: (err: any) => subscriber.error(err),
      });

    return () => sub.unsubscribe();
  });

  observable.subscribe((gameState: any) => {
    store.dispatch(applyServerEvent(gameState));
  });
}
