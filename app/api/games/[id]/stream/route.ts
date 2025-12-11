import { NextRequest } from "next/server";
import { subscribe, getGame } from "@/app/lib/gameStore";
import { Uno } from "@/app/lib/uno";

export const dynamic = "force-dynamic";

// Server-Sent Events for real-time game updates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`: connected\n\n`));

      // Send current game state immediately if it exists
      const gameData = getGame(id);
      if (gameData) {
        const topCard = gameData.state.discardPile[gameData.state.discardPile.length - 1];
        const currentPlayer = gameData.state.players[gameData.state.currentPlayer];

        const data = {
          id: gameData.id,
          winner: gameData.state.winner,
          topCard: topCard || null,
          activeColor: gameData.state.activeColor,
          direction: gameData.state.direction,
          currentPlayer: currentPlayer
            ? { id: currentPlayer.id, name: currentPlayer.name }
            : null,
          players: gameData.state.players.map((p) => ({
            id: p.id,
            name: p.name,
            hand: p.hand,
            handCount: p.hand.length,
          })),
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      }

      // Subscribe to future game updates
      const unsubscribe = subscribe(id, (game) => {
        const topCard = game.state.discardPile[game.state.discardPile.length - 1];
        const currentPlayer = game.state.players[game.state.currentPlayer];

        const data = {
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

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      });

      // Cleanup on connection close
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}