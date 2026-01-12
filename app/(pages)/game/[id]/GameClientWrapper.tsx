"use client";
import GameClient from "./GameClient";
//Passes data (gameId) from server → client
export default function GameClientWrapper({ gameId }: { gameId: string }) {
  return <GameClient gameId={gameId} />;
}


