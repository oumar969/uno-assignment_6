"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_GAME, JOIN_GAME, GET_GAMES } from "../lib/operations";

type Game = { id: string; players: { id: string; name: string }[] };

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
      setGames(res.data.games ?? gamesData?.games ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    const name = prompt("Enter your name:");
    if (!name) return;

    const { data: createData } = await createGame({ variables: { expectedPlayers: 2 } });
    const gameId = createData.createGame.id;
    const { data: joinData } = await joinGame({ variables: { gameId, name } });
    const viewerId = joinData.joinGame.viewerId;

    router.push(`/game/${gameId}?viewerId=${viewerId}`);
  }

  async function handleJoin(gameId: string) {
    const name = prompt("Enter your name:");
    if (!name) return;

    const { data } = await joinGame({ variables: { gameId, name } });
    const viewerId = data.joinGame.viewerId;
    router.push(`/game/${gameId}?viewerId=${viewerId}`);
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
        {(gamesData?.games ?? games)?.map((g: any) => (
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
