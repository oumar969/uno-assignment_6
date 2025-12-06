UNO Assignment 6 – Next.js SSR

## Run the app

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
```

## Env vars

Create `.env.local`:

```
NEXT_PUBLIC_GRAPHQL_HTTP=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS=ws://localhost:4001/graphql
```

## Rendering choices (SSR vs client)

- Home (`/`): static (`dynamic = "force-static"`).
- Lobby (`/lobby`): server component fetch with `cache: "no-store"` (fresh SSR HTML), then client component for interactions.
- Game (`/game/[id]`): server-prefetch of initial game state, then client hydration + live subscription via GraphQL WS + RxJS.

## State & hydration

- Redux holds player/game state; Apollo + RxJS feed updates.
- Provider tree (`app/providers/Providers.tsx`) is client-only; server pages pass prefetched data into client components to avoid hydration mismatch.

## API

- By default the app talks to the existing GraphQL server on ports 4000/4001.
- If you want the API inside Next, move the schema/resolvers into `app/api` (Could-have) and point env vars to `http://localhost:3000/api/graphql`.

## Pages of interest

- `app/lobby/page.tsx` (server) + `app/lobby/LobbyClient.tsx` (client)
- `app/game/[id]/page.tsx` (server fetch) + `app/game/[id]/GameClient.tsx` (client UI + subscriptions)
- `app/page.tsx` landing with rendering rationale

## Testing notes

- Ensure your GraphQL backend is running on 4000/4001 before `npm run dev`.
- For build/start, keep the backend running separately or adjust env vars to a hosted endpoint.
