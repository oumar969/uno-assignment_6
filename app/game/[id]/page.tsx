import GameClient from "./GameClient";
import { getGame } from "@/app/lib/gameStore";
import { Uno } from "@/app/lib/uno";

export const dynamic = "force-dynamic";

function serializeGame(game: { id: string; players: any[]; state: Uno }) {
  const topCard = game.state.discardPile[game.state.discardPile.length - 1];
  const currentPlayer = game.state.players[game.state.currentPlayer];

  return {
    id: game.id,
    winner: game.state.winner,
    topCard: topCard || null,
    activeColor: game.state.activeColor,
    direction: game.state.direction,
    currentPlayer: currentPlayer
      ? { id: currentPlayer.id, name: currentPlayer.name }
      : null,
    players: game.state.players.map((p) => ({
      id: p.id,
      name: p.name,
      hand: p.hand,
      handCount: p.hand.length,
    })),
  };
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gameData = getGame(id);
  
  // Always render the client - it will fetch via SSE if needed
  const game = gameData ? serializeGame(gameData) : null;
  return <GameClient gameId={id} initialGame={game} backendDown={false} />;
}
