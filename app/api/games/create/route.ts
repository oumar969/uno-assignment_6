import { NextRequest, NextResponse } from "next/server";
import { createGame } from "@/app/lib/gameStore";

export const dynamic = "force-dynamic";

export async function POST() {
  const game = createGame();

  return NextResponse.json({
    id: game.id,
    players: game.players,
  });
}
