import { v4 as uuidv4 } from "uuid";
import { createFunctionalGame, Uno } from "./uno";

export type GameWithMeta = {
  id: string;
  players: { id: string; name: string }[];
  state: Uno;
};

// In-memory store for games - shared across all requests
// This is a module-level variable that persists for the lifetime of the Node.js process
const gamesStore: GameWithMeta[] = [];

// Subscribers for real-time updates (used for SSE or polling)
type GameSubscriber = (game: GameWithMeta) => void;
const subscribers = new Map<string, Set<GameSubscriber>>();

export function getAllGames() {
  return gamesStore;
}

export function getGame(id: string) {
  return gamesStore.find((g) => g.id === id);
}

export function createGame() {
  const id = uuidv4();
  const gameState = createFunctionalGame([]);

  const game: GameWithMeta = {
    id,
    players: [],
    state: gameState,
  };

  gamesStore.push(game);
  notifySubscribers(id, game);
  return game;
}

export function joinGame(gameId: string, name: string, viewerId?: string) {
  const game = gamesStore.find((g) => g.id === gameId);
  if (!game) throw new Error("Game not found");

  const playerId = viewerId ?? uuidv4();

  // Register player if not already in
  let player = game.players.find((p) => p.id === playerId);
  if (!player) {
    player = { id: playerId, name };
    game.players.push(player);
  }

  // Rebuild game state with all players
  const corePlayers = game.players.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  game.state = createFunctionalGame(corePlayers);
  notifySubscribers(gameId, game);

  return { game, viewerId: playerId };
}

export function updateGameState(gameId: string, updatedState: Uno) {
  const game = gamesStore.find((g) => g.id === gameId);
  if (!game) throw new Error("Game not found");

  game.state = updatedState;
  notifySubscribers(gameId, game);
  return game;
}

// Subscription system for real-time updates
export function subscribe(gameId: string, callback: GameSubscriber) {
  if (!subscribers.has(gameId)) {
    subscribers.set(gameId, new Set());
  }
  subscribers.get(gameId)!.add(callback);

  return () => {
    subscribers.get(gameId)?.delete(callback);
  };
}

function notifySubscribers(gameId: string, game: GameWithMeta) {
  const subs = subscribers.get(gameId);
  if (subs) {
    subs.forEach((callback) => callback(game));
  }
}

export function getPlayerFromGame(game: GameWithMeta, playerId: string) {
  return game.players.find((p) => p.id === playerId);
}
