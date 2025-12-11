import LobbyClient from "./LobbyClient";
import { getAllGames } from "@/app/lib/gameStore";

export const dynamic = "force-dynamic";

export default async function LobbyPage() {
  const games = getAllGames();
  
  const serialized = games.map((game) => ({
    id: game.id,
    players: game.players.map((p) => ({ id: p.id, name: p.name })),
  }));
  
  return <LobbyClient initialGames={serialized} backendDown={false} />;
}
