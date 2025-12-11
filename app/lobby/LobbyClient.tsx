"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setPlayerId } from "../lib/redux/playerSlice";
import { apiCreateGame, apiJoinGame, apiGetGames } from "../lib/api/uno";

type Game = { id: string; players: { id: string; name: string }[] };

export default function LobbyClient({ initialGames, backendDown }: { initialGames: Game[]; backendDown?: boolean }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [games, setGames] = useState<Game[]>(initialGames);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const result = await apiGetGames();
      setGames(result);
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
          Backend unreachable. Check if the Next.js server is running.
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
