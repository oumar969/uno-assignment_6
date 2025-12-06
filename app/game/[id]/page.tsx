import GameClient from "./GameClient";

export const dynamic = "force-dynamic";

async function fetchGame(id: string) {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_HTTP || "http://localhost:4000/graphql";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `query Game($id: ID!) {
          game(id: $id) {
            id
            winner
            activeColor
            direction
            currentPlayer { id name }
            topCard { color type value }
            players {
              id
              name
              handCount
              hand { color type value back }
            }
          }
        }`,
        variables: { id },
      }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to load game ${id}: ${res.status}`);
    const json = await res.json();
    return { game: json.data?.game ?? null, backendDown: false };
  } catch (err) {
    console.error("Game fetch failed", err);
    return { game: null, backendDown: true };
  }
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const { game, backendDown } = await fetchGame(params.id);
  return <GameClient gameId={params.id} initialGame={game} backendDown={backendDown} />;
}
