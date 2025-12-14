"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ proceedTo }: { proceedTo: string }) {
  const router = useRouter();
  const [name, setName] = useState("");

  function login() {
    if (!name) return;
    localStorage.setItem("playerName", name);
    router.push(proceedTo);
  }

  return (
    <div>
      <p>Choose a username:</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button disabled={!name} onClick={login}>
        Login
      </button>
    </div>
  );
}
