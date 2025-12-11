import { NextRequest, NextResponse } from "next/server";
import { getGame, getPlayerFromGame, updateGameState } from "@/app/lib/gameStore";
import { playFunctionalCard, Color } from "@/app/lib/uno";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { playerId, cardIndex, chosenColor } = body;

  if (!playerId || cardIndex === undefined) {
    return NextResponse.json(
      { error: "playerId and cardIndex are required" },
      { status: 400 }
    );
  }

  const game = getGame(id);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const player = getPlayerFromGame(game, playerId);
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const currentPlayer = game.state.players[game.state.currentPlayer];
  if (currentPlayer.name !== player.name) {
    return NextResponse.json({ error: "Not your turn!" }, { status: 400 });
  }

  const updatedState = playFunctionalCard(
    game.state,
    cardIndex,
    chosenColor as Color
  );

  updateGameState(id, updatedState);

  return NextResponse.json({ success: true });
}
