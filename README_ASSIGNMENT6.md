# Assignment 6 - UNO Game with Next.js SSR

This project converts the Assignment 5 UNO game to use Next.js with Server-Side Rendering (SSR) and implements the API within Next.js instead of using an external GraphQL server.

## ✅ Requirements Met

### Must Have

- ✅ All features from Assignment 5 (UNO game with multiplayer, card playing, drawing)
- ✅ Uses Next.js for server-side rendering
- ✅ Works with both `npm run dev` and `npm run build; npm run start`

### Should Have

- ✅ Uses both server and client components
  - Server components: `page.tsx`, `lobby/page.tsx`, `game/[id]/page.tsx`
  - Client components: `GameClient.tsx`, `LobbyClient.tsx`, all interactive components
- ✅ Deliberate choices of static vs dynamic pages
  - **Static (SSG)**: Home page (`/`) - doesn't change, cached at build time
  - **Dynamic (SSR)**: Lobby and Game pages - need fresh data on every request

### Could Have

- ✅ **API implemented in Next.js** (no external server needed!)
  - All game logic runs inside Next.js API routes
  - Uses Server-Sent Events (SSE) for real-time updates instead of GraphQL subscriptions

## 🏗️ Architecture

### Server Components (SSR)

- `app/page.tsx` - Static home page
- `app/lobby/page.tsx` - Server-fetches games list before rendering
- `app/game/[id]/page.tsx` - Server-fetches game state before rendering

### Client Components

- `app/lobby/LobbyClient.tsx` - Interactive lobby with game creation/joining
- `app/game/[id]/GameClient.tsx` - Interactive game board with card playing

### API Routes (Next.js)

All API routes are in `app/api/games/`:

- `GET /api/games` - List all games
- `POST /api/games/create` - Create a new game
- `GET /api/games/[id]` - Get a specific game
- `POST /api/games/[id]/join` - Join a game
- `POST /api/games/[id]/play` - Play a card
- `POST /api/games/[id]/draw` - Draw a card
- `GET /api/games/[id]/stream` - Server-Sent Events for real-time updates

### UNO Game Logic

Located in `app/lib/uno/`:

- `uno.types.ts` - Immutable type definitions
- `uno.deck.ts` - Pure deck generation and shuffling
- `uno.rules.ts` - Game rule validation
- `uno.game.ts` - Core game logic (functional, immutable)
- `index.ts` - Public API

### Game Store

`app/lib/gameStore.ts` - In-memory game state management with pub/sub for real-time updates

## 🚀 Running the Project

### Development Mode

```powershell
npm run dev
```

Open http://localhost:3000

### Production Mode

```powershell
npm run build
npm run start
```

## 🎮 How to Play (Multiple Players)

To test with multiple players on the same machine:

1. **Player 1**: Open http://localhost:3000 in a normal browser window
   - Create a game and join
2. **Player 2**: Open http://localhost:3000 in an **incognito/private window**
   - Join the same game
3. **Player 3**: Use a different browser (e.g., Firefox if you used Chrome)
   - Join the same game

Each browser context has separate localStorage, allowing different player IDs.

## 🔄 Real-Time Updates

The project uses **Server-Sent Events (SSE)** instead of WebSockets/GraphQL subscriptions:

- More lightweight than WebSockets
- Works natively with HTTP/2
- Simpler to implement in Next.js
- Automatic reconnection handling

## 📦 Key Dependencies

- `next` - Next.js framework
- `react` & `react-dom` - React library
- `redux` & `@reduxjs/toolkit` - State management
- `rxjs` - Reactive programming for streams
- `uuid` - Unique ID generation
- `lodash` - Functional programming utilities

## 🏆 Differences from Assignment 5

| Assignment 5                   | Assignment 6                  |
| ------------------------------ | ----------------------------- |
| Separate GraphQL server        | API integrated in Next.js     |
| Apollo GraphQL + Subscriptions | REST API + Server-Sent Events |
| Client-only React app          | Server + Client components    |
| Client-side rendering          | Server-side rendering         |
| External backend at :4000      | Everything in Next.js :3000   |

## 📝 Notes

- The game state is stored in-memory (resets on server restart)
- For production, consider using a database or Redis
- SSE streams are one-way (server → client), which is perfect for game updates
- All game logic is pure and functional (no mutations)

## 👥 Group Information

**Group members:**

- [Your name and class]
- [Member 2 name and class]
- [Member 3 name and class]
- [Member 4 name and class]
