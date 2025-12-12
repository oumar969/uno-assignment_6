import GameClient from "./GameClient";

export const dynamic = "force-dynamic";

export default function GamePage({ params }: { params: { id: string } }) {
  return <GameClient gameId={params.id} />;
}
