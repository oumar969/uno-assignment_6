import { gql } from "@apollo/client";

export const CREATE_GAME = gql`
  mutation CreateGame($expectedPlayers: Int) {
    createGame(expectedPlayers: $expectedPlayers) {
      id
      players { id name }
      status
    }
  }
`;

export const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!, $name: String!) {
    joinGame(gameId: $gameId, name: $name) {
      viewerId
      game { id players { id name } status }
    }
  }
`;

export const PLAY_CARD = gql`
  mutation PlayCard($gameId: ID!, $playerId: ID!, $cardIndex: Int!, $chosenColor: String) {
    playCard(gameId: $gameId, playerId: $playerId, cardIndex: $cardIndex, chosenColor: $chosenColor) {
      id
      status
    }
  }
`;

export const DRAW_CARD = gql`
  mutation DrawCard($gameId: ID!, $playerId: ID!) {
    drawCard(gameId: $gameId, playerId: $playerId) { id status }
  }
`;

export const SAY_UNO = gql`
  mutation SayUNO($gameId: ID!, $playerId: ID!) {
    sayUNO(gameId: $gameId, playerId: $playerId) { id status }
  }
`;

export const GAME_UPDATED = gql`
  subscription GameUpdated($id: ID!) {
    gameUpdated(id: $id) {
      id
      status
      players { id name handCount hand { color type value } }
      topCard { color type value }
      activeColor
      direction
      currentPlayer { id name }
      winner
    }
  }
`;

export const GET_GAMES = gql`
  query GetGames {
    games { id players { id name } status }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      status
      players { id name handCount hand { color type value } }
      topCard { color type value }
      activeColor
      direction
      currentPlayer { id name }
      winner
    }
  }
`;
