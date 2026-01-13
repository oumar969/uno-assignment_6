"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_GAME, JOIN_GAME, GET_GAMES } from "../../lib/apollo/operations";
import "./LobbyClient.css";

type Game = { id: string; players: { id: string; name: string }[] };
//backendDown prop if the backend is unreachable
//initialGames prop to populate the lobby initially
export default function LobbyClient({ initialGames, backendDown }: { initialGames: Game[]; backendDown?: boolean }) {
  const router = useRouter();
  const [createGame] = useMutation(CREATE_GAME);
  const [joinGame] = useMutation(JOIN_GAME);
  const { data: gamesData, refetch } = useQuery(GET_GAMES, { fetchPolicy: "network-only" });
  const [games, setGames] = useState<Game[]>(initialGames);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await refetch();
      setGames((res.data as any)?.games ?? (gamesData as any)?.games ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    const name = localStorage.getItem("playerName");
    if (!name) {
      router.push("/login");
      return;
    }

    const { data: createData } = await createGame({ variables: { expectedPlayers: 2 } });
    const gameId = (createData as any)?.createGame?.id;
    const { data: joinData } = await joinGame({ variables: { gameId, name } });
    const viewerId = (joinData as any)?.joinGame?.viewerId;

    localStorage.setItem("myPlayerId", viewerId);
    router.push(`/game/${gameId}?viewerId=${viewerId}`);
  }

  async function handleJoin(gameId: string) {
    const name = localStorage.getItem("playerName");
    if (!name) {
      router.push("/login");
      return;
    }

    const { data } = await joinGame({ variables: { gameId, name } });
    const viewerId = (data as any)?.joinGame?.viewerId;
    
    localStorage.setItem("myPlayerId", viewerId);
    router.push(`/game/${gameId}?viewerId=${viewerId}`);
  }

  useEffect(() => {
    // keep initial SSR data; optional auto-refresh could be added later
  }, []);

  return (
    <div className="lobby-container">
      <h2 className="lobby-header">🎮 UNO Lobby</h2>

      {backendDown && (
        <p style={{ color: "#c0392b" }}>
          Backend unreachable. Check if the Next.js server is running.
        </p>
      )}

      <button className="lobby-button" onClick={handleCreate}>➕ Create Game</button>

      {loading && <p>Loading games...</p>}

      <ul>
        {((gamesData as any)?.games ?? games)?.map((g: any) => (
          <li key={g.id}>
            Game {g.id} ({g.players.length} players)
            <button className="lobby-button" onClick={() => handleJoin(g.id)}>Join</button>
          </li>
        ))}
      </ul>

      <button className="lobby-button" onClick={refresh}>Refresh</button>
    </div>
  );
}
