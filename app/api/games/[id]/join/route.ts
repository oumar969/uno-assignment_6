import { NextRequest, NextResponse } from "next/server";
import { getGame, joinGame as joinGameStore } from "@/app/lib/gameStore";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const viewerId = request.headers.get("x-player-id") || undefined;

  try {
    const result = joinGameStore(id, name, viewerId);

    return NextResponse.json({
      game: {
        id: result.game.id,
        players: result.game.players,
      },
      viewerId: result.viewerId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
