import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { typeDefs } from "./schema";
import resolvers from "./resolvers";
import { pubsub } from "./pubsub";

const schema = makeExecutableSchema({ typeDefs, resolvers });

// ---- HTTP + WS share same port ----
const httpServer = createServer();
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// GraphQL over WebSocket
useServer(
  {
    schema,
    context: (ctx: any) => {
      // connectionParams may contain headers like x-player-id
      const connectionParams = ctx.connectionParams || {};
      const viewerId = connectionParams["x-player-id"] || null;
      return { viewerId, pubsub };
    },
  },
  wsServer
);

// ---- HTTP Apollo server ----
const server = new ApolloServer({ schema });

async function start() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const viewerId = req?.headers["x-player-id"] || null;
      return { viewerId, pubsub };
    },
  });

  console.log(` Server running at: ${url}`);
  // Start the raw http server used by the websocket server on a different port
  const WS_PORT = 4001;
  httpServer.listen(WS_PORT, () => {
    console.log(` Subscriptions (ws) listening at: ws://localhost:${WS_PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("Server start failed:", err);
  process.exit(1);
});
