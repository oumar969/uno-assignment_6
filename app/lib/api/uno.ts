import { gql } from "@apollo/client";
import { createApolloClient } from "../apollo/client";

const apolloClient = createApolloClient();

// ---- QUERIES ----
export const GET_GAMES = gql`
  query {
    games {
      id
      players { id name }
    }
  }
`;

export const GET_GAME = gql`
  query Game($id: ID!) {
    game(id: $id) {
      id
      winner
      topCard { color type value }
      activeColor
      currentPlayer { id name }
      players {
        id
        name
        hand { color type value back }
        handCount
      }
    }
  }
`;

const CREATE_GAME = gql`
  mutation {
    createGame { id }
  }
`;

const JOIN_GAME = gql`
  mutation Join($gameId: ID!, $name: String!) {
    joinGame(gameId: $gameId, name: $name) {
      game { id players { id name } }
      viewerId
    }
  }
`;

const PLAY_CARD = gql`
  mutation Play(
    $gameId: ID!,
    $playerId: ID!,
    $cardIndex: Int!,
    $chosenColor: String
  ) {
    playCard(
      gameId: $gameId,
      playerId: $playerId,
      cardIndex: $cardIndex,
      chosenColor: $chosenColor
    ) {
      id
      winner
      activeColor
      topCard { color type value }
      players {
        id name
        hand { color type value back }
      }
    }
  }
`;

const DRAW_CARD = gql`
  mutation Draw($gameId: ID!, $playerId: ID!) {
    drawCard(gameId: $gameId, playerId: $playerId) {
      id
      topCard { color type value }
      players {
        id name
        hand { color type value }
      }
    }
  }
`;

export async function apiCreateGame() {
  const res = await apolloClient.mutate({ mutation: CREATE_GAME });
  return (res.data as any).createGame;
}

export async function apiJoinGame(gameId: string, name: string) {
  const res = await apolloClient.mutate({
    mutation: JOIN_GAME,
    variables: { gameId, name },
  });
  const payload = (res.data as any).joinGame;
  if (payload?.viewerId && typeof window !== "undefined") {
    localStorage.setItem("myPlayerId", payload.viewerId);
  }
  return payload?.game;
}

export async function apiPlayCard(gameId: string, playerId: string, cardIndex: number, chosenColor?: string) {
  const res = await apolloClient.mutate({
    mutation: PLAY_CARD,
    variables: { gameId, playerId, cardIndex, chosenColor },
  });
  return (res.data as any).playCard;
}

export async function apiDrawCard(gameId: string, playerId: string) {
  const res = await apolloClient.mutate({
    mutation: DRAW_CARD,
    variables: { gameId, playerId },
  });
  return (res.data as any).drawCard;
}
