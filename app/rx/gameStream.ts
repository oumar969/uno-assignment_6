import { Observable } from "rxjs";
import { store } from "../lib/redux/store";
import { applyServerEvent } from "../lib/redux/gameSlice";

// Use Server-Sent Events (SSE) instead of GraphQL subscriptions
export function startGameStream(gameId: string) {
  const observable = new Observable((subscriber) => {
    const eventSource = new EventSource(`/api/games/${gameId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const gameState = JSON.parse(event.data);
        subscriber.next(gameState);
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
      subscriber.error(err);
    };

    // Cleanup function
    return () => {
      eventSource.close();
    };
  });

  observable.subscribe((gameState: any) => {
    store.dispatch(applyServerEvent(gameState));
  });
}
