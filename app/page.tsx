export const dynamic = "force-static"; // home can be fully static

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <section>
        <p className="text-sm text-gray-500">Assignment 6 · Next.js SSR</p>
        <h1 className="text-3xl font-semibold">UNO Multiplayer (SSR)</h1>
        <p className="text-lg text-gray-700">
          This is the landing page. It is static-rendered. Use the lobby to join or create games.
        </p>
        <div className="mt-6 flex gap-4">
          <a
            className="rounded bg-black px-4 py-2 text-white"
            href="/lobby"
          >
            Go to Lobby
          </a>
         
        </div>
      </section>
     
    </main>
  );
}
