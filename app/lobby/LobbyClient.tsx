"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setPlayerId } from "../lib/redux/playerSlice";
import { GET_GAMES, apiCreateGame, apiJoinGame } from "../lib/api/uno";
import { createApolloClient } from "../lib/apollo/client";

type Game = { id: string; players: { id: string; name: string }[] };

export default function LobbyClient({ initialGames, backendDown }: { initialGames: Game[]; backendDown?: boolean }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [games, setGames] = useState<Game[]>(initialGames);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const client = createApolloClient();
      const result = await client.query({ query: GET_GAMES, fetchPolicy: "no-cache" });
      setGames((result.data as { games: Game[] }).games);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    const name = prompt("Enter your name:");
    if (!name) return;

    const newGame = await apiCreateGame();
    const joined = await apiJoinGame(newGame.id, name);

    const me = joined.players.find((p: any) => p.name === name);
    if (me) dispatch(setPlayerId(me.id));

    router.push(`/game/${newGame.id}`);
  }

  async function handleJoin(gameId: string) {
    const name = prompt("Enter your name:");
    if (!name) return;

    const joined = await apiJoinGame(gameId, name);

    const me = joined.players.find((p: any) => p.name === name);
    if (me) dispatch(setPlayerId(me.id));

    router.push(`/game/${gameId}`);
  }

  useEffect(() => {
    // keep initial SSR data; optional auto-refresh could be added later
  }, []);

  return (
    <div>
      <h2>🎮 UNO Lobby</h2>

      {backendDown && (
        <p style={{ color: "#c0392b" }}>
          Backend unreachable at {process.env.NEXT_PUBLIC_GRAPHQL_HTTP || "http://localhost:4000/graphql"}. Start the server and refresh.
        </p>
      )}

      <button onClick={handleCreate}>➕ Create Game</button>

      {loading && <p>Loading games...</p>}

      <ul>
        {games?.map((g: any) => (
          <li key={g.id}>
            Game {g.id} ({g.players.length} players)
            <button onClick={() => handleJoin(g.id)}>Join</button>
          </li>
        ))}
      </ul>

      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
