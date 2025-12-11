// REST API client for UNO game (replaces GraphQL)

function getPlayerId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("myPlayerId") || "";
  }
  return "";
}

export async function apiCreateGame() {
  const res = await fetch("/api/games/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to create game");
  return await res.json();
}

export async function apiJoinGame(gameId: string, name: string) {
  const playerId = getPlayerId();
  
  const res = await fetch(`/api/games/${gameId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-player-id": playerId,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Failed to join game");
  
  const data = await res.json();
  
  if (data.viewerId && typeof window !== "undefined") {
    localStorage.setItem("myPlayerId", data.viewerId);
  }
  
  return data.game;
}

export async function apiPlayCard(
  gameId: string,
  playerId: string,
  cardIndex: number,
  chosenColor?: string
) {
  const res = await fetch(`/api/games/${gameId}/play`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-player-id": playerId,
    },
    body: JSON.stringify({ playerId, cardIndex, chosenColor }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to play card");
  }
  
  return await res.json();
}

export async function apiDrawCard(gameId: string, playerId: string) {
  const res = await fetch(`/api/games/${gameId}/draw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-player-id": playerId,
    },
    body: JSON.stringify({ playerId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to draw card");
  }
  
  return await res.json();
}

export async function apiGetGames() {
  const res = await fetch("/api/games", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to get games");
  
  const data = await res.json();
  return data.games;
}

export async function apiGetGame(gameId: string) {
  const res = await fetch(`/api/games/${gameId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to get game");
  
  const data = await res.json();
  return data.game;
}
