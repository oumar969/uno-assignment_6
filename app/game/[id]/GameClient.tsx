"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useSubscription } from "@apollo/client";
import { DRAW_CARD, PLAY_CARD, GAME_UPDATED, SAY_UNO } from "../../lib/operations";
import Hand from "../../components/Hand";
import Card from "../../components/Card";

export default function GameClient({ gameId }: { gameId: string }) {
  const params = useSearchParams();
  const playerId = params.get("viewerId") || "";

  const { data: subData } = useSubscription(GAME_UPDATED, { variables: { id: gameId } });
  const game = subData?.gameUpdated;

  const [playCard] = useMutation(PLAY_CARD);
  const [drawCard] = useMutation(DRAW_CARD);
  const [sayUno] = useMutation(SAY_UNO);

  if (!game) {
    return (
      <div>
        <h2>UNO Game {gameId}</h2>
        <p>Loading game...</p>
      </div>
    );
  }

  function play(card: any, index: number) {
    if (!playerId) {
      alert("No player ID found. Join the game first.");
      return;
    }
    const chosenColor =
      card.type === "Wild" || card.type === "WildDrawFour"
        ? prompt("Choose color (red, blue, green, yellow):") || undefined
        : undefined;

    playCard({ variables: { gameId, playerId, cardIndex: index, chosenColor } });
  }

  function draw() {
    if (!playerId) {
      alert("No player ID found. Join the game first.");
      return;
    }
    drawCard({ variables: { gameId, playerId } });
  }

  return (
    <div>
      <h2>UNO Game {game.id}</h2>

      {game.winner && <h1>🎉 {game.winner} won the game!</h1>}
      <h3>Players:</h3>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {game.players.map((p: any) => (
          <div
            key={p.id}
            style={{
              border:
                p.id === (game.currentPlayer?.id ?? null) ? "2px solid #2ecc71" : "1px solid #ddd",
              padding: 8,
              borderRadius: 8,
              minWidth: 160,
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {p.name} {p.id === playerId && "(You)"}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {p.id === (game.currentPlayer?.id ?? null) ? "(Current)" : ""}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ marginBottom: 6 }}>Cards: {p.handCount ?? p.hand?.length ?? 0}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {p.id === playerId ? (
                  <Hand hand={p.hand} onPlay={(card, i) => play(card, i)} />
                ) : (
                  Array.from({ length: p.handCount ?? p.hand?.length ?? 0 })
                    .slice(0, 6)
                    .map((_, i) => <Card key={i} back={true} color={null} type={null} />)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <h3>Top Card:</h3>

      {game.topCard ? (
        <Card color={game.topCard.color} type={game.topCard.type} value={game.topCard.value} />
      ) : (
        <p>No top card</p>
      )}

      <h3>Active Color:</h3>

      {game.activeColor ? (
        <div
          style={{
            width: "80px",
            height: "30px",
            borderRadius: "8px",
            background:
              game.activeColor === "red"
                ? "#e74c3c"
                : game.activeColor === "blue"
                ? "#3498db"
                : game.activeColor === "green"
                ? "#2ecc71"
                : game.activeColor === "yellow"
                ? "#f1c40f"
                : "#999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {game.activeColor}
        </div>
      ) : (
        <p>No active color</p>
      )}

      <h3>Direction:</h3>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>
        {game.direction === 1 ? "➡️ Clockwise" : "⬅️ Counterclockwise"}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={draw}>Draw Card</button>
        <button onClick={() => sayUno({ variables: { gameId, playerId } })}>UNO!</button>
      </div>
    </div>
  );
}
