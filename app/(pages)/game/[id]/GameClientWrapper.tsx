"use client";
import GameClient from "./GameClient";

export default function GameClientWrapper({ gameId }: { gameId: string }) {
  return <GameClient gameId={gameId} />;
}
