//SSR generates HTML on the server and sends it to the browser
//CSR generates HTML in the browser using JavaScript
//SC are default in Next.js App Router
//SC cannot use hooks like useState or useEffect
//SC can fetch data directly from the server
import GameClientWrapper from "./GameClientWrapper";

export const dynamic = "force-dynamic";

export default async function GamePage(
  { params }: { params: { id: string } }
) {
  const { id } = params;

  return <GameClientWrapper gameId={id} />;
}
