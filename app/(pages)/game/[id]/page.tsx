//Next.js generates HTML for the route on each request
//the page are rendered on the server by default
//the server generate HTML befor browser loads the page
//the server components can fetch data directly from the server
import GameClientWrapper from "./GameClientWrapper";

export const dynamic = "force-dynamic";

export default async function GamePage(
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return <GameClientWrapper gameId={id} />;
}
