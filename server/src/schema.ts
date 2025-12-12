import gql from "graphql-tag";

export const typeDefs = gql`
  type Card {
    color: String
    type: String
    value: Int
    back: Boolean
  }

  type Player {
    id: ID!
    name: String!
    hand: [Card!]!
    handCount: Int!
  }

  type Subscription {
    gameUpdated(id: ID!): Game!
  }

  type Game {
    id: ID!
    players: [Player!]!
    topCard: Card
    direction: Int
    currentPlayer: Player
    activeColor: String
    winner: String
    status: String!
  }

  type Query {
    games: [Game!]!
    game(id: ID!): Game
  }

  type Mutation {
    createGame(expectedPlayers: Int): Game!
    joinGame(gameId: ID!, name: String!): JoinGamePayload!
    playCard(gameId: ID!, playerId: ID!, cardIndex: Int!, chosenColor: String): Game!
    drawCard(gameId: ID!, playerId: ID!): Game!
    sayUNO(gameId: ID!, playerId: ID!): Game!
  }

  type JoinGamePayload {
    game: Game!
    viewerId: ID!
  }
`;
