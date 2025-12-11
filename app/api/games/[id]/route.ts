import { NextRequest, NextResponse } from "next/server";
import { getGame } from "@/app/lib/gameStore";
import { Uno } from "@/app/lib/uno";

export const dynamic = "force-dynamic";

// Serialize game for response
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const game = getGame(id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ game: serializeGame(game) });
}
