import { NextRequest, NextResponse } from "next/server";
import { getAllGames } from "@/app/lib/gameStore";
import { Uno } from "@/app/lib/uno";

export const dynamic = "force-dynamic";

// Serialize game for GraphQL-like response
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

export async function GET() {
  const games = getAllGames();

  const serialized = games.map((game) => ({
    id: game.id,
    players: game.players.map((p) => ({ id: p.id, name: p.name })),
  }));

  return NextResponse.json({ games: serialized });
}
