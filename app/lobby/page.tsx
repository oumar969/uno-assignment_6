import LobbyClient from "./LobbyClient";

// SSR/server-component: fetch the games list server-side so the initial HTML is rendered
// with data. Mark dynamic to avoid static caching, as lobby needs fresh data.
export const dynamic = "force-dynamic";

async function fetchGames() {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_HTTP || "http://localhost:4000/graphql";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: "query { games { id players { id name } } }" }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to load games: ${res.status}`);
    const json = await res.json();
    return { games: json.data?.games ?? [], backendDown: false };
  } catch (err) {
    console.error("Lobby fetch failed", err);
    return { games: [], backendDown: true };
  }
}

export default async function LobbyPage() {
  const { games, backendDown } = await fetchGames();
  return <LobbyClient initialGames={games} backendDown={backendDown} />;
}
