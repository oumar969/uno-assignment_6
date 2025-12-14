"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { GET_GAMES, JOIN_GAME } from "@/app/lib/apollo/operations";

export default function Pending({ gameId }: { gameId: string }) {
  const router = useRouter();

  // Load the current game list
  const { data, refetch } = useQuery<{ games: any[] }>(GET_GAMES, { fetchPolicy: "network-only" });

  const [joinGame] = useMutation<{ joinGame: { viewerId: string } }, { gameId: string; name: string }>(
    JOIN_GAME
  );

  const games = data?.games ?? [];
  const game = games.find((g: any) => g.id === gameId);

  // No game found → 404
  if (!game) {
    return <h2>Game not found</h2>;
  }

  const players = game.players ?? [];
  const expected = game.expectedPlayers ?? 2;

  const storedName =
    typeof window !== "undefined" ? localStorage.getItem("playerName") : null;

  // Redirect if player isn’t logged in
  useEffect(() => {
    if (!storedName) {
      router.push(`/login?pending=${gameId}`);
    }
  }, [storedName, gameId, router]);

  // Auto-enter game when ready
  useEffect(() => {
    if (players.length >= expected && game.status === "active") {
      router.push(`/game/${gameId}?viewerId=${localStorage.getItem("myPlayerId")}`);
    }
  }, [players, expected, game.status]);

  async function join() {
    if (!storedName) return router.push(`/login?pending=${gameId}`);

    const res = await joinGame({
      variables: { gameId, name: storedName },
    });

    const viewerId = res.data!.joinGame.viewerId;
    localStorage.setItem("myPlayerId", viewerId);

    await refetch();
  }

  return (
    <div>
      <h1>UNO · Waiting Room</h1>

      <p>Game ID: {gameId}</p>

      <p>
        Players joined: {players.length} / {expected}
      </p>

      <ul>
        {players.map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {players.length < expected && (
        <button onClick={join}>Join game</button>
      )}

      <p>Waiting for players...</p>
    </div>
  );
}
