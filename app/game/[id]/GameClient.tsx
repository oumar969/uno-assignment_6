"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { setGame } from "../../lib/redux/gameSlice";
import { apiPlayCard, apiDrawCard } from "../../lib/api/uno";
import { startGameStream } from "../../rx/gameStream";
import Hand from "../../components/Hand";
import Card from "../../components/Card";

type GameState = any;

export default function GameClient({ gameId, initialGame, backendDown }: { gameId: string; initialGame: GameState; backendDown?: boolean }) {
  const dispatch = useDispatch();
  const game = useSelector((s: RootState) => s.game.current);
  const playerId = useSelector((s: RootState) => s.player.id);

  // hydrate from server-fetched data on first render
  useEffect(() => {
    if (initialGame) {
      dispatch(setGame(initialGame));
    } else if (!backendDown) {
      // If no initial game but backend is up, try to fetch it
      console.warn("No initial game provided, will fetch from stream");
    }
  }, [initialGame, dispatch, backendDown]);

  // start live subscription stream
  useEffect(() => {
    if (gameId) startGameStream(gameId);
  }, [gameId]);

  if (backendDown) {
    return (
      <div>
        <h2>UNO Game</h2>
        <p style={{ color: "#c0392b" }}>
          Backend unreachable. Start the Next.js server and refresh.
        </p>
      </div>
    );
  }

  // If initialGame is null but backend is fine, wait for SSE stream to load it
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

    apiPlayCard(gameId, playerId, index, chosenColor);
  }

  function draw() {
    if (!playerId) {
      alert("No player ID found. Join the game first.");
      return;
    }
    apiDrawCard(gameId, playerId);
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
      <button onClick={draw}>Draw Card</button>
    </div>
  );
}
