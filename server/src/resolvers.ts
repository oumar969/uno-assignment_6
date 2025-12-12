import { v4 as uuidv4 } from "uuid";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "./pubsub";

import {
  createFunctionalGame,
  playFunctionalCard,
  drawFunctionalCard,
  sayUNO,
  Color,
  Uno,
} from "../../shared/uno";

// Types for game management
type PendingGame = {
  id: string;
  players: { id: string; name: string }[];
  expectedPlayers: number;
  state: "pending";
};

type IndexedUno = {
  id: string;
  players: { id: string; name: string }[];
  state: Uno;
  status: "active";
};

type GameEntry = PendingGame | IndexedUno;

const games: GameEntry[] = [];

const resolvers = {
  Query: {
    games: () => games,
    game: (_: any, { id }: { id: string }) => games.find((g) => g.id === id),
  },

  Mutation: {
    createGame: (_: any, { expectedPlayers = 2 }: { expectedPlayers?: number }) => {
      const id = uuidv4();

      // Opret pending game der venter på spillere
      const pendingGame: PendingGame = {
        id,
        players: [],
        expectedPlayers: expectedPlayers || 2,
        state: "pending",
      };

      games.push(pendingGame);
      console.log(`🎮 Game ${id} created, waiting for ${expectedPlayers} players`);
      return pendingGame;
    },

    joinGame: (_: any, { gameId, name }: any, context: any) => {
      const gameIndex = games.findIndex((g) => g.id === gameId);
      if (gameIndex === -1) throw new Error("Game not found");

      const game = games[gameIndex];
      const viewerId = context.viewerId ?? uuidv4();

      // Check if player already joined
      let player = game.players.find((p) => p.id === viewerId);
      if (!player) {
        player = { id: viewerId, name };
        game.players.push(player);
        console.log(`👤 Player ${name} (${viewerId}) joined game ${gameId}`);
      }

      // Check if we should start the game
      if (game.state === "pending" && game.players.length >= game.expectedPlayers) {
        console.log(`🚀 Starting game ${gameId} with ${game.players.length} players`);

        // Convert pending game to active game
        const corePlayers = game.players.map((p) => ({
          id: p.id,
          name: p.name,
        }));

        const gameState = createFunctionalGame(corePlayers);

        const activeGame: IndexedUno = {
          id: game.id,
          players: game.players,
          state: gameState,
          status: "active",
        };

        // Replace pending game with active game
        games[gameIndex] = activeGame;

        pubsub.publish("GAME_UPDATED", { gameUpdated: activeGame });

        return { viewerId, game: activeGame };
      }

      // Game is still pending
      return { viewerId, game };
    },

    playCard: (_: any, { gameId, playerId, cardIndex, chosenColor }: any) => {
      const game = games.find((g) => g.id === gameId) as IndexedUno | undefined;
      if (!game) throw new Error("Game not found");
      if (game.state === "pending") throw new Error("Game has not started yet");

      const player = game.players.find((p) => p.id === playerId);
      if (!player) throw new Error("Player not found");

      // kontroller tur
      const currentPlayer = game.state.players[game.state.currentPlayer];
      if (currentPlayer.name !== player.name)
        throw new Error("Not your turn!");

      // opdater state
      const updated = playFunctionalCard(
        game.state,
        cardIndex,
        chosenColor as Color
      );

      game.state = updated;

      console.log(`🎴 ${player.name} played card ${cardIndex}`);

      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return game;
    },

    drawCard: (_: any, { gameId, playerId }: any) => {
      const game = games.find((g) => g.id === gameId) as IndexedUno | undefined;
      if (!game) throw new Error("Game not found");
      if (game.state === "pending") throw new Error("Game has not started yet");

      const player = game.players.find((p) => p.id === playerId);
      if (!player) throw new Error("Player not found");

      const currentPlayer = game.state.players[game.state.currentPlayer];
      if (currentPlayer.name !== player.name)
        throw new Error("Not your turn!");

      game.state = drawFunctionalCard(game.state);

      console.log(`🃏 ${player.name} drew a card`);

      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return game;
    },

    sayUNO: (_: any, { gameId, playerId }: any) => {
      const game = games.find((g) => g.id === gameId) as IndexedUno | undefined;
      if (!game) throw new Error("Game not found");
      if (game.state === "pending") throw new Error("Game has not started yet");

      const player = game.players.find((p) => p.id === playerId);
      if (!player) throw new Error("Player not found");

      game.state = sayUNO(game.state);

      console.log(`🗣️  ${player.name} said UNO!`);

      pubsub.publish("GAME_UPDATED", { gameUpdated: game });

      return game;
    },
  },

  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["GAME_UPDATED"]) as any,
        (payload, variables) => payload.gameUpdated.id === variables.id
      ),
    },
  },

  Game: {
    status: (game: GameEntry) => {
      return game.state === "pending" ? "pending" : "active";
    },

    players: (game: GameEntry) => game.players,

    topCard: (game: GameEntry) => {
      if (game.state === "pending") return null;
      const top = game.state.discardPile.at(-1);
      if (!top) return null;
      return top;
    },

    activeColor: (game: GameEntry) => {
      if (game.state === "pending") return null;
      return game.state.activeColor;
    },

    direction: (game: GameEntry) => {
      if (game.state === "pending") return null;
      return game.state.direction;
    },

    currentPlayer: (game: GameEntry) => {
      if (game.state === "pending") return null;
      const p = game.state.players[game.state.currentPlayer];
      if (!p) return null;
      // returnér som GraphQL Player
      const found = game.players.find((x) => x.name === p.name);
      return found ?? null;
    },

    winner: (game: GameEntry) => {
      if (game.state === "pending") return null;
      const winner = game.state.players.find((p) => p.hand.length === 0);
      if (!winner) return null;
      return game.players.find((p) => p.name === winner.name) ?? null;
    },
  },

  Player: {
    hand: (player: any, _: any, context: any, info: any) => {
      const game = games.find((g) => g.id === info.variableValues.id);
      if (!game || game.state === "pending") return [];

      const unoPlayer = game.state.players.find((p) => p.name === player.name);

      if (!unoPlayer) return [];

      // Se egen hånd → returnér kort
      if (context.viewerId === player.id) {
        return unoPlayer.hand;
      }

      // Andre spillere → returnér bagsider (markér back=true)
      return unoPlayer.hand.map(() => ({ color: null, type: null, value: null, back: true }));
    },

    handCount: (player: any, _: any, __: any, info: any) => {
      const game = games.find((g) => g.id === info.variableValues.id);
      if (!game || game.state === "pending") return 0;

      const unoPlayer = game.state.players.find((p: any) => p.name === player.name);
      return unoPlayer?.hand.length ?? 0;
    },
  },
};

export default resolvers;
