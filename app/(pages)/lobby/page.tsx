import LobbyClient from "./LobbyClient";

export const dynamic = "force-dynamic";
//initialGames and backendDown are fetched in LobbyClient on the client side
export default function LobbyPage() {
  return <LobbyClient initialGames={[]} backendDown={false} />;
}
